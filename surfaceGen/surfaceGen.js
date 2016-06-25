/**
 * Can generate a square 2D array of tiles with size mapWidth x mapHeight. 
 * 
 * @param	mapWidth	width of the generated map
 * @param	mapHeight	height of the generated map
 */
function SurfaceGen(mapWidth, mapHeight)
{
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    
    this.enemies = [];
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
 *  Generates and returns a surface.
 * 
 * @return			the generated array containing the dungeon
 */
SurfaceGen.prototype.generate = function()
{
    this.generateAreaSurface();
    this.array = SurfaceGen.placeWaysDown(this.array);
    return this.array;
}

/**
 * Generates a cave bounded by the whole map size.
 * 
 * @return 			the generated array containing the dungeon
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
  
    this.array = SurfaceGen.addLayer(this.array,SurfaceGen.generateSurface(newArray,SurfaceGen.tile.ROCK,40),SurfaceGen.tile.ROCK);
    this.array = SurfaceGen.addLayer(this.array,SurfaceGen.generateSurface(newArray,SurfaceGen.tile.SHALLOWS,50),SurfaceGen.tile.SHALLOWS);
    this.array = SurfaceGen.addLayer(this.array,SurfaceGen.generateSurface(newArray,SurfaceGen.tile.SEA,55),SurfaceGen.tile.SEA);
 
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
	    if (Core.RNR(1,100) > proportion)
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
    var starvation = Core.RNR(1,2);
    var overpopulation = 8;
    var neighbours = SurfaceGen.countAliveNeighbours(array, x, y,tile);
    if (array[x][y] == SurfaceGen.tile.UNUSED)
    {
	if(neighbours < starvation)
	    return tile;
	else if(neighbours > overpopulation)
	    return tile;
	return SurfaceGen.tile.UNUSED
    }
    else if (neighbours > Core.RNR(3,5))
	return SurfaceGen.tile.UNUSED;
    return tile;
}

SurfaceGen.countAliveNeighbours = function(array, x, y,tile)
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
	    else if (array[neighbourX][neighbourY] != tile)
		count++;
	}
	
    return count;
}

SurfaceGen.countAliveFourNeighbours = function(array, x, y,tile)
{
    var count = 0;
    for(var i=-1;i<2;i++)
	for(var j=-1;j<2;j++)
	{
	    if (Math.abs(i)+Math.abs(j)==1)
	    {
	      var neighbourX = x+i;
	      var neighbourY = y+j;
	      if ((i==0) && (j==0))
	      {}
	      else if ((neighbourX < 0) || (neighbourY < 0) || (neighbourX >= array.length) || (neighbourY >= array[0].length))
		  count++;
	      else if (array[neighbourX][neighbourY] != tile)
		  count++;
	    }
	}
	
    return count;
}

SurfaceGen.placeWaysDown = function(map)
{
    for (var x=0; x < map.length; x++){
	for (var y=0; y < map[0].length; y++){
	    if(map[x][y] == SurfaceGen.tile.GRASS){
		var nbs = SurfaceGen.countAliveFourNeighbours(map, x, y,SurfaceGen.tile.GRASS);
		if((nbs == 3) && (Core.RNR(0,3)==3))
		    map[x][y] = SurfaceGen.tile.WAYDOWN;
	    }
	}
    }
    return map;	
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
      WAYDOWN : "waydown",
   
      
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
	  case SurfaceGen.tile.WAYDOWN:
	    return "&#9661;";
	    break;
	}
	return "?";
      },
    };
