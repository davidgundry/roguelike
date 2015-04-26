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
	{
	  this.levelMap[i][j] = Dungeon.convertTileToFloorType(newMap[i][j]);
	  if (newMap[i][j] == DungeonGen.tile.DOOR)
	      this.addObject({x:i,y:j},object.DOOR);
	}
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
    return floorType.FLOOR;
}
