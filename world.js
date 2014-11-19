function World()
{
  this.map = game.add.tilemap();
  this.layer = this.map.create('level1', 10, 10, 32, 32);
  this.map.addTilesetImage('tileset');
  this.heightMap = this.generateHeightMap(10,[50,30,10,9,8,7,6,5,4,3,3,3,3,3,3,3,3],0.1,70,0);
  for (var i=0;i<10;i++)
    for (var j=0;j<10;j++)
    {
      this.heightMap[i][j] = Math.floor(this.heightMap[i][j]/10);
      // TODO: quick and dirty hack
      if (this.heightMap[i][j] == 0)
	this.heightMap[i][j] = 3;
      this.map.putTile(this.heightMap[i][j],i,j,this.layer);
    }
  this.numEnemies = 10;
  this.enemies = [this.numEnemies];
  for (var i=0;i<this.numEnemies;i++)
  {
    this.enemies[i] = new EasyMonster(Math.floor(Math.random()*10),Math.floor(Math.random()*10));
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
  return false;
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
    if (this.heightMap[target.x][target.y]>1)
      return true;
  }
  return false;
}

World.prototype.generateHeightMap = function(regionSize,rnr,sealevel,max,min)
{
    var randomNumberRange = rnr[0];
    var squaresize = regionSize;

    var array = new Array(regionSize+20);
    for (var i=0; i<regionSize+20;i++)
    {
	array[i] = new Array(regionSize+20);
	for (var j=0; j<regionSize+20;j++)
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
	for (var i=0; i<(regionSize/squaresize);i++)
	{
	    for (var j=0;j<(regionSize/squaresize);j++)
	    {
		var e = array[Math.floor(i*squaresize)][Math.floor(j*squaresize)];
		var f = array[Math.floor((i+1)*squaresize)][Math.floor(j*squaresize)];
		var g = array[Math.floor(i*squaresize)][Math.floor((j+1)*squaresize)];
		var h = array[Math.floor((i+1)*squaresize)][Math.floor((j+1)*squaresize)];
		var squareav = (e+ f + g + h)/4;
		array[Math.floor(i*squaresize + squaresize/2)][Math.floor(j*squaresize + squaresize/2)] = squareav + Math.random()*randomNumberRange;
	    }
	}
	// diamond step
	for (var i=0;i<(regionSize/squaresize);i++)
	{
	    for (var j=0;j<(regionSize/squaresize);j++)
	    {
	      var a,b,c,d,x,y,w,z;
		if (-squaresize/2 + j*squaresize < 0)
		    a = array[Math.floor(i*squaresize + squaresize/2)][Math.floor(-squaresize/2 + j*squaresize + regionSize)];
		else
		    a = array[Math.floor(i*squaresize + squaresize/2)][Math.floor(-squaresize/2 + j*squaresize)];
		b = array[Math.floor(i*squaresize + squaresize)][Math.floor(0 + j*squaresize)];
		c = array[Math.floor(i*squaresize)][Math.floor(0 + j*squaresize)];
		if (squaresize/2 + j*squaresize < regionSize) 
		    d = array[Math.floor(i*squaresize + squaresize/2)][Math.floor(squaresize/2 + j*squaresize)];
		else
		    d = array[Math.floor(i*squaresize + squaresize/2)][Math.floor(squaresize/2 + j*squaresize-regionSize)];
		var diamondav = (a + b + c + d)/4;
		array[Math.floor(i*squaresize)][Math.floor(j*squaresize + squaresize/2)] = diamondav + Math.random()*randomNumberRange;
		
		if (-squaresize/2 + i*squaresize < 0)
		    w = array[Math.floor(-squaresize/2 + i*squaresize+regionSize)][Math.floor(j*squaresize + squaresize/2)];
		else
		    w = array[Math.floor(-squaresize/2 + i*squaresize)][Math.floor(j*squaresize + squaresize/2)];
		x = array[Math.floor(0 + i*squaresize)][Math.floor(j*squaresize)];
		y = array[Math.floor(0 + i*squaresize)][Math.floor(j*squaresize+squaresize)];
		if (squaresize/2 + i*squaresize < regionSize)
		    z = array[Math.floor(squaresize/2 + i*squaresize)][Math.floor(j*squaresize + squaresize/2)];
		else
		    z = array[Math.floor(squaresize/2 + i*squaresize-regionSize)][Math.floor(j*squaresize + squaresize/2)];
		var diamondav2 = (w + x + y + z)/4;
		array[Math.floor(i*squaresize + squaresize/2)][Math.floor(j*squaresize)] = diamondav2 + Math.random()*randomNumberRange;
	    }
	}
	squaresize /= 2;
	randomNumberRange = rnr[loop+1];
    }

    averageAlt = 0;

    //Calculate the average altitude
    for (var i=0;i<regionSize;i++)
	for (var j=0;j<regionSize;j++)
	    averageAlt += array[i][j];

    var averageAlt = averageAlt / (regionSize*regionSize);

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