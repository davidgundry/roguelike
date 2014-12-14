Surface.prototype = new WorldLevel();
Surface.constructor = Surface;
function Surface(worldArea,levelID) {WorldLevel.call(this,worldArea,levelID);}

Surface.prototype.initialise = function()
{
  
}

Surface.prototype.generate = function()
{
    this.generateHeightMap();
    this.configureEnemies();
    this.levelMap = this.array;
}

Surface.prototype.addObject = function(location,object)
{
    this.objects.push({location:location,object:object});
}

Surface.prototype.configureEnemies = function()
{
    for (var i=0;i<10;i++)
    {
	if (Math.random() > 0.9)
	  this.enemies[i] = {location:{x:1,y:1},enemy:enemy.BANDIT};
	else if (Math.random() > 0.8)
	  this.enemies[i] = {location:{x:1,y:1},enemy:enemy.GOLEM};
	else
	  this.enemies[i] = {location:{x:1,y:1},enemy:enemy.ANIMAL};
    }
    
    for (var i=0;i<this.enemies.length;i++)
    {
	var x,y;
	var found = false;
	var attempts = 0;
	while ((!found) && (attempts < 10))
	{
	    attempts++;
	    x = Math.floor(Math.random()*this.mapSize*3);
	    y = Math.floor(Math.random()*this.mapSize*3);
	    if ((this.isValidLocation({x:x,y:y})) && !(this.isMonsterAtLocation({x:x,y:y})) && !(this.isObjectAtLocation({x:x,y:y})))
	      found = true;
	}
	if (!found)
	{
	    x = -1;
	    y = -1;
	}
	this.enemies[i].location = {x:x,y:y};
    }
}

Surface.prototype.isValidLocation = function(target)
{
    if ((target.x >= 0) && (target.y >= 0) && (target.x<this.mapSize*3) && (target.y<this.mapSize*3))
    {
	if (this.array[target.x][target.y]>3)
	  if (this.array[target.x][target.y]<10)
	      return true;
    }
    return false;
}

Surface.prototype.generateHeightMap = function()
{
    var rnr = [400,200,100,100,50,10,4,1,1,1,1,1,1,1,1,1];
    var randomNumberRange = rnr[0];
    var sealevel = -35;
    var max = 1199;
    var min=0;
    var regionSize = this.mapSize * 3
    var squaresize = regionSize-1;

    //TODO: Gah javascript. Hack.
    var array = new Array(regionSize+this.mapSize*3);
    for (var i=0; i<regionSize+this.mapSize*3;i++)
    {
	array[i] = new Array(regionSize+this.mapSize*3);
	for (var j=0; j<regionSize+this.mapSize*3;j++)
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
		
    this.array = array;
}