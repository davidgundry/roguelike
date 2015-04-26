/**
 * Cave can generate a square 2D array of tiles with size mapWidth x mapHeight. 
 * All points passed in origins will be valid entrances to the map.
 * 
 * @param	mapWidth	width of the generated map
 * @param	mapHeight	height of the generated map
 */
function SurfaceGen(mapWidth, mapHeight)
{
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    
   // this.enemies = [];
    this.waysDown = [];

    this.array = new Array(this.mapWidth);
    for (var i=0; i<this.array.length;i++)
    {
	this.array[i] = new Array(this.mapHeight);
	for (var j=0; j<this.array[i].length;j++)
	    this.array[i][j] = SurfaceGen.tile.GRASS;
    }
}

/**
 *  Generates and returns a dungeon.
 * 
 * @param	waysDown 	whether to generate ways down
 * @return			the generated array containing the dungeon
 */
SurfaceGen.prototype.generate = function(waysDown)
{
    this.generateAreaSurface();
    return this.array;
}

/**
 * Generates a cave bounded by the whole map size.
 * 
 * @param	origin			x,y,direction object starting point to generate from
 * @return 				the generated array containing the dungeon
 */
SurfaceGen.prototype.generateAreaSurface = function()
{
    return this.generateRegionSurface({top:0,right:this.mapWidth-1,bottom:this.mapHeight-1,left:0});
}

/**
 * Generates a cave within a single region area. Origin must be within region!
 * 
 * @param	rect			object defining bounds of available space
 * @return 				the generated array containing the dungeon
 */
SurfaceGen.prototype.generateRegionSurface = function(rect)
{
    var newArray = [];
    for (var i=0; i<rect.right-rect.left;i++)
    {
	newArray.push([]);
	for (var j=0; j<rect.bottom-rect.top;j++)
	{
	    newArray[i][j] = this.array[i+rect.left][j+rect.top];
	}
    }
  
    this.array = SurfaceGen.addLayer(this.array,SurfaceGen.generateSurface(newArray,SurfaceGen.tile.ROCK,60),SurfaceGen.tile.ROCK);
    this.array = SurfaceGen.addLayer(this.array,SurfaceGen.generateSurface(newArray,SurfaceGen.tile.SHALLOWS,50),SurfaceGen.tile.SHALLOWS);
    this.array = SurfaceGen.addLayer(this.array,SurfaceGen.generateSurface(newArray,SurfaceGen.tile.SEA,50),SurfaceGen.tile.SEA);
 
  return true;
}

/**
 * Add the generated CA to this array as a particular tile type
 */
SurfaceGen.addLayer = function(array,layerArray,tile)
{
    var newArray = [];
    for (var i=0; i<layerArray.length;i++)
    {
	newArray.push([]);
	for (var j=0; j<layerArray[0].length;j++)
	{
	    if (layerArray[i][j] == tile)
		newArray[i][j] = tile;
	    else
		newArray[i][j] = array[i][j];
	}
    }
    return newArray;
}

/**
 * Generate a densely packed dungon and store in dungeonGen.array.
 * 
 * @param	array			array defining the cellular automaton
 * @param 	numSteps		number of steps to run simulation
 * @return 	new array
 */
SurfaceGen.generateSurface = function(array,tile,proportion=50,numSteps=4)
{
    for (var i=0; i<array.length;i++)
	for (var j=0; j<array[i].length;j++)
	{
	    if (SurfaceGen.RNR(1,100) > proportion)
	      array[i][j] = SurfaceGen.tile.UNUSED;
	    else
	      array[i][j] = tile;
	}
    
    for (var i=0;i<numSteps;i++)
    {
	array = SurfaceGen.caStep(array,tile);
    }
    
    return array;
}

/**
 * Run a single step in simmulating the cellular automaton
 * 
 * @param	array			the array containing the cellular automaton
 * @param 	tile			the tile type of the CA
 * @return 	the new array after one step
 */
SurfaceGen.caStep = function(array,tile)
{
    var newArray = [];
    for (var i=0; i<array.length;i++)
    {
	newArray.push([]);
	for (var j=0; j<array[0].length;j++)
	    newArray[i][j] = array[i][j];
    }
  
    for (var i=0; i<array.length;i++)
      for (var j=0; j<array[i].length;j++)
	  newArray[i][j] = SurfaceGen.caNextCell(i,j,array,tile);
	
    return newArray;
}

/**
 * Return what a given cell will become next step.
 * 
 * @param 	x			the x position of the cell
 * @param	y			the y position of the cell
 * @param	array			the array containing the cellular automaton
 * @return 	the new tile for the given cell
 */
SurfaceGen.caNextCell = function(x,y,array,tile)
{
    var starvation = SurfaceGen.RNR(1,2);
    var overpopulation = 8;
    var neighbours = SurfaceGen.countAliveNeighbours(array, x, y);
    if (array[x][y] == SurfaceGen.tile.UNUSED)
    {
	if(neighbours < starvation)
	    return tile;
	else if(neighbours > overpopulation)
	    return tile;
	return SurfaceGen.tile.UNUSED
    }
    else if (neighbours > SurfaceGen.RNR(3,5))
	return SurfaceGen.tile.UNUSED;
    return tile;
}

SurfaceGen.countAliveNeighbours = function(array, x, y)
{
    var count = 0;
    for(var i=-1;i<2;i++)
	for(var j=-1;j<2;j++)
	{
	    var neighbourX = x+i;
	    var neighbourY = y+j;
	    if ((i==0) && (j==0))
	    {}
	    else if ((neighbourX < 0) || (neighbourY < 0) || (neighbourX >= array.length) || (neighbourY >= array[0].length))
		count++;
	    else if (array[neighbourX][neighbourY] == SurfaceGen.tile.UNUSED)
		count++;
	}
	
    return count;
}


SurfaceGen.textConvert = function(dungeon)
{
  var output = "";
  for (var i=0;i<dungeon.length;i++)
  {
    for (var j=0;j<dungeon[i].length;j++)
    {
	output += SurfaceGen.tile.textConvert(dungeon[i][j]);
    }
    output += "<br />";
  }
  return output;
}


SurfaceGen.tile = {
      NONE : "none",
      UNUSED : "unused",
      GRASS : "grass",
      ROCK : "rock",
      SEA : "sea",
      SHALLOWS : "shallows",
   
      
      /**
      * Returns a single character representation of a given tile
      * 
      * @param 	t	the tile to convert
      */
      textConvert: function(t)
      {
	switch (t)
	{
	  case SurfaceGen.tile.NONE:
	    return "&nbsp;";
	    break;
	  case SurfaceGen.tile.GRASS:
	    return "<span style='color:lightgreen'>&#9724;</span>";	
	    break;
	  case SurfaceGen.tile.ROCK:
	    return "<span style='color:gray'>&#9724;</span>";
	    break;
	  case SurfaceGen.tile.SEA:
	    return "<span style='color:blue'>&#9724;</span>";
	    break;
	  case SurfaceGen.tile.SHALLOWS:
	    return "<span style='color:lightblue'>&#9640;</span>";
	    break;
	}
	return "?";
      },
    };

/**
 * Returns a random integer between two values, inclusive.
 * 
 * @param 	low	minimum value to generate 
 * @param 	high	maximum value to generate
 * @return 		generated number
 */
SurfaceGen.RNR = function(low, high)
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
};


SurfaceGen.prototype.getEnemies = function()
{
    return this.enemies;
}

//TODO: do generating objects
SurfaceGen.prototype.getObjects = function()
{
  return [];
}