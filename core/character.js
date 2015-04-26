var knightLevels = [{},// Level 0 doesn't really exist, but this makes the indexes match
		    {xp:0, mgt:8,end:6,int:4,wis:4,hp:24,healingTurns:25}, 
		    {xp:100, mgt:8,end:6,int:4,wis:4,hp:30,healingTurns:25},
		    {xp:250, mgt:8,end:6,int:4,wis:4,hp:36,healingTurns:25},
		    {xp:500, mgt:9,end:6,int:4,wis:4,hp:43,healingTurns:25}, // Level 4
		    {xp:850, mgt:9,end:7,int:4,wis:4,hp:50,healingTurns:24},
		    {xp:1300, mgt:9,end:7,int:4,wis:4,hp:57,healingTurns:24},
		    {xp:1850, mgt:9,end:7,int:4,wis:4,hp:64,healingTurns:24}, 
		    {xp:2500, mgt:10,end:7,int:5,wis:5,hp:72,healingTurns:24} // Level 8
];

var characterClass = {
      KNIGHT : {name: "Knight", startCoins:0,startXP:0,startWeapon: weapon[1],startArmour: armour[0], startHat: hat[0], startAmulet: amulet[0], levels:knightLevels}
}
