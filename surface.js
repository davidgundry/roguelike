Surface.prototype = new WorldLevel();
Surface.constructor = Surface;
function Surface(worldArea,levelID) {WorldLevel.call(this,worldArea,levelID);}

Surface.prototype.initialise = function(waysUp)
{
    this.waysUp = [];
}

Surface.prototype.generate = function()
{
    var gen = new SurfaceGen(this.mapSize*3+1,this.mapSize*3+1);
    var newMap = gen.generate();
    
    this.levelMap = [];
    for (var i=0;i<60;i++)
    {
      this.levelMap.push([]);
      for (var j=0;j<60;j++)
      {
	this.levelMap[i][j] = Surface.convertTileToFloorType(newMap[i][j]);
	this.interpretObjects(newMap[i][j],i,j);
      }
    }
    this.enemies = this.randomEnemies(this.levelID);
}

Surface.prototype.interpretObjects = function(tile,x,y)
{
  var objectToPlace = null;
  switch (tile)
  {
    case SurfaceGen.tile.WAYDOWN:
      objectToPlace = object.STEPSDOWN;
      this.waysDown.push({x:x,y:y,direction:Core.direction.NORTH}); //TODO: get real direction
      break;
  }
  if (objectToPlace != null)
    this.addObject({x:x,y:y},objectToPlace);
}


Surface.convertTileToFloorType = function(tile)
{
    switch (tile)
    {
      case SurfaceGen.tile.NONE:
	return floorType.ROCK;
      case SurfaceGen.tile.UNUSED:
	return floorType.WALL;
      case SurfaceGen.tile.GRASS:
	return floorType.GRASS;
      case SurfaceGen.tile.ROCK:
	return floorType.ROCK;
      case SurfaceGen.tile.SEA:
	return floorType.SEA;
      case SurfaceGen.tile.SHALLOWS:
	return floorType.SEA;
    }
    return floorType.GRASS;
}