export class Goap {
    constructor(goapAgent) {
        this.parameters = {};
        Object.assign(this.parameters,goapAgent.parameters);
        this.parameters.id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
        this.name = goapAgent.parameters.name;
        this.states = [];
        for (let i in goapAgent.states) {
            let charState = goapAgent.states[i];
            this.states.push(new GoapState(i, charState.effects, charState.outputs));
            if (charState.update) this.update = charState.update.bind(this.parameters);
            if (charState.getData) this.getData = charState.getData.bind(this.parameters);
            this.state = this.states.filter(s => s.name == 'idle')[0];
        }
        if (!window.Goap) window.Goap = {};
        window.Goap[this.name === "World" ? 'World' : this.parameters.id] = this;
    }
    addState(state) {
        this.states.push(state);
    }
    assignState(state) {
        this.state = this.states.filter(s => s.name == state)[0];
        this.stateName = state;
    }
    tick() {
        if (!this.state) return;
        if (window.Goap["World"] && this.name !== "World") {
            this.parameters.world = window.Goap["World"].parameters;
        }
        let globals = this.states.filter(x => x.name === 'global')[0];
        globals.effects.forEach(effect => {
            eval(`this.parameters.${effect}`);
        })
        this.state.effects.forEach(effect => {
            let varname = effect.split(' ')[0].replace(/[+\/*-]/g, '');
            if (!this.parameters[varname] && varname.indexOf('"') === -1) {
                eval(`this.parameters.${varname} = 0`);
            }
            eval(`this.parameters.${effect}`);
        });

        for (let i = 0; i < globals.outputs.length; i++) {
            let conditionsMet = 0;
            let out = globals.outputs[i];
            out.conditions.forEach(condition => {
                if (eval(`this.parameters.${condition}`)) conditionsMet++;
            });
            if (conditionsMet === out.conditions.length) {
                this.assignState(out.transition);
                return;
            }
        }

        for (let i = 0; i < this.state.outputs.length; i++) {
            let conditionsMet = 0;
            let out = this.state.outputs[i];
            out.conditions.forEach(condition => {
                if (eval(`this.parameters.${condition}`)) conditionsMet++;
            });
            if (conditionsMet === out.conditions.length) {
                this.assignState(out.transition);
                return;
            }
        }
        if (this.update) this.update();
    }
    debug() {
        console.log(this.parameters);
    }
}

class GoapState {
    constructor(name, effects, outputs) {
        this.name = name;
        this.effects = effects;
        this.outputs = outputs;
    }
}