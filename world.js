function World()
{
    this.player = null;
    this.loot = [];
    this.monsters = [];
    
    this.mapSize=20;
   
    this.currentLevel = 0;
    this.levels = [];

    this.regionX = 0;
    this.regionY = 0;
    this.create();
}

World.prototype.create = function()
{
    this.levels[0] = new Surface(this);
    this.levels[0].generate();
    this.createCurrentRegion();
}

World.prototype.createObjects = function()
{
  for (var i=0;i<this.levels[this.currentLevel].objects.length;i++)
  {
      var objectSprite = game.add.sprite(this.levels[this.currentLevel].objects[i].location.x*tileWidth,this.levels[this.currentLevel].objects[i].location.y*tileHeight,'objects');
      objectSprite.frame=73;
  }
}

World.prototype.createCurrentRegion = function()
{
    if (this.map != null)
    {
      this.map.destroy();
      this.layer.destroy();
    }
    this.killAll();
    this.map = game.add.tilemap();
    this.layer = this.map.create('layer', this.mapSize, this.mapSize, 32, 32);
    this.layer.width=tileWidth*20;
    this.layer.height=tileHeight*20;
    this.map.addTilesetImage('tileset');
    
    for (var i=0;i<this.mapSize;i++)
      for (var j=0;j<this.mapSize;j++)
      {
	  this.map.putTile(this.levels[this.currentLevel].map[i+this.regionX*this.mapSize][j+this.regionY*this.mapSize],i,j,this.layer);
      }
      
    this.createObjects();
    this.createMonsters();
    this.createMinimap();
    this.updateMinimapLayer();
}

World.prototype.killAll = function()
{
    for (var i=0;i<this.monsters.length;i++)
      this.monsters[i].sprite.destroy();
    for (var i=0;i<this.loot.length;i++)
      this.loot[i].sprite.destroy();
    this.monsters = [];
    this.loot = [];
}

World.prototype.changeRegionRight = function()
{
  if (this.regionX < 2)
  {
      this.regionX++;
      this.createCurrentRegion();
      this.player.target.x = 0;
      this.player.recreate();
  }
}

World.prototype.changeRegionLeft = function()
{
  if (this.regionX > 0)
  {
      this.regionX--;
      this.createCurrentRegion();
      this.player.target.x = this.mapSize;
      this.player.recreate();
  }
}

World.prototype.changeRegionUp = function()
{
  if (this.regionY > 0)
  {
      this.regionY--;
      this.createCurrentRegion();
      this.player.target.y = this.mapSize;
      this.player.recreate();
  }
}

World.prototype.changeRegionDown = function()
{
  if (this.regionY < 2)
  {
      this.regionY++;
      this.createCurrentRegion();
      this.player.target.y = 0;
      this.player.recreate();
  }
}

World.prototype.isOffMap = function(target)
{
    if ((target.x < 0) || (target.y < 0) || (target.x >= this.mapSize) || (target.y >= this.mapSize))
      return true;
    return false;
}

World.prototype.isOffRegionRight = function(target)
{
    if ((target.x >= this.mapSize) && (this.regionX < 2))
      return true;
    return false;
}

World.prototype.isOffRegionLeft = function(target)
{
    if ((target.x <0 ) && (this.regionX > 0))
      return true;
    return false;
}
World.prototype.isOffRegionTop = function(target)
{
    if ((target.y < 0) && (this.regionY > 0))
      return true;
    return false;
}

World.prototype.isOffRegionBottom = function(target)
{
    if ((target.y >= this.mapSize ) && (this.regionY < 2))
      return true;
    return false;
}


World.prototype.createMinimap = function()
{    
    var bmd = game.add.bitmapData(240, 240);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, 240, 240);
    bmd.ctx.fillStyle = '#ff0000';
    bmd.ctx.fill();
    for (var i=0;i<this.mapSize*3;i++)
	for (var j=0;j<this.mapSize*3;j++)
	{
	  var index = this.levels[this.currentLevel].map[i][j];
	  bmd.copy('minitileset',2*(index%7),2*(Math.floor(index/7)),2,2,i*4,j*4,4,4);
	}
    if (this.minimap != null)
      this.minimap.destroy();
    this.minimap = game.add.sprite(640,0, bmd);
    this.minimap.anchor.setTo(0,0);
}

World.prototype.updateMinimapLayer = function()
{
  var bmd = game.add.bitmapData(240, 240);
  if (this.monsters != null)
  {
    for (var k=0;k<this.monsters.length;k++)
    {
      var index = 27;
      bmd.copy('minitileset',2*(index%7),2*(Math.floor(index/7)),2,2,(this.monsters[k].target.x+this.regionX*this.mapSize)*4,(this.monsters[k].target.y+this.regionY*this.mapSize)*4,4,4);
    }
  }
  if (this.player != null)
  {
    var index = 26;
    bmd.copy('minitileset',2*(index%7),2*(Math.floor(index/7)),2,2,(this.player.target.x+this.regionX*this.mapSize)*4,(this.player.target.y+this.regionY*this.mapSize)*4,4,4);
  }
  if (this.minimapLayer != null)
      this.minimapLayer.destroy();
  this.minimapLayer = game.add.sprite(640,0, bmd);
  this.minimapLayer.anchor.setTo(0,0);
}

World.prototype.addLoot = function(item)
{
    this.loot.push(item);
}

World.prototype.isLootAt = function(target)
{
    for (var i=0;i<this.loot.length;i++)
    {
	if ((this.loot[i].target.x == target.x) && (this.loot[i].target.y == target.y))
	    return true;
    }
    return false;
}

World.prototype.getLootAt = function(target)
{
    var foundLoot = [];
    for (var i=0;i<this.loot.length;i++)
    {
	if ((this.loot[i].target.x == target.x) && (this.loot[i].target.y == target.y))
	{
	    foundLoot.push( this.loot[i]);
	}
    }
    return foundLoot;
}

World.prototype.createMonsters = function()
{
    for (var i=0;i<this.levels[this.currentLevel].enemies.length;i++)
    {
	if (this.levels[this.currentLevel].enemies[i].location.x != -1)
	{
	    switch (this.levels[this.currentLevel].enemies[i].enemy)
	    {
	      case enemy.BANDIT:
		this.monsters[i] = new MonsterBandit(this.levels[this.currentLevel].enemies[i].location.x,this.levels[this.currentLevel].enemies[i].location.y,this);
		break;
	      case enemy.GOLEM:
		this.monsters[i] = new MonsterGolem(this.levels[this.currentLevel].enemies[i].location.x,this.levels[this.currentLevel].enemies[i].location.y,this);
		break;
	      case enemy.ANIMAL:
		this.monsters[i] = new MonsterAnimal(this.levels[this.currentLevel].enemies[i].location.x,this.levels[this.currentLevel].enemies[i].location.y,this);
		break;
	    }
	}
    }
}

World.prototype.isMonsterAt = function(target)
{
    for (var i=0;i<this.monsters.length;i++)
    {
	if ((this.monsters[i].target.x == target.x) && (this.monsters[i].target.y == target.y))
	    return true;
    }
    return false;
}

World.prototype.isObjectAt = function(target)
{
    for (var i=0;i<this.levels[this.currentLevel].objects.length;i++)
    {
	if ((this.levels[this.currentLevel].objects[i].location.x == target.x) && (this.levels[this.currentLevel].objects[i].location.y == target.y))
	    return true;
    }
    return false;
}

World.prototype.getObjectAt = function(target)
{
    var foundObject;
    for (var i=0;i<this.levels[this.currentLevel].objects.length;i++)
    {
	if ((this.levels[this.currentLevel].objects[i].location.x == target.x) && (this.levels[this.currentLevel].objects[i].location.y == target.y))
	    return this.levels[this.currentLevel].objects[i];
    }
    return null;
}

World.prototype.useObjectAt = function(target)
{
    var o = this.getObjectAt(target);
    if (o != null)
    {
      if (o.object == object.ENTRANCE)
      {
	  if (this.currentLevel == 0)
	    this.switchLevel(1);
	  else if (this.currentLevel == 1)
	    this.switchLevel(0);
      }
    }
    else
      console.log("Attempted to use non-existant object");
}

World.prototype.switchLevel = function(level)
{
    if (level < this.levels.length)
    {
      this.currentLevel = level;
      this.createCurrentRegion();
      this.player.recreate();
    }
    else
      console.log("Attempted to switch to non-existant level");
}

World.prototype.isPlayerAt = function(target)
{
    return ((this.player.target.x == target.x) && (this.player.target.y == target.y));
}

World.prototype.getMonsterAt = function(target)
{
    for (var i=0;i<this.monsters.length;i++)
    {
	if ((this.monsters[i].target.x == target.x) && (this.monsters[i].target.y == target.y))
	  return this.monsters[i];
    }
    return null;
}

World.prototype.isValidTarget = function(target)
{
    if ((target.x >= 0) && (target.y >= 0) && (target.x<this.mapSize) && (target.y<this.mapSize))
    {
	if (this.levels[this.currentLevel].map[target.x+this.regionX*this.mapSize][target.y+this.regionY*this.mapSize]>3)
	  if (this.levels[this.currentLevel].map[target.x+this.regionX*this.mapSize][target.y+this.regionY*this.mapSize]<10)
	      return true;
    }
    return false;
}


