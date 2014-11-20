function World()
{
    this.mapSize = 5;
    this.player = null;
    this.map = game.add.tilemap();
    this.layer = this.map.create('level1', this.mapSize, this.mapSize, 32, 32);
    this.map.addTilesetImage('tileset');
    this.heightMap = this.generateHeightMap(this.mapSize,[500,350,250,150,120,100,90,80,70,60,50,35,25,20,15,10,5],-0.9,1199,0);
    for (var i=0;i<this.mapSize;i++)
	for (var j=0;j<this.mapSize;j++)
	{
	    this.heightMap[i][j] = Math.floor(this.heightMap[i][j]/100);
	    this.map.putTile(this.heightMap[i][j],i,j,this.layer);
	}
    this.numEnemies = 10;
    this.enemies = [this.numEnemies];
    this.loot = [];
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

World.prototype.killLootAt = function(target)
{
    for (var i=0;i<this.loot.length;i++)
    {
	if ((this.loot[i].target.x == target.x) && (this.loot[i].target.y == target.y))
	{
	    this.player.coins++;
	    this.loot[i].kill();
	}
    }
}

/*
 * This might hang if there is not enough free space to put enemies.
 */
World.prototype.createEnemies = function()
{
    for (var i=0;i<this.numEnemies;i++)
    {
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
	    if ((this.isValidTarget({x:x,y:y})) && !(this.isEnemyAt({x:x,y:y})) && !(this.isPlayerAt({x:x,y:y})))
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
    if ((target.x >= 0) && (target.y >= 0) && (target.x<this.map.width) && (target.y<this.map.height))
    {
	if (this.heightMap[target.x][target.y]>3)
	  if (this.heightMap[target.x][target.y]<10)
	    return true;
    }
    return false;
}

World.prototype.generateHeightMap = function(regionSize,rnr,sealevel,max,min)
{
    var randomNumberRange = rnr[0];
    var squaresize = regionSize-1;

    //TODO: Gah javascript. Hack.
    var array = new Array(regionSize+this.mapSize);
    for (var i=0; i<regionSize+this.mapSize;i++)
    {
	array[i] = new Array(regionSize+this.mapSize);
	for (var j=0; j<regionSize+this.mapSize;j++)
	{
	    array[i][j] = 3;
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
	    //console.log(array[i][j]);
	}
		
    return array;
}