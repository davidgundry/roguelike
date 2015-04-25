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
    this.levelMap = gen.getLevelMap();
    this.objects = gen.getObjects();
    this.enemies = gen.getEnemies();
    this.entrances = gen.getEntrances();
}


