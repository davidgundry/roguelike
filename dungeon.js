Dungeon.prototype = new WorldLevel();
Dungeon.constructor = Dungeon;
function Dungeon(worldArea,levelID) {WorldLevel.call(this,worldArea,levelID);}

Dungeon.prototype.initialise = function(waysUp)
{
    this.waysUp = waysUp;
}

Dungeon.prototype.generate = function()
{
    var gen = new DungeonGen(this.mapSize*3+1,this.mapSize*3+1,this.waysUp,5,3,3);
    gen.generate(10,0.5,true,false,true); //no cave, dungeons
    var newMap = gen.array;

    this.levelMap = [];
    for (var i=0;i<60;i++)
    {
	this.levelMap.push([]);
	for (var j=0;j<60;j++)
	{
	    this.levelMap[i][j] = Dungeon.convertTileToFloorType(newMap[i][j]);
	    this.interpretObjects(newMap[i][j],i,j);
	}
    }
    
    this.enemies = this.randomEnemies(this.levelID);
}


Dungeon.prototype.interpretObjects = function(tile,x,y)
{
  var objectToPlace = null;
  switch (tile)
  {
    case DungeonGen.tile.DOOR:
      objectToPlace = object.DOOR
      break;
    case DungeonGen.tile.FIXEDWAYDOWN:
      objectToPlace = object.STEPSDOWN
      break;
    case DungeonGen.tile.FIXEDWAYUP:
      objectToPlace = object.STEPSUP
      break;
  }
  if (objectToPlace != null)
    this.addObject({x:x,y:y},objectToPlace);
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
