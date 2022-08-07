## Goap FSM Thing
***
JS state machine, with character objects.
Plain js, no deps.

Obviously this needs cost implemented before it's Goap, it's just a FSM now.

Free to use, no warranty.

#### Getting Started
***
```javascript

// Setup a character object with a single parameter energy
// Reduce energy when idle
// When idle and energy is below 10, transition to the sleep state
// Sleep until energy is at 100, then return to idle
// Applying effects on non-existent parameters creates the paramater for you

let simpleAI = {
    parameters:{
        energy:100
    },
    states:{

        // global and idle are the only mandatory states

        global:{
            name: 'global', 
            effects:['age++'], 
            outputs:[]
        },
        idle:{ 
            name: 'idle', 
            effects:['energy--'], 
            outputs:[
                { conditions: ['energy <= 10'], transition: 'sleep' }
            ]
        },
        sleep:{
            name:'Sleepingggggg',
            effects:['energy += 2'],
            outputs:[
                { conditions: ['energy === 100'], transition: 'idle' }
            ]            
        }

    }
}

// initialize Goap with the character object
let goap = new Goap(simpleAI);
// Console.log the goap
goap.debug() 
```

Example: https://lordfb.github.io/Goap_FSM/