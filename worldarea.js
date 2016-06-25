 function WorldArea(world)
{
    this.world = world;
    this.currentLevel = -1;
    this.levels = [];
  
    this.regionSize = 20 * 3;
    this.mapSize = 20;
}

WorldArea.prototype.create = function(player)
{
    this.player = player;
    this.levels[0] = new Surface(this,0);
    this.levels[0].initialise(null);
    this.levels[0].generate();    
    this.switchLevel(0);
    console.log("Created WorldArea");
}

WorldArea.prototype.destroy = function()
{
    this.player = null;
}

WorldArea.prototype.switchLevel = function(level)
{
    if ((level < this.levels.length) && (level >=0))
    {
      	var rx = 0;
	var ry = 0;
	if (this.currentLevel >= 0)
	{
	  rx = this.getLevel().regionX;
	  ry = this.getLevel().regionY;
	  this.getLevel().destroy();
	}
	this.currentLevel = level;
	this.getLevel().regionX = rx;
	this.getLevel().regionY = ry;
	this.getLevel().create(this.player);
	this.world.changedLevel();
    }
    else if (level == this.levels.length)
    {
	this.levels.push(new Dungeon(this,level));
	this.levels[level].initialise(this.levels[level-1].waysDown);
	this.levels[level].generate();
	this.switchLevel(level);
    }
    else
	console.log("Attempted to switch to non-existant level");
}

WorldArea.prototype.getLevel = function()
{
    return this.levels[this.currentLevel];
}