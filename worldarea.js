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
    this.configureDungeonEntrances();
    
    this.switchLevel(0);
    console.log("Created WorldArea");
}

WorldArea.prototype.configureDungeonEntrances = function()
{
  if (this.levels[1] == null)
  {
    this.levels[1] = new Dungeon(this,1);
    this.levels[1].initialise();
  
    var numEntrances = 5;
    for (var i=0;i<numEntrances;i++)
    {
      var rx = RNR(0,2);
      var ry = RNR(0,2);
      if (i==0)
      {
	rx = 0;
        ry = 0;
      }
      var inx = RNR(5,this.mapSize-6);
      var iny = RNR(5,this.mapSize-6);
      var origin = {x:inx+rx*this.mapSize,y:iny+ry*this.mapSize};
      var loops = 0;
      while (!this.levels[1].generateRegionDungeon(origin,rx,ry))
      {
	loops++;
	if (loops == 10)
	  break;
      }
      if (loops < 10)
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
      var rx = this.getLevel().regionX;
      var ry = this.getLevel().regionY;
      if (this.getLevel() != null)
	this.getLevel().destroy();
      this.currentLevel = level;
      this.getLevel().regionX = rx;
      this.getLevel().regionY = ry;
      this.getLevel().create(this.player);
      this.world.changedLevel();
    }
    else
      console.log("Attempted to switch to non-existant level");
}

WorldArea.prototype.getLevel = function()
{
    return this.levels[this.currentLevel];
}