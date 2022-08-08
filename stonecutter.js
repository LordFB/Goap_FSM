export var stonecutter = {
    parameters: {
        name: 'Stonecutter',
        health: 100,
        energy: 100,
        hunger: 0,
        stone: 0,
        damage: function (amount) {
            this.health = (this.health - amount).toFixed(1)
        },
        heal: function (amount) {
            this.health = Math.round(parseFloat(this.health + amount))
        },
        stateName: function () {
            return window.Goap[this.id].stateName
        }
    },
    states: {
        global: {
            name: 'global',
            effects: ['null'],
            outputs: [{
                    conditions: ['world.checkCap("stone") === true'],
                    transition: 'idle'
                }, {
                    conditions: ['danger === true', 'stateName() !== "flee"', 'stateName() !== "hide"'],
                    transition: 'flee'
                },
                {
                    conditions: ['health <= 0'],
                    transition: 'dead'
                },
                {
                    conditions: ['energy <= 10'],
                    transition: 'sleep'
                },
                {
                    conditions: ['axeDamage >= 25'],
                    transition: 'breakAxe'
                }
            ],
            update: function () {
                this.energy = Math.min(100, Math.round(this.energy * 100) / 100);
                if (this.axeDamage) this.axeDamage = Math.round(this.axeDamage * 100) / 100;
            },
            getData: function () {
                this.temp = {
                    id: this.id,
                    name: this.name,
                    health: this.health,
                    energy: this.energy,
                    stone: this.stone,
                    hasAxe: this.hasAxe,
                    axeDamage: this.axeDamage
                }
                return this.temp;
            }
        },
        idle: {
            name: 'idle',
            effects: [],
            outputs: [{
                    conditions: ['hasAxe === false'],
                    transition: 'findAxe'
                },
                {
                    conditions: ['hasAxe === undefined'],
                    transition: 'findAxe'
                },
                {
                    conditions: ['stone < 100'],
                    transition: 'findRock'
                },
                {
                    conditions: ['stone >= 100'],
                    transition: 'bringBackStone'
                },
            ]
        },
        findAxe: {
            name: 'Find Axe',
            effects: [],
            outputs: [
                {
                    conditions: ['world.resources.pickaxes > 0', ' hasAxe === undefined'],
                    transition: 'getAxe'
                },
                {
                    conditions: ['world.resources.pickaxes > 0', ' hasAxe === false'],
                    transition: 'getAxe'
                },
                {
                    conditions: ['world.resources.pickaxes > 0', ' hasAxe === true'],
                    transition: 'findRock'
                },
                {
                    conditions: ['world.resources.pickaxes <= 0'],
                    transition: 'requestAxe'
                },
            ]
        },
        requestAxe: {
            effects: ['world.addNeed("pickaxe", this.parameters.id)'],
            outputs: [{
                conditions: [],
                transition: 'findRock'
            }]
        },
        getAxe: {
            name: 'Get Axe',
            effects: ['world.removeNeed("pickaxe", this.parameters.id)', 'hasAxe = true', 'world.subtractItem("pickaxes", 1)'],
            outputs: [{
                conditions: ['hasAxe === true'],
                transition: 'findRock'
            }]
        },
        breakAxe: {
            name: 'Break Axe',
            effects: ['hasAxe = undefined', 'axeDamage = 0'],
            outputs: [{
                    conditions: ['world.resources.pickaxes > 0'],
                    transition: 'getAxe'
                },
                {
                    conditions: ['world.resources.pickaxes <= 0'],
                    transition: 'idle'
                },
            ]
        },
        flee: {
            name: 'Flee',
            effects: ['energy--', 'fleeTimer++'],
            outputs: [{
                    conditions: ['danger === false'],
                    transition: 'idle'
                },
                {
                    conditions: ['danger === true', 'fleeTimer > 10'],
                    transition: 'hide'
                },
            ]
        },
        hide: {
            name: 'Hide',
            effects: ['fleeTimer = 0'],
            outputs: [{
                conditions: ['danger === false'],
                transition: 'idle'
            }, ]
        },
        sleep: {
            name: 'Sleep',
            effects: ['energy += 0.5', 'world.addNeed("house", this.parameters.id)'],
            outputs: [{
                conditions: ['energy >= 100'],
                transition: 'idle'
            }, ]
        },
        findRock: {
            name: 'Find Rock',
            effects: ['findRockTimer++'],
            outputs: [{
                conditions: ['findRockTimer >= 10'],
                transition: 'walkToRock'
            }, ]
        },
        walkToRock: {
            name: 'Walk To Rock',
            effects: ['findRockTimer = 0', 'energy -= 0.1', 'rockWalkTimer++'],
            outputs: [{
                    conditions: ['rockWalkTimer >= 10', 'hasAxe === undefined'],
                    transition: 'mineRock'
                },
                {
                    conditions: ['rockWalkTimer >= 10', 'hasAxe === true'],
                    transition: 'mineRockWithAxe'
                },
            ]
        },
        mineRock: {
            name: 'Mine Rock',
            effects: ['rockWalkTimer = 0', 'energy -= 0.3', 'stone += 1'],
            outputs: [{
                conditions: ['stone >= 25'],
                transition: 'bringBackstone'
            }, ]
        },
        mineRockWithAxe: {
            name: 'Mine Rock With Axe',
            effects: ['rockWalkTimer = 0', 'energy -= 0.2', 'stone += 1', 'axeDamage += 0.05'],
            outputs: [{
                conditions: ['stone >= 25'],
                transition: 'bringBackstone'
            }, ]
        },
        bringBackstone: {
            name: 'Bring Back stone',
            effects: ['rockWalkTimer++', 'energy -= 0.1'],
            outputs: [{
                conditions: ['rockWalkTimer >= 10'],
                transition: 'dropstone'
            }, ]
        },
        dropstone: {
            name: 'Drop stone',
            effects: ['rockWalkTimer = 0', 'world.addItem("stone",this.parameters.stone)', 'stone = 0'],
            outputs: [{
                conditions: ['stone === 0'],
                transition: 'findAxe'
            }, ]
        }
    }
}