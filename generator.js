var RNR = function(low, high)
{
    if (high >=0)
	high = Math.floor(high);
    else
	high = Math.ceil(high);
    if (low >=0)
	low = Math.floor(low);
    else
	low = Math.ceil(low);
    var a = Math.round(Math.random()*high)+low;
    if (a > high)
	a = high;
    if (a < low)
	a = low;
    return a;
}

function Generator(mapSize, exits)
{
    this.mapSize = mapSize;
    this.exits = exits;
    this.entrances = [];
	
    this.levelMap = [];
    this.objects = [];
    this.enemies = [];   
}

Generator.prototype.getLevelMap = function()
{
    return this.levelMap;
}

Generator.prototype.getObjects = function()
{
    return this.objects;
}

Generator.prototype.getEnemies = function()
{
    return this.enemies;
}

Generator.prototype.getEntrances = function()
{
    return this.entrances;
}

Generator.prototype.isValidLocation = function(target)
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

Generator.prototype.generateSurface = function(challengeLevel)
{
    this.levelMap = this.squareDiamondMap();
    this.enemies = this.randomEnemies(challengeLevel);
    this.entrances = this.randomEntrances();
    for (var i=0;i<this.entrances.length;i++)
    {
	this.addObject(this.entrances[i],object.STEPSDOWN);
	if (this.entrances[i].direction == direction.NORTH)
	{
	    this.levelMap[this.entrances[i].x][this.entrances[i].y-1] = floorType.WALL;
	    this.levelMap[this.entrances[i].x+1][this.entrances[i].y] = floorType.WALL;
	    this.levelMap[this.entrances[i].x-1][this.entrances[i].y] = floorType.WALL;
	    this.levelMap[this.entrances[i].x+1][this.entrances[i].y-1] = floorType.WALL;
	    this.levelMap[this.entrances[i].x-1][this.entrances[i].y-1] = floorType.WALL;
	}
	else if (this.entrances[i].direction == direction.SOUTH)
	{
	    this.levelMap[this.entrances[i].x][this.entrances[i].y+1] = floorType.WALL;
	    this.levelMap[this.entrances[i].x+1][this.entrances[i].y] = floorType.WALL;
	    this.levelMap[this.entrances[i].x-1][this.entrances[i].y] = floorType.WALL;
	    this.levelMap[this.entrances[i].x+1][this.entrances[i].y+1] = floorType.WALL;
	    this.levelMap[this.entrances[i].x-1][this.entrances[i].y+1] = floorType.WALL;
	}
	else if (this.entrances[i].direction == direction.EAST)
	{
	    this.levelMap[this.entrances[i].x+1][this.entrances[i].y] = floorType.WALL;
	    this.levelMap[this.entrances[i].x][this.entrances[i].y+1] = floorType.WALL;
	    this.levelMap[this.entrances[i].x][this.entrances[i].y-1] = floorType.WALL;
	    this.levelMap[this.entrances[i].x+1][this.entrances[i].y+1] = floorType.WALL;
	    this.levelMap[this.entrances[i].x+1][this.entrances[i].y-1] = floorType.WALL;
	}
	else if (this.entrances[i].direction == direction.WEST)
	{
	    this.levelMap[this.entrances[i].x-1][this.entrances[i].y] = floorType.WALL;
	    this.levelMap[this.entrances[i].x][this.entrances[i].y+1] = floorType.WALL;
	    this.levelMap[this.entrances[i].x][this.entrances[i].y-1] = floorType.WALL;
	    this.levelMap[this.entrances[i].x-1][this.entrances[i].y+1] = floorType.WALL;
	    this.levelMap[this.entrances[i].x-1][this.entrances[i].y-1] = floorType.WALL;
	}
    }
}

Generator.prototype.randomEntrances = function()
{
    var entrances = [];
    for (var i=0;i<5;i++)
    {
      var tries = 0;
      var found = false;
      while ((tries < 30) && (!found))
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
	var entrance = {x:inx+rx*this.mapSize,y:iny+ry*this.mapSize,direction:randomDirection()};
	if (this.isValidLocation(entrance))
	{
	  entrances.push(entrance);
	  found = true;
	}
	tries++;
      }
    }
    return entrances;
}

Generator.prototype.randomEnemies = function(challengeLevel)
{
    var enemies = [];
    
    for (var i=0;i<25;i++)
    {
        var etype = enemy.CHICKEN;
      	var r = RNR(1,100);
	if (challengeLevel== 0)
	{
	    if (r > 90)
	      etype = enemy.BANDIT;
	    else if (r > 80)
	      etype = enemy.WOLF;
	    else if (r > 60)
	      etype = enemy.DOG;
	    else if (r > 30)
	      etype = enemy.COW;
	    else
	      etype = enemy.CHICKEN;
	}
	else
	{
	    if (r >= 80)
	      etype = enemy.RAT;
	    else if (r >= 60)
	      etype = enemy.SNAKE;
	    else if (r >= 40)
	      etype = enemy.BEETLE;
	    else if (r >= 25)
	      etype = enemy.SCORPION;
	    else if (r >= 10)
	      etype = enemy.SPIDER;
	    else
	      etype = enemy.GIANTSPIDER;
	}
	var x,y;
	var found = false;
	var attempts = 0;
	while ((!found) && (attempts < 10))
	{
	    attempts++;
	    x = RNR(0,this.mapSize*3);
	    y = RNR(0,this.mapSize*3);
	    if ((this.isValidLocation({x:x,y:y}))) //&& !(this.isMonsterAtLocation({x:x,y:y})) && !(this.isObjectAtLocation({x:x,y:y})))
	    {
	      found = true;
	      enemies.push({location:{x:x,y:y},enemy:etype});
	    }
	}
    }
    return enemies;
}

Generator.prototype.squareDiamondMap = function()
{
    var rnr = [2000,100,100,50,10,50,10,10,10,10,10,10,10,1];
    var randomNumberRange = rnr[0];
    var sealevel = 5000;
    var scale = 500;
    var max = 20;
    var min = 0;
    var regionSize = this.mapSize * 3;
    var squaresize = regionSize-1;

    //TODO: Gah javascript. Hack.
    var array = new Array(this.mapSize*3);
    for (var i=0; i<this.mapSize*3;i++)
    {
	array[i] = new Array(this.mapSize*3);
	for (var j=0; j<this.mapSize*3;j++)
	{
	    array[i][j] = 7;
	}
    }
	
    array[0][0] = RNR(0,randomNumberRange);
    array[0][regionSize-1] = RNR(0,randomNumberRange);
    array[regionSize-1][0] = RNR(0,randomNumberRange);
    array[regionSize-1][regionSize-1] = RNR(0,randomNumberRange);

    randomNumberRange = rnr[1];

    var loop = 0;
    while (squaresize >= 2) // was2
    {
	loop++;
	// square step
	for (var i=0; i<Math.floor(regionSize/squaresize)-1;i++)
	{
	    for (var j=0;j<Math.floor(regionSize/squaresize)-1;j++)
	    {
		var e = array[i*squaresize][j*squaresize];
		var f = array[(i+1)*squaresize][j*squaresize];
		var g = array[i*squaresize][(j+1)*squaresize];
		var h = array[(i+1)*squaresize][(j+1)*squaresize];
		var squareav = Math.round((e+ f + g + h)/4);
		array[i*squaresize + Math.floor(squaresize/2)][j*squaresize + Math.floor(squaresize/2)] = squareav + RNR(-randomNumberRange,randomNumberRange);
	    }
	}
	// diamond step
	for (var i=0;i<Math.floor(regionSize/squaresize)-1;i++)
	{
	    for (var j=0;j<Math.floor(regionSize/squaresize);j++)
	    {
		//console.log("i:"+i+", j:"+j+", loop:"+loop+", squaresize:"+squaresize);
	      // For setting topmid value of square defined by squaresize
		var a,b,c,d;//a=highermid; b=topright; c=topleft; d=midmid
	      
		if (Math.floor(-squaresize/2) + j*squaresize < 0)
		    a = array[i*squaresize + Math.floor(squaresize/2)][Math.ceil(-squaresize/2) + j*squaresize + regionSize];
		else
		    a = array[i*squaresize + Math.floor(squaresize/2)][Math.floor(-squaresize/2) + j*squaresize];
		
		if ((i+1)*squaresize >= regionSize)
		  b = 5;
		else
		  b = array[(i+1)*squaresize][j*squaresize];
		c = array[i*squaresize][j*squaresize];
		
		if (Math.floor(squaresize/2) + j*squaresize < regionSize) 
		    d = array[i*squaresize + Math.floor(squaresize/2)][Math.ceil(squaresize/2) + j*squaresize];
		else
		    d = array[i*squaresize + Math.floor(squaresize/2)][Math.floor(squaresize/2) + j*squaresize-regionSize];
		
		var diamondav = Math.round((a + b + c + d)/4);
		//console.log("diamondav:"+diamondav);
		array[i*squaresize + Math.floor(squaresize/2)][j*squaresize] = diamondav + RNR(-randomNumberRange,randomNumberRange);
				
		// For setting leftmid of square defined by squaresize
		var x,y,w,z; //w=leftermid; x=topleft; y=bottomleft; z=midmid
		if (Math.floor(-squaresize/2) + i*squaresize < 0)
		    w = array[Math.floor(-squaresize/2 + i*squaresize+regionSize)][Math.floor(j*squaresize + squaresize/2)];
		else
		    w = array[Math.floor(-squaresize/2 + i*squaresize)][Math.floor(j*squaresize + squaresize/2)];
		
		x = array[i*squaresize][j*squaresize];
		y = array[i*squaresize][(j+1)*squaresize];
		
		if (Math.floor(squaresize/2 + i*squaresize) < regionSize)
		    z = array[Math.floor(squaresize/2) + i*squaresize][j*squaresize + Math.floor(squaresize/2)];
		else
		    z = array[Math.floor(squaresize/2 + i*squaresize-regionSize)][Math.floor(j*squaresize + squaresize/2)];
		
		var diamondav2 = Math.floor((w + x + y + z)/4);
		array[i*squaresize][j*squaresize + Math.floor(squaresize/2)] = diamondav2 + RNR(-randomNumberRange,randomNumberRange);
		//console.log("diamondav2:"+diamondav2);
		
		// For setting rightmmid of square defined by squaresize
		var x,y,w,z; //w=rightermid; x=topright; y=bottomright; midmid
		if (Math.floor(squaresize/2) + (i+1)*squaresize >= regionSize)
		    w = array[Math.floor(squaresize/2 + (i+1)*squaresize)-regionSize][Math.floor(j*squaresize + squaresize/2)];
		else
		    w = array[Math.floor(squaresize/2 + (i+1)*squaresize)][Math.floor(j*squaresize + squaresize/2)];
		
		if ((i+1)*squaresize >= regionSize)
		{
		  x = 5;
		  y =5;
		}
		else
		{
		  x = array[(i+1)*squaresize][j*squaresize];
		  if ((j+1)*squaresize >=regionSize)
		    y = 5;
		  else
		    y = array[(i+1)*squaresize][(j+1)*squaresize];
		}
		
		if (Math.floor(squaresize/2 + i*squaresize) < regionSize)
		    z = array[Math.floor(squaresize/2) + i*squaresize][j*squaresize + Math.floor(squaresize/2)];
		else
		    z = array[Math.floor(squaresize/2 + i*squaresize-regionSize)][Math.floor(j*squaresize + squaresize/2)];
		
		var diamondav3 = Math.floor((w + x + y + z)/4);
		array[(i+1)*squaresize][j*squaresize+ Math.floor(squaresize/2)] = diamondav3 + RNR(-randomNumberRange,randomNumberRange);
		//console.log("diamondav3:"+diamondav3);
		
		
		// For setting bottommid value of square defined by squaresize
		var a,b,c,d;//a=bottomermid b = bottomright; c = bottomleft; d=midmid
	      
		if (Math.floor(squaresize/2) + (j+1)*squaresize >=regionSize)
		    a = array[i*squaresize + Math.floor(squaresize/2)][Math.floor(squaresize/2) + (j+1)*squaresize - regionSize];
		else
		    a = array[i*squaresize + Math.floor(squaresize/2)][Math.floor(squaresize/2) + (j+1)*squaresize];
		
		b = array[(i+1)*squaresize][(j+1)*squaresize];
		c = array[i*squaresize][(j+1)*squaresize];
		
		if (Math.floor(squaresize/2) + j*squaresize < regionSize) 
		    d = array[i*squaresize + Math.floor(squaresize/2)][Math.ceil(squaresize/2) + j*squaresize];
		else
		    d = array[i*squaresize + Math.floor(squaresize/2)][Math.floor(squaresize/2) + j*squaresize-regionSize];
		
		var diamondav4 = Math.round((a + b + c + d)/4);
		array[i*squaresize + Math.floor(squaresize/2)][(j+1)*squaresize] = diamondav4 + RNR(-randomNumberRange,randomNumberRange);
		//console.log("diamondav4:"+diamondav4);
	    }
	}
	
	squaresize = Math.round(regionSize/(Math.pow(2,loop)))-1;
	randomNumberRange = rnr[loop+1];
    }

    averageAlt = 0;

    //Calculate the average altitude
    for (var i=0;i<regionSize;i++)
	for (var j=0;j<regionSize;j++)
	    averageAlt += array[i][j];

    var averageAlt = Math.floor(averageAlt / (regionSize*regionSize));
    var heightShift = averageAlt - sealevel;

    // Lower the world depending on the height of the sealevel
    for (var i=0;i<regionSize;i++)
	for (var j=0;j<regionSize;j++)
	{
	    var height = Math.floor((array[i][j]-heightShift)/scale);
	    if (height > max)
	      height = max;
	    if (height < min)
	      height = min;
	    array[i][j] = height;
	    //array[i][j] = Math.floor(array[i][j]);
	}
		
    return this.convertHeightMap(array);
}

Generator.prototype.convertHeightMap= function(array)
{
  var regionSize = this.mapSize * 3;
  for (var i=0;i<regionSize;i++)
    for (var j=0;j<regionSize;j++)
    {
	array[i][j] = this.convertHeightCell(array[i][j]);
    }
  
  return array;
}

Generator.prototype.convertHeightCell = function(value)
{
  if (value < 4)
    return value;
  else if ((value >= 4) && (value < 14))
    return this.randomGrassTile();
  else if ((value >=14) && (value < 19))
      return value+1;
  else return 15;
}

Generator.prototype.randomGrassTile = function()
{
  return RNR(8,11);
}