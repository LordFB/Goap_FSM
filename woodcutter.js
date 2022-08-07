export var woodcutter = {
    parameters:{
      health:100,
      energy:100,
      hunger:0,
      wood:0,
      damage: (amount) => { this.health = (this.health - amount).toFixed(1)},
      heal: (amount) => { this.health = Math.round(parseFloat(this.health + amount)) },
      stateName: function() { return window.Goap[this.id].stateName }
    },
    states:{
      global:{
        name:'global',
        effects:['null'],
        outputs:[
          { conditions: ['danger === true', 'stateName() !== "flee"', 'stateName() !== "hide"'], transition: 'flee' },
          { conditions: ['health <= 0'], transition: 'dead' },
          { conditions: ['energy <= 10'], transition: 'sleep' }
        ]
      },
      idle:{
        name:'idle',
        effects:[],
        outputs:[
          { conditions: ['wood < 100'], transition: 'findTree' },
          { conditions: ['wood >= 100'], transition: 'bringBackWood' },
        ]
      },
      flee:{
        name:'Flee',
        effects:['energy--','fleeTimer++'],
        outputs:[
          { conditions: ['danger === false'], transition: 'idle' },
          { conditions: ['danger === true','fleeTimer > 10'], transition: 'hide' },
        ]
      },
      hide:{
        name:'Hide',
        effects:['fleeTimer = 0'],
        outputs:[
          { conditions: ['danger === false'], transition: 'idle' },
        ]
      },
      sleep:{
        name:'Sleep',
        effects:['energy += 2'],
        outputs:[
          { conditions: ['energy === 100'], transition: 'idle' },
        ]
      },
      findTree:{
        name:'Find Tree',
        effects:['findTreeTimer++'],
        outputs:[
          { conditions: ['findTreeTimer >= 10'], transition: 'walkToTree' },
        ]
      },
      walkToTree:{
        name:'Walk To Tree',
        effects:['findTreeTimer = 0','energy--','treeWalkTimer++'],
        outputs:[
          { conditions: ['treeWalkTimer >= 10'], transition: 'cutTree' },
        ]
      },
      cutTree:{
        name:'Cut Tree',
        effects:['treeWalkTimer = 0','energy--','wood += 10'],
        outputs:[
          { conditions: ['wood >= 100'], transition: 'bringBackWood' },
        ]
      },
      bringBackWood:{
        name:'Bring Back Wood',
        effects:['treeWalkTimer++','energy--'],
        outputs:[
          { conditions: ['treeWalkTimer >= 10'], transition: 'dropWood' },
        ]
      },
      dropWood:{
        name:'Drop Wood',
        effects:['treeWalkTimer = 0','wood = 0'],
        outputs:[
          { conditions: ['wood === 0'], transition: 'idle' },
        ]
      }
    }
  }