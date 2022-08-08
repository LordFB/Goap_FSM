export var world = {
    parameters: {
        name: 'World',
        needs: [],
        capacity:{
            wood:1000,
            stone:1000
        },
        resources: {
            wood:0,
            stone:0,
            axes:2,
            pickaxes:1,
        },
        agents: 0,
        minute: 0,
        hour: 0,
        day: 0,
        year: 0,
        subtractItem: function (name, amount) {
            this.resources[name] = this.resources[name] - amount;
        },
        addItem: function (name, amount) {
            if (this.resources[name] === undefined) this.resources[name] = 0;
            this.resources[name] = this.resources[name] + amount;
        },
        addNeed: function (name, id) {
            let obj = {
                name,
                id
            };
            if (this.needs.filter(x => x.name === name && x.id === id).length === 0) {
                this.needs.push(obj);
            }
        },
        removeNeed: function (name, id) {
            let obj = {
                name,
                id
            };
            this.needs = this.needs.filter(x => x.name !== name && x.id !== id);
        },
        checkCap: function ( name ){
            return this.resources[name] >= this.capacity[name];
        }
    },
    states: {
        global: {
            effects: ['minute++'],
            outputs: [],
            update: function () {
                if (this.minute === 60) {
                    this.minute = 0;
                    this.hour++;
                }
                if (this.hour === 24) {
                    this.hour = 0;
                    this.day++;
                }
                if (this.day === 365) {
                    this.day = 0;
                    this.year++;
                }
                if (this.day > 45 && this.day < 320) {
                    if (this.day > 135) {
                        this.season = 'Summer'
                    } else if (this.day > 225) {
                        this.season = 'Fall'
                    } else this.season = 'Spring';
                } else {
                    this.season = 'Winter';
                }
            },
            getData: function () {
                this.temp = {
                    Time: `${this.hour}:${ ( this.minute < 10 ) ? '0' + this.minute : this.minute}`,
                    Date: `Day ${this.day} Year ${this.year}`,
                    Season: this.season,
                    Axes: this.axes,
                    Pickaxes: this.pickaxes,
                    Resources: this.resources,
                    Needs: this.needs
                }
                return this.temp;
            }
        },
        idle: {
            effects: [],
            outputs: []
        }
    }
}