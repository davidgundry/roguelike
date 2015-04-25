var floorType = {
      SEA : 0,
      GRASS: 8,
      SAND: 4,
      WALL: 24,
      ROCK: 16,
      FLOOR: 4
    }

function WorldLevel(worldArea,levelID)
{
    this.levelID = levelID;
    this.worldArea = worldArea;
    this.player = null;
    this.regionSize = 20 * 3;
    this.mapSize = 20;
    this.roomCount = 0;
    
    this.entrances = [];
    this.exits = [];
    
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
    
    this.challengeLevel = Math.ceil(this.levelID/2);
    console.log("Constructed WorldLevel");
}

WorldLevel.prototype.create = function(player)
{
    if (this.worldArea != null)
    {
      this.player = player;
      this.createCurrentRegion();
      console.log("Created WorldLevel with " + this.monsters.length + " monsters out of " + this.enemies.length + " enemies.");
    }
    else
      console.log("Cannot create a WorldLevel with a null worldArea");
}

WorldLevel.prototype.destroy = function()
{
    this.updateEnemyPositions();
    this.killAll();
    if (this.map != null)
      this.map.destroy();
    if (this.layer != null)
      this.layer.destroy();
    if (this.minimap != null)
      this.minimap.destroy();
    if (this.minimapLayer != null)
      this.minimapLayer.destroy();
    this.map = null;
    this.layer = null;
    this.minimap = null;
    this.minimapLayer = null;
}

WorldLevel.prototype.updateEnemyPositions = function()
{
    var newEnemies = []
    for (var i=0;i<this.enemies.length;i++)
    {
      if (!this.isLocationInRegion(this.enemies[i].location,this.regionX,this.regionY))
	newEnemies.push(this.enemies[i]);
    }
    for (var i=0;i<this.monsters.length;i++)
    {
      newEnemies.push({location:this.targetToLocation(this.monsters[i].target),enemy:this.monsters[i].enemy});
    }
    this.enemies = newEnemies;
}

WorldLevel.prototype.isLocationInRegion = function(location,rx,ry)
{
    if((location.x >= rx*this.mapSize) && (location.x < (rx+1)*this.mapSize))
      if((location.y >= ry*this.mapSize) && (location.y < (ry+1)*this.mapSize))
	return true;
    return false;
}

WorldLevel.prototype.targetToLocation = function(target)
{
    return {x:target.x+this.regionX*this.mapSize,y:target.y+this.regionY*this.mapSize};
}

WorldLevel.prototype.createObjects = function()
{
  if (this.objectsGroup != null)
    this.objectsGroup.destroy();
  this.objectsGroup = game.add.group();
  for (var i=0;i<this.objects.length;i++)
  {
    if (Math.floor(this.objects[i].location.x / this.mapSize) == this.regionX)
      if (Math.floor(this.objects[i].location.y / this.mapSize) == this.regionY)
      {
	var objectSprite = game.add.sprite(this.objects[i].location.x%this.mapSize*tileWidth,this.objects[i].location.y%this.mapSize*tileHeight,'objects');
	objectSprite.frame=this.objects[i].object.frame;
	this.objectsGroup.add(objectSprite);
      }
  }
}

WorldLevel.prototype.createCurrentRegion = function()
{
  if (this.player != null)
  {
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
    {
      this.monsters[i].sprite.animations.stop();
      this.monsters[i].sprite.destroy();
      this.monsters[i] = null;
    }
    for (var i=0;i<this.loot.length;i++)
    {
      this.loot[i].sprite.animations.stop();
      this.loot[i].sprite.destroy();
      this.loot[i] = null;
    }
    this.monsters = [];
    this.loot = [];
}

WorldLevel.prototype.changeRegionRight = function()
{
  if (this.regionX < 2)
  {
      this.destroy();
      this.regionX++;
      this.player.target = {x:0,y:this.player.target.y};
      this.createCurrentRegion();
  }
}

WorldLevel.prototype.changeRegionLeft = function()
{
  if (this.regionX > 0)
  {
      this.destroy();
      this.regionX--;
      this.player.target.x = this.mapSize-1;
      this.createCurrentRegion();
  }
}

WorldLevel.prototype.changeRegionUp = function()
{
  if (this.regionY > 0)
  {
      this.destroy();
      this.regionY--;
      this.player.target.y = this.mapSize-1;
      this.createCurrentRegion();
  }
}

WorldLevel.prototype.changeRegionDown = function()
{
  if (this.regionY < 2)
  {
      this.destroy();
      this.regionY++;
      this.player.target.y = 0;
      this.createCurrentRegion();
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
	    if (Math.floor(this.enemies[i].location.x / this.mapSize) == this.regionX)
		if (Math.floor(this.enemies[i].location.y / this.mapSize) == this.regionY)
		    this.monsters.push(new Monster(this.enemies[i].enemy,this.enemies[i].location.x%this.mapSize,this.enemies[i].location.y%this.mapSize,this));
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

WorldLevel.prototype.isMonsterAtLocation = function(location)
{
    for (var i=0;i<this.monsters.length;i++)
    {
	if ((this.monsters[i].location.x+this.regionX*this.mapSize == location.x) && (this.monsters[i].target.y+this.regionY*this.mapSize == location.y))
	    return true;
    }
    return false;
}


WorldLevel.prototype.isObjectAt = function(target)
{
    for (var i=0;i<this.objects.length;i++)
    {
	if ((this.objects[i].location.x == target.x+(this.mapSize*this.regionX)) && (this.objects[i].location.y == target.y+(this.mapSize*this.regionY)))
	    return true;
    }
    return false;
}

WorldLevel.prototype.isObjectAtLocation = function(location)
{
    for (var i=0;i<this.objects.length;i++)
    {
	if ((this.objects[i].location.x == location.x) && (this.objects[i].location.y == location.y))
	    return true;
    }
    return false;
}

WorldLevel.prototype.getObjectAt = function(target)
{
    var foundObject;
    for (var i=0;i<this.objects.length;i++)
    {
	if ((this.objects[i].location.x == target.x+(this.mapSize*this.regionX)) && (this.objects[i].location.y == target.y+(this.mapSize*this.regionY)))
	    return this.objects[i];
    }
    return null;
}

WorldLevel.prototype.setObjectAt = function(target,o)
{
    for (var i=0;i<this.objects.length;i++)
    {
	if ((this.objects[i].location.x == target.x+(this.mapSize*this.regionX)) && (this.objects[i].location.y == target.y+(this.mapSize*this.regionY)))
	{
	    this.objects[i].object = o;
	    return true;
	}
    }
    return false
}

WorldLevel.prototype.removeObjectAt = function(target)
{
    for (var i=0;i<this.objects.length;i++)
    {
	if ((this.objects[i].location.x == target.x+(this.mapSize*this.regionX)) && (this.objects[i].location.y == target.y+(this.mapSize*this.regionY)))
	{
	    this.objects.splice(i,1);
	    return true;
	}
    }
    return false;
}

WorldLevel.prototype.addObject = function(location,object)
{
    this.objects.push({location:location,object:object});
}

WorldLevel.prototype.useObjectAt = function(target)
{
    var o = this.getObjectAt(target);
    if (o != null)
    {
      switch (o.object)
      {
	case object.STEPSUP:
	  this.worldArea.switchLevel(this.levelID-1);
	  log.append("You go up the steps.");
	  return true;
	  break;
	case object.STEPSDOWN:
	  this.worldArea.switchLevel(this.levelID+1);
	  log.append("You go down the steps.");
	  return true;
	  break;
	case object.TRAPDOOR:
	  this.setObjectAt(target,object.HOLE);
	  log.append("You fell through a trapdoor!");
	  this.worldArea.switchLevel(this.levelID+1);
	  return false;
	  break;
	case object.HOLE:
	  log.append("You fell down a hole!");
	  this.worldArea.switchLevel(this.levelID+1);
	  return false;
	  break;
	case object.TELEPORT:
	  log.append("You have been teleported!");
	  var snd = game.add.audio('SND_TELE');
	  snd.play();
	  return true;
	  break;
	case object.DOOR:
	  this.removeObjectAt(target);
	  return true;
	  break;
	case object.LOCKEDDOOR:
	  log.append("The door is locked");
	  var snd = game.add.audio('SND_LOCK');
	  snd.play();
	  return true;
	  break;
	case object.TRAPPEDDOOR:
	  log.append("Boom! The door was trapped!");
	  var snd = game.add.audio('SND_TRAP');
	  snd.play();
	  return true;
	  break;
	case object.SECRETDOOR:
	  log.append("You find a secret door!");
	  this.setCellAt(target,4);
	  return true;
	  break;
	case object.GATE:
	  return true;
	  break;
	case object.LEVER:
	  log.append("You hear the sound of a gate opening in the distance...");
	  var snd = game.add.audio('SND_LEVR');
	  snd.play();
	  return true;
	  break;
	case object.PRESSUREPLATE:
	  log.append("You stepped on a pressure plate!");
	  var snd = game.add.audio('SND_PPLT');
	  snd.play();
	  return false;
	  break;
	case object.CHEST:
	  this.setObjectAt(target,object.OPENCHEST);
	  this.player.gainObject(this.randomChestContents(this.challengeLevel));
	  return true;
	  break;
	case object.LOCKEDCHEST:
	  log.append("The chest is locked.");
	  var snd = game.add.audio('SND_LOCK');
	  snd.play();
	  return true;
	  break;
	case object.TRAPPEDCHEST:
	  log.append("Boom! The chest was trapped!");
	  var snd = game.add.audio('SND_TRAP');
	  snd.play();
	  return true;
	  break;
	case object.OPENCHEST:
	  return true;
	  break;
	case object.TRASHHEAP:
	  this.setObjectAt(target,object.EMPTYHEAP);
	  return true;
	  break;
	case object.EMPTYHEAP:
	  return true;
	  break;
	case object.BOOKCASE:
	  this.setObjectAt(target,object.EMPTYBOOKCASE);
	  return true;
	  break;
	case object.EMPTYBOOKCASE:
	  return true;
	  break;
	case object.FOUNTAIN:
	  log.append("You drink from the fountain.");
	  this.setObjectAt(target,object.DRYFOUNTAIN);
	  var snd = game.add.audio('SND_GULP');
	  this.player.heal(10);
	  snd.play();
	  return true;
	  break;
	case object.DRYFOUNTAIN:
	  return true;
	  break;
	case object.BED:
	  return true;
	  break;
	case object.CTREE:
	  return true;
	  break;
	case object.DTREE:
	  return true;
	  break;
	case object.CACTUS:
	  return true;
	  break;
	case object.APPLETREE:
	  this.setObjectAt(target,object.DTREE);
	  this.player.heal(1);
	  log.append("Eating an apple restores 1 HP.");
	  var snd = game.add.audio('SND_APPL');
	  snd.play();
	  return true;
	  break;
      }
    }
    else
      console.log("Attempted to use non-existant object");
}

WorldLevel.prototype.randomChestContents = function(challengeLevel)
{
    var r = RNR(1,100)
    if (r >= 0) //90
    {
      var o = this.objectByChallengeLevel(challengeLevel);
      if (o != null)
	return o;
    }
    
    return armour[0];
}

WorldLevel.prototype.objectByChallengeLevel = function(challengeLevel)
{
    var a;
    switch (RNR(0,3))
    {
      case 0:
	a = weapon;
	break;
      case 1:
	a = armour;
	break;
      case 2:
	a = hat;
	break;
      case 3:
	a = amulet;
	break;
    }
    for (var i=1;i<a.length;i++)
    {
      if (a[i].level > challengeLevel)
	return a[i-1];
    }
    return a[a.length-1];
}

WorldLevel.prototype.setCellAt = function(target,newCell)
{
    this.levelMap[target.x+this.regionX*this.mapSize][target.y+this.regionY*this.mapSize] = newCell;
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
    return this.isValidLocation({x:target.x+this.regionX*this.mapSize,y:target.y+this.regionY*this.mapSize});
}


WorldLevel.prototype.isValidLocation = function(target)
{
    if ((target.x >= 0) && (target.y >= 0) && (target.x<this.mapSize*3) && (target.y<this.mapSize*3))
    {
	var t = this.levelMap[target.x][target.y];
	if ((t>=4) && (t<= 15))
	  return true;
	else if ((t>=20) && (t<= 23))
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
	  bmd.copy('minitileset',2*(index%8),2*(Math.floor(index/8)),2,2,i*4,j*4,4,4);
	}
    if (this.minimap != null)
      this.minimap.destroy();
    this.minimap = game.add.sprite(640,0, bmd);
    this.minimap.anchor.setTo(0,0);
    this.minimapLayer = game.add.sprite(640,0, bmd);
}

WorldLevel.prototype.updateMinimapLayer = function()
{
  var bmd = game.add.bitmapData(240, 240);
  if (this.objects != null)
  {
    for (var k=0;k<this.objects.length;k++)
    {
      var index = 29;
      bmd.copy('minitileset',2*(index%8),2*(Math.floor(index/8)),2,2,(this.objects[k].location.x)*4,(this.objects[k].location.y)*4,4,4);
    }
  }
  if (this.monsters != null)
  {
    for (var k=0;k<this.monsters.length;k++)
    {
      var index = 28;
      bmd.copy('minitileset',2*(index%8),2*(Math.floor(index/8)),2,2,(this.monsters[k].target.x+this.regionX*this.mapSize)*4,(this.monsters[k].target.y+this.regionY*this.mapSize)*4,4,4);
    }
  }
  if (this.player != null)
  {
    var index = 30;
    bmd.copy('minitileset',2*(index%8),2*(Math.floor(index/8)),2,2,(this.player.target.x+this.regionX*this.mapSize)*4,(this.player.target.y+this.regionY*this.mapSize)*4,4,4);
  }
  //if (this.minimapLayer != null)
  //    this.minimapLayer.destroy();
  this.minimapLayer.loadTexture(bmd);
  this.minimapLayer.anchor.setTo(0,0);
}

WorldLevel.prototype.placePlayerRandomly = function()
{
    while (true)
    {
	var x = RNR(0,this.mapSize*3);
	var y = RNR(0,this.mapSize*3);
	if (this.isValidLocation({x:x,y:y}))
	{
	  this.regionX =Math.floor(x/20);
	  this.regionY = Math.floor(y/20);
	  this.player.target = {x:x%20,y:y%20};
	  this.destroy();
	  this.createCurrentRegion();
	  break;
	}
    }
}