var object = {
      NONE :{name:"None"},
      STEPSUP : {name:"Steps Up",frame:0},
      STEPSDOWN : {name:"Steps Down",frame:1},
      TRAPDOOR : {name:"Trapdoor",frame:2},
      HOLE : {name:"Hole",frame:3},
      TELEPORT :{name:"Teleport",frame:4},
      DOOR : {name:"Door",frame:5},
      LOCKEDDOOR : {name:"Locked Door",frame:6},
      TRAPPEDDOOR : {name:"Trapped Door",frame:7},
      SECRETDOOR : {name:"Secret Door",frame:8},
      GATE : {name:"Gate",frame:9},
      LEVER : {name:"Lever",frame:10},
      PRESSUREPLATE : {name:"Pressure Plate",frame:11},
      CHEST : {name:"Chest",frame:12},
      LOCKEDCHEST : {name:"Locked Chest",frame:13},
      TRAPPEDCHEST : {name:"Trapped Chest",frame:14},
      OPENCHEST : {name:"Open Chest",frame:15},
      TRASHHEAP : {name:"Trash Heap",frame:16},
      EMPTYHEAP : {name:"Empty Trash Heap",frame:17},
      BOOKCASE : {name:"Bookcase",frame:18},
      EMPTYBOOKCASE : {name:"Empty Bookcase",frame:19},
      FOUNTAIN : {name:"Fountain",frame:20},
      DRYFOUNTAIN : {name:"Dry Fountain",frame:21},
      BED : {name:"Bed",frame:22},
      CTREE : {name:"Tree",frame:23},
      DTREE : {name:"Tree",frame:24},
      CACTUS : {name:"Cactus",frame:25},
      APPLETREE : {name:"Apple Tree",frame:26}
      
    }
    
var direction = {
      NORTH : "north",
      SOUTH : "south",
      EAST : "east",
      WEST : "west"
    }
    
function randomDirection()
{
    var r = RNR(0,3);
    if (r==0)
      return direction.NORTH;
    if (r==1)
      return direction.SOUTH;
    if (r==2)
      return direction.EAST;
    else
      return direction.WEST;
}


Dungeon.prototype = new WorldLevel();
Dungeon.constructor = Dungeon;
function Dungeon(worldArea,levelID) {WorldLevel.call(this,worldArea,levelID);}

Dungeon.prototype.initialise = function(exits)
{
    this.exits = exits;
}

Dungeon.prototype.generate = function()
{
    var gen = new DungeonGen(this.mapSize*3+1,this.mapSize*3+1,this.exits,2);
    gen.generate(10,0.5,true);
    var newMap = gen.array;
    this.objects = gen.getObjects();
    this.enemies = gen.getEnemies();
    this.entrances = gen.getWaysDown();
    
    this.levelMap = [];
    for (var i=0;i<60;i++)
    {
      this.levelMap.push([]);
      for (var j=0;j<60;j++)
	this.levelMap[i][j] = Dungeon.convertTileToFloorType(newMap[i][j]);
    }
}

Dungeon.convertTileToFloorType = function(tile)
{
	switch (tile)
	{
	  case DungeonGen.tile.NONE:
	    return floorType.ROCK;
	  case DungeonGen.tile.WALL:
	    return floorType.WALL;
	  case DungeonGen.tile.FIXEDWALL:
	    return floorType.WALL;
	  case DungeonGen.tile.FLOOR:
	    return floorType.FLOOR;
	  case DungeonGen.tile.UNUSED:
	    return floorType.ROCK;
	  case DungeonGen.tile.DOOR:
	    return floorType.FLOOR;
	  case DungeonGen.tile.CORNER:
	    return floorType.WALL;
	  case DungeonGen.tile.FIXEDWAYUP:
	    return floorType.FLOOR;
	  case DungeonGen.tile.FIXEDWAYDOWN:
	    return floorType.FLOOR;
	  case DungeonGen.tile.FIXEDFLOOR:
	    return floorType.FLOOR;
	}
}
