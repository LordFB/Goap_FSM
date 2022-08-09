export const simpleAI = {
    parameters: {
        name: 'simpleAI',
        energy: 100,
        wander:false,
        position: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    states: {
        // global and idle are the only mandatory states
        global: {
            name: 'global',
            effects: ['age++'],
            outputs: [],
            update: function () {
                if( this.wander ){
                    this.position.x += (-0.5 + Math.random()) * 0.1;
                    this.position.y += (-0.5 + Math.random()) * 0.1;
                }
                this.position.x = Math.round(this.position.x * 100) / 100;
                this.position.y = Math.round(this.position.y * 100) / 100;
            },
            getData() {
                this.temp = {
                    id: this.id,
                    energy: this.energy,
                    age: this.age,
                    position: this.position
                };
                return this.temp;
            }
        },
        idle: {
            name: 'idle',
            effects: [],
            outputs: [{
                    conditions: ['energy <= 10'],
                    transition: 'sleep'
                },
                {
                    conditions: ['energy > 10'],
                    transition: 'wander'
                }
            ]
        },
        wander: {
            name: 'wander',
            effects: ['energy--', 'wander = true'],
            outputs: [{
                conditions: ['energy <= 10'],
                transition: 'sleep'
            }]
        },
        sleep: {
            name: 'Sleepingggggg',
            effects: ['energy += 2', 'wander = false'],
            outputs: [{
                conditions: ['energy === 100'],
                transition: 'idle'
            }]
        }

    }
}