function WorldArea(world)
{
    this.world = world;
    this.currentLevel = 0;
    this.levels = [];
  
    this.regionSize = 20 * 3;
    this.mapSize = 20;
}

WorldArea.prototype.create = function(player)
{
    this.player = player;
    this.levels[0] = new Surface(this,0);
    this.levels[0].initialise();
    this.levels[0].generate();
    //this.configureDungeonEntrances();
    
    this.switchLevel(0);
    console.log("Created WorldArea");
}

WorldArea.prototype.configureDungeonEntrances = function()
{
  if (this.levels[1] == null)
  {
    this.levels[1] = new Dungeon(this,1);
    this.levels[1].initialise();
  
    var numEntrances = 1;
    for (var i=0;i<numEntrances;i++)
    {
      var rx = RNR(0,0);
      var ry = RNR(0,0);
      var inx = RNR(0,this.mapSize);
      var iny = RNR(0,this.mapSize);
      var origin = {x:inx+rx*this.mapSize,y:iny+ry*this.mapSize};
      var loops = 0;
      while (!this.levels[1].generateRegionDungeon(origin,rx,ry))
      {
	loops++;
	if (loops == 100)
	  break;
      }
      if (loops < 100)
      {
	this.levels[1].addObject(origin,object.STEPSUP);
	this.levels[0].addObject(origin,object.STEPSDOWN);
      }
    }
  }
}

WorldArea.prototype.destroy = function()
{
    this.player = null;
}


WorldArea.prototype.switchLevel = function(level)
{
    if ((level < this.levels.length) && (level >=0))
    {
      this.currentLevel = level;
      this.getLevel().create(this.player);
    }
    else
      console.log("Attempted to switch to non-existant level");
}

WorldArea.prototype.getLevel = function()
{
    return this.levels[this.currentLevel];
}