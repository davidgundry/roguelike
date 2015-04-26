 var actions = {
      ANIMAL: "animal",
      DEFAULT: "default"
};
 
 var enemy = {
      BANDIT: {name:"bandit",hp:90,att:6,def:7,xp:50,loot:loot.REDPOTION,lootchance:0.3,altloot:loot.SILVERCOIN,emright:[28,29,30,31],emup:[28,29,30,31],emattackright:null,action:actions.DEFAULT},
      GOLEM: {name:"golem",hp:80,att:5,def:10,xp:40,loot:loot.BLUEPOTION,lootchance:0.3,altloot:loot.GOLDCOIN,emright:[0,1,2,3],emup:[0,1,2,3],emattackright:[9,10,11,12,13,0],action:actions.DEFAULT},
      
      //Vermin
      RAT: {name:"rat",xp:2,hp:20,att:5,def:5,loot:loot.COPPERCOIN,lootchance:0.5,altloot:loot.NONE,emright:[46,47],emup: [46,47],emattackright:null,friendly:false,action:actions.ANIMAL,actionProb: 70},
      SNAKE: {name:"snake",xp:2,hp:20,att:5,def:5,loot:loot.COPPERCOIN,lootchance:0.5,altloot:loot.NONE,emright:[42,43,44,45],emup: [42,43,44,45],emattackright:null,friendly:false,action:actions.ANIMAL,actionProb: 80},
      BEETLE: {name:"beetle",xp:2,hp:20,att:5,def:5,loot:loot.COPPERCOIN,lootchance:0.5,altloot:loot.NONE,emright:[48,48],emup: [50,51],emattackright:null,action:actions.DEFAULT},
      SCORPION: {name:"scorpion",xp:10,hp:52,att:5,def:6,loot:loot.COPPERCOIN,lootchance:0.8,altloot:loot.NONE,emright:[52,53],emup: [52,53],emattackright:null,action:actions.DEFAULT},
      SPIDER: {name:"spider",xp:10,hp:52,att:6,def:5,loot:loot.COPPERCOIN,lootchance:0.8,altloot:loot.NONE,emright:[54,55],emup: [54,55],emattackright:null,action:actions.DEFAULT},
      GIANTSPIDER: {name:"giant spider",xp:25,hp:74,att:6,def:7,loot:loot.NONE,lootchance:0,altloot:loot.COPPERCOIN,emright:[64,65],emup: [64,65],emattackright:null,action:actions.DEFAULT},
  
      //Animals
      CHICKEN: {name:"chicken",xp:0,hp:6,att:3,def:3,loot:loot.COPPERCOIN,lootchance:0.5,altloot:loot.NONE,emright:[56,57],emup: [56,57],emattackright:null,friendly:true,action:actions.ANIMAL, actionProb: 80},
      COW: {name:"cow",xp:2,hp:20,att:5,def:6,loot:loot.COPPERCOIN,lootchance:0.5,altloot:loot.NONE,emright:[58,59],emup: [58,59],emattackright:null,friendly:true,action:actions.ANIMAL, actionProb: 95},
      DOG: {name:"dog",xp:5,hp:52,att:5,def:6,loot:loot.COPPERCOIN,lootchance:0.5,altloot:loot.NONE,emright:[60,61],emup: [60,61],emattackright:null,friendly:true,action:actions.ANIMAL, actionProb: 70},
      WOLF: {name:"wolf",xp:25,hp:74,att:6,def:6,loot:loot.COPPERCOIN,lootchance:0.5,altloot:loot.NONE,emright:[62,63],emup: [62,63],emattackright:null,action:actions.DEFAULT}
};