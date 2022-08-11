/*
Starry night shader
https://www.shadertoy.com/view/lsXGWH
*/



import * as THREE from './three.module.js';
import {
    noise
} from './perlin.js';
export class WorldRenderer {
    constructor(target) {
        this.agents = [];
        this.worldZero = -1.8;
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x55AAEE, 1);
        this.renderer = renderer;
        document.querySelector(target).appendChild(renderer.domElement);

        const width = window.innerWidth;
        const height = window.innerHeight;
        const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
        camera.position.set(0, 0, 25);
        this.camera = camera;

        const scene = new THREE.Scene();
        this.scene = scene;

        const geometry = new THREE.PlaneGeometry(1, 1);
        this.skyUniforms = {
            time: {
                value: 0.0
            },
            realtime: {
                value: 0
            },
            resolution: {
                value: new THREE.Vector2(window.innerWidth, window.innerHeight)
            }
        }
        var material = new THREE.ShaderMaterial({
            uniforms: this.skyUniforms,
            vertexShader: `  varying vec2 vUv;
            void main() {
                vUv = uv;
                vec3 pos = vec3(position.x * 2.0, position.y * 2.0,1.0);
                gl_Position = vec4(pos, 1.0);
            }`,
            fragmentShader: `varying vec2 vUv;
            uniform float time;
            uniform float realtime;
            uniform vec2 resolution;
            float random(vec2 ab) 
            {
                float f = (cos(dot(ab ,vec2(21.9898,78.233))) * 43758.5453);
                return fract(f);
            }
            vec4 blend(vec4 source, vec4 dest, float alpha)
                {
                    return source * alpha + dest * (1.0-alpha);
                }

            float dist( vec2 a, vec2 b){
                return 0.0;
            }
            void main() {
                float t = 1.0 - time;
                vec3 color;
                vec3 disc;
                vec4 sunColor;
                
                if ( vUv.y > 0.4 ){
                    float a = 0.0;
                    vec2 factor = vec2(1.6,0.9);
                    vec2 sunPos = vec2(-0.8 + realtime / 520.0,time);
                    a = distance(vUv * factor,sunPos) * 2.0;
                   
                    float rand = random( vUv ) * 0.05;
                    vec3 skyDayTop = vec3(0.0,0.2,1.0 - rand);
                    vec3 skyDayBottom = vec3(0.7,0.8 - rand,1.0 - rand);
                    vec3 skyNightTop = vec3(0.1 + time,time * 0.75,0);
                    vec3 skyNightBottom = vec3(0.0,0.0,0.0);
                    sunColor = vec4(time + 0.1,time * 0.8,0.1,a + random(vUv));

                    vec3 skyDay = mix(skyDayTop,skyDayBottom,vUv.y - 0.1);
                    vec3 skyNight = mix(skyNightTop,skyNightBottom,vUv.y - 0.1);
                    vec3 sky = mix(skyDay, skyNight, t);

                    vec4 sunAlpha;
                    
                    if ( distance(vUv * factor,sunPos) < 0.1 ){
                        disc = vec3(0.8,0.8,0.1);
                    }
                    else{
                        color = vec3(sky);
                    }
                }
                else{
                    float rand = random( vUv ) * 0.05;
                    vec3 dark = vec3(0.1,0.15 - rand,0.1);
                    vec3 light = vec3(0.3,0.45 - rand,0.3);
                    vec3 grass = mix(dark,light,time);
                    color = vec3(grass);
                }

                gl_FragColor = vec4(mix(disc * 10.0,color,0.9),1.0);
            }`

        });
        const plane = new THREE.Mesh(geometry, material);
        this.backgroundPlane = plane;
        plane.position.set(0, 0, 0);
        this.background = plane;
        this.scene.add(plane);
        renderer.render(this.scene, this.camera);
    }
    draw() {
        let p = window.Goap["World"].parameters;
        //console.log( p.hour, p.minute)
        let b = this.brightnessLookup(p.hour, p.minute);
        this.backgroundPlane.material.uniforms.time.value = b;
        this.backgroundPlane.material.uniforms.realtime.value = p.hour * 60 + p.minute;
        for (const a in window.Goap) {
            const agent = window.Goap[a]
            if (agent.parameters.position !== undefined && agent.parameters.rendererSpawned === undefined) {
                agent.parameters.rendererSpawned = true;
                const geometry = new THREE.PlaneGeometry(0.15, 0.3);
                var material = new THREE.MeshBasicMaterial({
                    color: 0xffff00,
                    side: THREE.DoubleSide
                });
                const plane = new THREE.Mesh(geometry, material);
                agent.parameters.object3D = plane;
                this.scene.add(plane);
            }
            if (agent.parameters.rendererSpawned) {
                agent.parameters.object3D.position.set(agent.parameters.position.x, this.worldZero + agent.parameters.position.y, 15);
            }
        }
        this.renderer.render(this.scene, this.camera);
    }
    lerp(x, y, a) {
        return x * (1 - a) + y * a
    }
    brightnessLookup(h, m) {
        let brightness = [
            0.0,
            0.0,
            0.0,
            0.0,
            0.1,
            0.2,
            0.3, // 0600
            0.4,
            0.5,
            0.6,
            0.7,
            0.8,
            0.9, // 1200
            1.0,
            1.0,
            0.9,
            0.8,
            0.7,
            0.6, // 1600 
            0.5,
            0.4,
            0.3,
            0.2,
            0.1,
            0.0
        ];
        let low = brightness[h];
        let high = brightness[h + 1 || h]
        let val = this.lerp(low, high, m / 60)
        return val;
    }
}