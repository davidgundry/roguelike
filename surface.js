Surface.prototype = new WorldLevel();
Surface.constructor = Surface;
function Surface(worldArea,levelID) {WorldLevel.call(this,worldArea,levelID);}

Surface.prototype.initialise = function(exits)
{
    this.exits = [];
}

Surface.prototype.generate = function()
{
    var gen = new Generator(this.mapSize,this.entrances);
    gen.generateSurface(this.challengeLevel);
    var newMap = gen.getLevelMap();
    this.objects = gen.getObjects();
    this.enemies = gen.getEnemies();
    this.entrances = gen.getEntrances();
    
    this.levelMap = [];
    for (var i=0;i<60;i++)
    {
      this.levelMap.push([]);
      for (var j=0;j<60;j++)
	this.levelMap[i][j] = Dungeon.convertTileToFloorType(newMap[i][j]);
    }
}