export const woodcutter = {
  parameters: {
    name: 'Woodcutter',
    health: 100,
    energy: 100,
    hunger: 0,
    wood: 0,
    damage: (amount) => {
      this.health = (this.health - amount).toFixed(1)
    },
    heal: (amount) => {
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
          conditions: ['world.checkCap("wood") === true'],
          transition: 'idle'
        },
        {
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
          wood: this.wood,
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
          conditions: ['wood < 100'],
          transition: 'findTree'
        },
        {
          conditions: ['wood >= 100'],
          transition: 'bringBackWood'
        },
      ]
    },
    findAxe: {
      name: 'Find Axe',
      effects: ['world.addNeed("axe", this.parameters.id)'],
      outputs: [{
          conditions: ['world.resources.axes <= 0'],
          transition: 'findTree'
        },
        {
          conditions: ['world.resources.axes > 0'],
          transition: 'getAxe'
        },
      ]
    },
    getAxe: {
      name: 'Get Axe',
      effects: ['world.removeNeed("axe")', 'hasAxe = true', 'world.subtractItem("axes", 1)'],
      outputs: [{
        conditions: ['hasAxe === true'],
        transition: 'findTree'
      }]
    },
    breakAxe: {
      name: 'Break Axe',
      effects: ['hasAxe = undefined', 'axeDamage = 0'],
      outputs: [{
          conditions: ['world.resources.axes > 0'],
          transition: 'getAxe'
        },
        {
          conditions: ['world.resources.axes <= 0'],
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
    findTree: {
      name: 'Find Tree',
      effects: ['findTreeTimer++'],
      outputs: [{
        conditions: ['findTreeTimer >= 10'],
        transition: 'walkToTree'
      }, ]
    },
    walkToTree: {
      name: 'Walk To Tree',
      effects: ['findTreeTimer = 0', 'energy -= 0.1', 'treeWalkTimer++'],
      outputs: [{
          conditions: ['treeWalkTimer >= 10', 'hasAxe === undefined'],
          transition: 'cutTree'
        },
        {
          conditions: ['treeWalkTimer >= 10', 'hasAxe === true'],
          transition: 'cutTreeWithAxe'
        },
      ]
    },
    cutTree: {
      name: 'Cut Tree',
      effects: ['treeWalkTimer = 0', 'energy -= 0.25', 'wood += 2.5'],
      outputs: [{
        conditions: ['wood >= 25'],
        transition: 'bringBackWood'
      }, ]
    },
    cutTreeWithAxe: {
      name: 'Cut Tree With Axe',
      effects: ['treeWalkTimer = 0', 'energy -= 0.2', 'wood += 5', 'axeDamage += 0.3'],
      outputs: [{
        conditions: ['wood >= 25'],
        transition: 'bringBackWood'
      }, ]
    },
    bringBackWood: {
      name: 'Bring Back Wood',
      effects: ['treeWalkTimer++', 'energy -= 0.1'],
      outputs: [{
        conditions: ['treeWalkTimer >= 10'],
        transition: 'dropWood'
      }, ]
    },
    dropWood: {
      name: 'Drop Wood',
      effects: ['treeWalkTimer = 0', 'world.addItem("wood",this.parameters.wood)', 'wood = 0'],
      outputs: [{
        conditions: ['wood === 0'],
        transition: 'idle'
      }, ]
    }
  }
}