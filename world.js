function World()
{
    this.player = null;
    
    this.mapSize=20;
   
    this.heightMap = this.generateHeightMap(this.mapSize,[1200,1000,600,400,400,400,400,4000,4000,4000,1000,1000,1000,100,100,1],-0.5,1199,0);

    this.regionX = 0;
    this.regionY = 0;
    
    this.configureCurrentRegion();
    
    //this.createMinimap();
}

World.prototype.configureCurrentRegion = function()
{
    if (this.map != null)
    {
      this.map.destroy();
      this.layer.destroy();
    }
    this.map = game.add.tilemap();
    this.layer = this.map.create('layer', this.mapSize, this.mapSize, 32, 32);
    this.layer.width=tileWidth*20;
    this.layer.height=tileHeight*17;
    this.map.addTilesetImage('tileset');
    
    for (var i=0;i<this.mapSize;i++)
      for (var j=0;j<this.mapSize;j++)
      {
	  this.map.putTile(this.heightMap[i+this.regionX*this.mapSize][j+this.regionY*this.mapSize],i,j,this.layer);
      }

    this.numEnemies = 5;
    this.enemies = [this.numEnemies];
    this.createEnemies();
    this.loot = [];
}

World.prototype.changeRegionRight = function()
{
  if (this.regionX < 3)
  {
      this.regionX++;
      this.configureCurrentRegion();
      this.player.target.x = 0;
      this.player.recreate();
  }
}

World.prototype.changeRegionLeft = function()
{
  if (this.regionX > 0)
  {
      this.regionX--;
      this.configureCurrentRegion();
      this.player.target.x = this.mapSize;
      this.player.recreate();
  }
}

World.prototype.changeRegionUp = function()
{
  if (this.regionY > 0)
  {
      this.regionY--;
      this.configureCurrentRegion();
      this.player.target.y = this.mapSize;
      this.player.recreate();
  }
}

World.prototype.changeRegionDown = function()
{
  if (this.regionY < 3)
  {
      this.regionY++;
      this.configureCurrentRegion();
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
    if ((target.x >= this.mapSize) && (this.regionX < 3))
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
    if ((target.y >= this.mapSize ) && (this.regionY < 3))
      return true;
    return false;
}


World.prototype.createMinimap = function()
{    
    this.minilayer = this.map.create('minilayer', this.mapSize, this.mapSize, 2, 2);
    this.map.addTilesetImage('minitileset');
    var bmd = game.add.bitmapData(160, 160);
    for (var i=0;i<this.mapSize*4;i++)
	for (var j=0;j<this.mapSize*4;j++)
	{
	  bmd.draw(this.minilayer,i*2+540,j*2,2,2);
	}
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
    var foundLoot= [];
    for (var i=0;i<this.loot.length;i++)
    {
	if ((this.loot[i].target.x == target.x) && (this.loot[i].target.y == target.y))
	{
	    foundLoot.push( this.loot[i]);
	}
    }
    return foundLoot;
}

World.prototype.createEnemies = function()
{
    for (var i=0;i<this.numEnemies;i++)
    {
	if (Math.random() > 0.9)
	  this.enemies[i] = new MonsterBandit(-1,-1,this);
	else if (Math.random() > 0.8)
	  this.enemies[i] = new MonsterGolem(-1,-1,this);
	else
	  this.enemies[i] = new MonsterAnimal(-1,-1,this);
    }
    
    for (var i=0;i<this.numEnemies;i++)
    {
	var x,y;
	var found = false;
	var attempts = 0;
	while ((!found) && (attempts < 10))
	{
	    attempts++;
	    x = Math.floor(Math.random()*this.mapSize);
	    y = Math.floor(Math.random()*this.mapSize);
	    if ((this.isValidTarget({x:x,y:y})) && !(this.isEnemyAt({x:x,y:y})))
	      found = true;
	}
	if (!found)
	{
	    x = -1;
	    y = -1;
	}
	this.enemies[i].target = {x:x,y:y};
	this.enemies[i].setSpritePosition();
	if (!found)
	    this.enemies[i].kill();
    }
}

World.prototype.isEnemyAt = function(target)
{
    for (var i=0;i<this.numEnemies;i++)
    {
	if ((this.enemies[i].target.x == target.x) && (this.enemies[i].target.y == target.y))
	    return true;
    }
    return false;
}

World.prototype.isPlayerAt = function(target)
{
    return ((this.player.target.x == target.x) && (this.player.target.y == target.y));
}

World.prototype.getAt = function(target)
{
    for (var i=0;i<this.numEnemies;i++)
    {
	if ((this.enemies[i].target.x == target.x) && (this.enemies[i].target.y == target.y))
	  return this.enemies[i];
    }
    return null;
}

World.prototype.isValidTarget = function(target)
{
    if ((target.x >= 0) && (target.y >= 0) && (target.x<this.mapSize) && (target.y<this.mapSize))
    {
	if (this.heightMap[target.x+this.regionX*this.mapSize][target.y+this.regionY*this.mapSize]>3)
	  if (this.heightMap[target.x+this.regionX*this.mapSize][target.y+this.regionY*this.mapSize]<10)
	    return true;
    }
    return false;
}

World.prototype.generateHeightMap = function(regionSize,rnr,sealevel,max,min)
{
    var randomNumberRange = rnr[0];
    regionSize = regionSize * 4;
    var squaresize = regionSize-1;

    //TODO: Gah javascript. Hack.
    var array = new Array(regionSize+this.mapSize*4);
    for (var i=0; i<regionSize+this.mapSize*4;i++)
    {
	array[i] = new Array(regionSize+this.mapSize*4);
	for (var j=0; j<regionSize+this.mapSize*4;j++)
	{
	    array[i][j] = 4;
	}
    }
	
    array[0][0] = Math.random()*randomNumberRange;
    array[0][regionSize-1] = Math.random()*randomNumberRange;
    array[regionSize-1][0] = Math.random()*randomNumberRange;
    array[regionSize-1][regionSize-1] = Math.random()*randomNumberRange;

    randomNumberRange = rnr[1];

    var loop = 0;
    while (squaresize >= 2)
    {
	loop += 1;
	// square step
	for (var i=0; i<Math.floor(regionSize/squaresize);i++)
	{
	    for (var j=0;j<Math.floor(regionSize/squaresize);j++)
	    {
		var e = array[Math.floor(i*squaresize)][Math.floor(j*squaresize)];
		var f = array[Math.floor((i+1)*squaresize)][Math.floor(j*squaresize)];
		var g = array[Math.floor(i*squaresize)][Math.floor((j+1)*squaresize)];
		var h = array[Math.floor((i+1)*squaresize)][Math.floor((j+1)*squaresize)];
		var squareav = Math.floor((e+ f + g + h)/4);
		array[Math.floor(i*squaresize + squaresize/2)][Math.floor(j*squaresize + squaresize/2)] = squareav + Math.random()*randomNumberRange;
	    }
	}
	// diamond step
	for (var i=0;i<Math.floor(regionSize/squaresize);i++)
	{
	    for (var j=0;j<Math.floor(regionSize/squaresize);j++)
	    {
	      var a,b,c,d,x,y,w,z;
		if (Math.floor(-squaresize/2+ j*squaresize) < 0)
		    a = array[Math.floor(i*squaresize + squaresize/2)][Math.floor(-squaresize/2 + j*squaresize + regionSize)];
		else
		    a = array[Math.floor(i*squaresize + squaresize/2)][Math.floor(-squaresize/2 + j*squaresize)];
		b = array[Math.floor(i*squaresize + squaresize)][Math.floor(0 + j*squaresize)];
		c = array[Math.floor(i*squaresize)][Math.floor(0 + j*squaresize)];
		if (Math.floor(squaresize/2 + j*squaresize) < regionSize) 
		    d = array[Math.floor(i*squaresize + squaresize/2)][Math.floor(squaresize/2 + j*squaresize)];
		else
		    d = array[Math.floor(i*squaresize + squaresize/2)][Math.floor(squaresize/2 + j*squaresize-regionSize)];
		var diamondav = Math.floor((a + b + c + d)/4);
		array[Math.floor(i*squaresize)][Math.floor(j*squaresize + squaresize/2)] = diamondav + Math.random()*randomNumberRange;
		
		if (Math.floor(-squaresize/2 + i*squaresize) < 0)
		    w = array[Math.floor(-squaresize/2 + i*squaresize+regionSize)][Math.floor(j*squaresize + squaresize/2)];
		else
		    w = array[Math.floor(-squaresize/2 + i*squaresize)][Math.floor(j*squaresize + squaresize/2)];
		x = array[Math.floor(0 + i*squaresize)][Math.floor(j*squaresize)];
		y = array[Math.floor(0 + i*squaresize)][Math.floor(j*squaresize+squaresize)];
		if (Math.floor(squaresize/2 + i*squaresize) < regionSize)
		    z = array[Math.floor(squaresize/2 + i*squaresize)][Math.floor(j*squaresize + squaresize/2)];
		else
		    z = array[Math.floor(squaresize/2 + i*squaresize-regionSize)][Math.floor(j*squaresize + squaresize/2)];
		var diamondav2 = Math.floor((w + x + y + z)/4);
		array[Math.floor(i*squaresize + squaresize/2)][Math.floor(j*squaresize)] = diamondav2 + Math.random()*randomNumberRange;
	    }
	}
	squaresize = Math.floor(squaresize/2);
	randomNumberRange = rnr[loop+1];
    }

    averageAlt = 0;

    //Calculate the average altitude
    for (var i=0;i<regionSize;i++)
	for (var j=0;j<regionSize;j++)
	    averageAlt += array[i][j];

    var averageAlt = Math.floor(averageAlt / (regionSize*regionSize));

    // Lower the world depending on the height of the sealevel
    for (var i=0;i<regionSize;i++)
	for (var j=0;j<regionSize;j++)
	{
	    var height = Math.floor( array[i][j] - averageAlt*sealevel);
	    if (height > max)
	      height = max;
	    if (height < min)
	      height = min;
	    array[i][j] = height;
	    array[i][j] = Math.floor(array[i][j]/100);
	}
		
    return array;
}