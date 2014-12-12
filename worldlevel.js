function WorldLevel(worldArea,levelID)
{
    this.levelID = levelID;
    this.worldArea = worldArea;
    this.player = null;
    this.regionSize = 20 * 3;
    this.mapSize = 20;
    this.roomCount = 0;
    
    this.objects = [];
    this.enemies = [];
    this.levelMap = [];
    
    this.loot = [];
    this.monsters = [];
    
    this.regionX = 0;
    this.regionY = 0;
    
    this.map = null;
    this.layer = null;
    this.minimap = null;
    this.minimapLayer = null;
    console.log("Constructed WorldLevel");
}

WorldLevel.prototype.create = function(player)
{
    if (this.worldArea != null)
    {
      this.player = player;
      this.createCurrentRegion();
      console.log("Created WorldLevel");
    }
    else
      console.log("Cannot create a WorldLevel with a null worldArea");
}

WorldLevel.prototype.destroy = function()
{
    this.map.destroy();
    this.layer.destroy();
    this.killAll();
}

WorldLevel.prototype.createObjects = function()
{
  for (var i=0;i<this.objects.length;i++)
  {
      var objectSprite = game.add.sprite(this.objects[i].location.x*tileWidth,this.objects[i].location.y*tileHeight,'objects');
      objectSprite.frame=73;
  }
}

WorldLevel.prototype.createCurrentRegion = function()
{
  if (this.player != null)
  {
    if (this.map != null)
    {
      this.map.destroy();
      this.layer.destroy();
    }
    this.killAll();
    this.map = game.add.tilemap();
    this.layer = this.map.create('layer', this.mapSize, this.mapSize, 32, 32);
    this.layer.width=tileWidth*this.mapSize;
    this.layer.height=tileHeight*this.mapSize;
    this.map.addTilesetImage('tileset');
    
    for (var i=0;i<this.mapSize;i++)
      for (var j=0;j<this.mapSize;j++)
      {
	  this.map.putTile(this.levelMap[i+this.regionX*this.mapSize][j+this.regionY*this.mapSize],i,j,this.layer);
      }
      
    this.createObjects();
    this.createMonsters();
    this.player.recreate();
    this.createMinimap();
    this.updateMinimapLayer();
  }
  else
    console.log("Cannot create region with null player.");

}

WorldLevel.prototype.killAll = function()
{
    for (var i=0;i<this.monsters.length;i++)
      this.monsters[i].sprite.destroy();
    for (var i=0;i<this.loot.length;i++)
      this.loot[i].sprite.destroy();
    this.monsters = [];
    this.loot = [];
}

WorldLevel.prototype.changeRegionRight = function()
{
  if (this.regionX < 2)
  {
      this.regionX++;
      this.createCurrentRegion();
      this.player.target.x = 0;
      this.player.recreate();
  }
}

WorldLevel.prototype.changeRegionLeft = function()
{
  if (this.regionX > 0)
  {
      this.regionX--;
      this.createCurrentRegion();
      this.player.target.x = this.mapSize;
      this.player.recreate();
  }
}

WorldLevel.prototype.changeRegionUp = function()
{
  if (this.regionY > 0)
  {
      this.regionY--;
      this.createCurrentRegion();
      this.player.target.y = this.mapSize;
      this.player.recreate();
  }
}

WorldLevel.prototype.changeRegionDown = function()
{
  if (this.regionY < 2)
  {
      this.regionY++;
      this.createCurrentRegion();
      this.player.target.y = 0;
      this.player.recreate();
  }
}

WorldLevel.prototype.isOffMap = function(target)
{
    if ((target.x < 0) || (target.y < 0) || (target.x >= this.mapSize) || (target.y >= this.mapSize))
      return true;
    return false;
}

WorldLevel.prototype.isOffRegionRight = function(target)
{
    if ((target.x >= this.mapSize) && (this.regionX < 2))
      return true;
    return false;
}

WorldLevel.prototype.isOffRegionLeft = function(target)
{
    if ((target.x <0 ) && (this.regionX > 0))
      return true;
    return false;
}
WorldLevel.prototype.isOffRegionTop = function(target)
{
    if ((target.y < 0) && (this.regionY > 0))
      return true;
    return false;
}

WorldLevel.prototype.isOffRegionBottom = function(target)
{
    if ((target.y >= this.mapSize ) && (this.regionY < 2))
      return true;
    return false;
}


WorldLevel.prototype.addLoot = function(item)
{
    this.loot.push(item);
}

WorldLevel.prototype.isLootAt = function(target)
{
    for (var i=0;i<this.loot.length;i++)
    {
	if ((this.loot[i].target.x == target.x) && (this.loot[i].target.y == target.y))
	    return true;
    }
    return false;
}

WorldLevel.prototype.getLootAt = function(target)
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

WorldLevel.prototype.createMonsters = function()
{
    for (var i=0;i<this.enemies.length;i++)
    {
	if (this.enemies[i].location.x != -1)
	{
	    switch (this.enemies[i].enemy)
	    {
	      case enemy.BANDIT:
		this.monsters[i] = new MonsterBandit(this.enemies[i].location.x,this.enemies[i].location.y,this);
		break;
	      case enemy.GOLEM:
		this.monsters[i] = new MonsterGolem(this.enemies[i].location.x,this.enemies[i].location.y,this);
		break;
	      case enemy.ANIMAL:
		this.monsters[i] = new MonsterAnimal(this.enemies[i].location.x,this.enemies[i].location.y,this);
		break;
	    }
	}
    }
}

WorldLevel.prototype.isMonsterAt = function(target)
{
    for (var i=0;i<this.monsters.length;i++)
    {
	if ((this.monsters[i].target.x == target.x) && (this.monsters[i].target.y == target.y))
	    return true;
    }
    return false;
}

WorldLevel.prototype.isObjectAt = function(target)
{
    for (var i=0;i<this.objects.length;i++)
    {
	if ((this.objects[i].location.x == target.x) && (this.objects[i].location.y == target.y))
	    return true;
    }
    return false;
}

WorldLevel.prototype.getObjectAt = function(target)
{
    var foundObject;
    for (var i=0;i<this.objects.length;i++)
    {
	if ((this.objects[i].location.x == target.x) && (this.objects[i].location.y == target.y))
	    return this.objects[i];
    }
    return null;
}

WorldLevel.prototype.useObjectAt = function(target)
{
    var o = this.getObjectAt(target);
    if (o != null)
    {
      if (o.object == object.STEPSUP)
	  this.worldArea.switchLevel(this.levelID-1);
      else if (o.object == object.STEPSDOWN)
	  this.worldArea.switchLevel(this.levelID+1);
      
    }
    else
      console.log("Attempted to use non-existant object");
}

WorldLevel.prototype.isPlayerAt = function(target)
{
    return ((this.player.target.x == target.x) && (this.player.target.y == target.y));
}

WorldLevel.prototype.getMonsterAt = function(target)
{
    for (var i=0;i<this.monsters.length;i++)
    {
	if ((this.monsters[i].target.x == target.x) && (this.monsters[i].target.y == target.y))
	  return this.monsters[i];
    }
    return null;
}

WorldLevel.prototype.isValidTarget = function(target)
{
    if ((target.x >= 0) && (target.y >= 0) && (target.x<this.mapSize) && (target.y<this.mapSize))
    {
	if (this.levelMap[target.x+this.regionX*this.mapSize][target.y+this.regionY*this.mapSize]>3)
	  if (this.levelMap[target.x+this.regionX*this.mapSize][target.y+this.regionY*this.mapSize]<10)
	      return true;
    }
    return false;
}

WorldLevel.prototype.createMinimap = function()
{    
    var bmd = game.add.bitmapData(240, 240);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, 240, 240);
    bmd.ctx.fillStyle = '#ff0000';
    bmd.ctx.fill();
    for (var i=0;i<this.mapSize*3;i++)
	for (var j=0;j<this.mapSize*3;j++)
	{
	  var index = this.levelMap[i][j];
	  bmd.copy('minitileset',2*(index%7),2*(Math.floor(index/7)),2,2,i*4,j*4,4,4);
	}
    if (this.minimap != null)
      this.minimap.destroy();
    this.minimap = game.add.sprite(640,0, bmd);
    this.minimap.anchor.setTo(0,0);
}

WorldLevel.prototype.updateMinimapLayer = function()
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

