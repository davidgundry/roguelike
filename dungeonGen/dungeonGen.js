console.log("DungeonGen loaded");

/**
 * DungenGen can generate a square 2D array of tiles with size mapWidth x mapHeight. 
 * All points passed in origins will be valid entrances to the map.
 * 
 * TODO: Make sure ways up/down templates are correctly rotated.
 * 
 * @param	mapWidth	width of the generated map
 * @param	mapHeight	height of the generated map
 * @param	origins 	array of point, direction pairs
 * @param	targetWaysDown	the number of ways down to attempt to place. The actual number of ways down will be less than or equal to this
 * @param	defaultMinSize	the minimum dimension a room can be
 * @param	defaultMaxSize	the maximum dimension a room can be
 */
function DungeonGen(mapWidth, mapHeight, origins, targetWaysDown, defaultMinSize=5, defaultMaxSize=7)
{
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.origins = origins;
    this.targetWaysDown = targetWaysDown;
    this.externalDoors = false;
    
    this.waysDown = [];
    this.wallOpenList = [];
    this.doorOpenList = [];
    
    this.roomCount = 0;
    this.openRoomList = [];
    this.closedRoomList = [];
    
    this.defaultMinSize = defaultMinSize;
    this.defaultMaxSize = defaultMaxSize;
    
    this.array = new Array(this.mapWidth);
    for (var i=0; i<this.array.length;i++)
    {
	this.array[i] = new Array(this.mapHeight);
	for (var j=0; j<this.array[i].length;j++)
	{
	    this.array[i][j] = DungeonGen.tile.UNUSED;
	}
    }
}

/**
 *  Generates and returns a dungeon.
 * 
 * @param	targetRooms		the target number of rooms to generate
 * @param	targetDoorsRatio	the number of doors per actually generated room to attempt to generate
 * @param 	waysDown		if true, ways down will be generated
 * @return				the generated array containing the dungeon
 */
DungeonGen.prototype.generate = function(targetRooms,targetDoorsRatio,waysDown,cave=false,dungeon=true)
{
    if (cave)
	this.generateAreaCave();
    
    this.fixOrigins(this.origins);
    
    if (dungeon)
	for (var i=0;i<this.origins.length;i++)
	    this.generateAreaDungeon(this.origins[i],targetRooms,targetDoorsRatio);

    if (waysDown)
      this.waysDown = this.generateWaysDown(this.targetWaysDown);
    
    if (this.checkOrigins())
	return this.array;
    else
	return this.generate();
}

/**
 * Place additional doors in the dungeon based on openDoorList
 * 
 * @param 	target		target number of doors to place
 */
DungeonGen.prototype.placeDoors = function(target)
{
    for (i=0;i<target;i++)
    {
	if (this.doorOpenList.length > 0)
	{
	  var r = Core.RNR(0,this.doorOpenList.length-1);
	  var location = this.doorOpenList[r];
	  if (!this.isAdjacent(location,DungeonGen.tile.DOOR))
	  {
	      this.updateDoorOpenList(location);
	      this.setTile(location,DungeonGen.tile.DOOR);
	      this.doorOpenList.splice(r,1);
	  }
	}
	else
	  return;
    }
}

/**
 * When placing a door, remove that tile and adjacent tiles from the list of locations that doors can be placed.
 * 
 * @param location object containg x,y of newly placed door
 */
DungeonGen.prototype.updateDoorOpenList = function(location)
{
    var point = location;
    for (var i=-1;i<2;i++)
      for (var j=-1;j<2;j++)
      {
	if ((i*i) != (j*j))
	  while (this.getTile(point) == DungeonGen.tile.WALL)
	  {
	    var index = this.doorOpenList.indexOf(point);
	    if (index != -1)
	      this.doorOpenList.splice(index,1);
	    point = {x:point.x+i,y:point.y+j};
	  }
      }
}

/**
 * Returns array of waysDown.
 * 
 * @return 	array of x,y,direction objects
 */
DungeonGen.prototype.getWaysDown = function()
{
    return this.waysDown;
}

/**
 * Place FIXEDWALL sections around origin points.
 * 
 * @param 	origins		array of x,y,direction objects
 */
DungeonGen.prototype.fixOrigins = function(origins)
{	   
    for (var i=0;i<origins.length;i++)
    {
	var template = [[null,null,null],[null,null,null],[null,null,null]];
	if (origins[i].type == null)
	  origins[i].type = DungeonGen.origin.WAYUP;
	switch (origins[i].type)
	{
	  case DungeonGen.origin.WAYUP:
	    template = [[DungeonGen.tile.FIXEDWALL,DungeonGen.tile.FIXEDWALL,null],
		    [DungeonGen.tile.FIXEDWALL,DungeonGen.tile.FIXEDWAYUP,null],
		    [DungeonGen.tile.FIXEDWALL,DungeonGen.tile.FIXEDWALL,null]];
	    break;
	  case DungeonGen.origin.WAYDOWN:
	    template = [[DungeonGen.tile.FIXEDWALL,DungeonGen.tile.FIXEDWALL,null],
		    [DungeonGen.tile.FIXEDWALL,DungeonGen.tile.FIXEDWAYDOWN,null],
		    [DungeonGen.tile.FIXEDWALL,DungeonGen.tile.FIXEDWALL,null]];
	    break;
	  case DungeonGen.origin.OPEN:
	    template = [[null,DungeonGen.tile.FIXEDWALL,null],
		    [null,DungeonGen.tile.FIXEDFLOOR,null],
		    [null,DungeonGen.tile.FIXEDWALL,null]]; 
	    break;
	  case DungeonGen.origin.DOOR:
	    template = [[null,DungeonGen.tile.FIXEDWALL,null],
		    [null,DungeonGen.tile.DOOR,null],
		    [null,DungeonGen.tile.FIXEDWALL,null]]; 
	    break;
	}	
	if (origins[i].direction == Core.direction.SOUTH)
	{
	    for (var x=0;x<3;x++)
	      for (var y=0;y<3;y++)
	      {
		  if (template[x][y] != null)
		    this.setCell(origins[i].x-1+x,origins[i].y-1+y,template[x][y]);
	      }
	}
	else if (origins[i].direction == Core.direction.NORTH)
	{
	    for (var x=0;x<3;x++)
	      for (var y=0;y<3;y++)
	      {
		  if (template[x][2-y] != null)
		    this.setCell(origins[i].x-1+x,origins[i].y-1+y,template[x][2-y]);
	      }
	}
	else if (origins[i].direction == Core.direction.EAST)
	{
	    for (var x=0;x<3;x++)
	      for (var y=0;y<3;y++)
	      {
		  if (template[2-y][x] != null)
		    this.setCell(origins[i].x-1+x,origins[i].y-1+y,template[2-y][x]);
	      }
	}
	else if (origins[i].direction == Core.direction.WEST)
	{
	    for (var x=0;x<3;x++)
	      for (var y=0;y<3;y++)
	      {
		  if (template[2-y][2-x] != null)
		    this.setCell(origins[i].x-1+x,origins[i].y-1+y,template[2-y][2-x]);
	      }
	}
    }    
}

/**
 * Generates a dungeon bounded by the whole map size.
 * 
 * @param	origin			x,y,direction object starting point to generate from
 * @param 	targetRooms		target number of rooms to place
 * @param 	targetDoorsRatio	the number of doors per actually generated room to attempt to generate
 * @return 				the generated array containing the dungeon
 */
DungeonGen.prototype.generateAreaDungeon = function(origin,targetRooms,targetDoorsRatio)
{
    return this.generateRegionDungeon({top:0,right:this.mapWidth-1,bottom:this.mapHeight-1,left:0},origin,targetRooms,targetDoorsRatio);
}

/**
 * Generates a dungeon within a single region area. Origin must be within region!
 * 
 * @param	rect			object defining bounds of available space
 * @param	origin			x,y,direction object starting point to generate from
 * @param 	targetRooms		target number of rooms to place
 * @param 	targetDoorsRatio	the number of doors per actually generated room to attempt to generate
 * @return 				the generated array containing the dungeon
 */
DungeonGen.prototype.generateRegionDungeon = function(rect,origin,targetRooms,targetDoorsRatio)
{
  this.wallOpenList = [];
  this.doorOpenList = [];
  
  var startingRoomCount = this.roomCount;
  if (DungeonGen.isPointInRect(origin,rect))
    this.generateDenseDungeon(origin,{top:rect.top,right:rect.right,bottom:rect.bottom,left:rect.left},this.createRoomCallback,targetRooms);
  else
  {
    console.log("Cannot generate dungeon in rect: Origin must be within rect!");
    return false;
  }
   
  this.placeDoors(Math.round(targetDoorsRatio*this.roomCount));
    
  if (this.roomCount == startingRoomCount)
    return false;
  return true;
}

/**
 * Places ways down and returns array of them
 * 
 * @param 	target	target number of ways down to place
 * @return 		array of placed entrances
 */
DungeonGen.prototype.generateWaysDown = function(target)
{
    var entrances = [];
    for (var i=0;i<target;i++)
    {
      var tries = 0;
      var found = false;
      while ((tries < 100) && (!found))
      {
	var rx = Core.RNR(0,2);
	var ry = Core.RNR(0,2);
	if (i==0)
	{
	  rx = 0;
	  ry = 0;
	}
	var inx = Core.RNR(5,this.mapWidth-6);
	var iny = Core.RNR(5,this.mapHeight-6);
	var x = inx+rx*this.mapWidth;
	var y = iny+ry*this.mapHeight;
	
	var dir;
	
	if ((this.getCell(x,y) == DungeonGen.tile.WALL) && (!this.isAdjacent({x:x,y:y},DungeonGen.tile.DOOR)) && (!this.isAdjacent({x:x,y:y},DungeonGen.tile.FIXEDWAYDOWN)))
	{
	    if (this.getCell(x,y-1) == DungeonGen.tile.FLOOR)
		dir = Core.direction.SOUTH;
	    if (this.getCell(x,y+1) == DungeonGen.tile.FLOOR)
		dir = Core.direction.NORTH;
	    if (this.getCell(x+1,y) == DungeonGen.tile.FLOOR)
		dir = Core.direction.WEST;
	    if (this.getCell(x-1,y) == DungeonGen.tile.FLOOR)
		dir = Core.direction.EAST;
			      
	    var entrance = {x:x,y:y,direction:dir};
	    entrances.push(entrance);
	    if (entrance.direction == Core.direction.NORTH)
	    {
		this.setCell(entrance.x,entrance.y+1,DungeonGen.tile.FLOOR);
		this.setCell(entrance.x,entrance.y-1,DungeonGen.tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x+1,entrance.y+1,DungeonGen.tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x-1,entrance.y+1,DungeonGen.tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x+1,entrance.y-1,DungeonGen.tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x-1,entrance.y-1,DungeonGen.tile.FIXEDWALL);
	    }
	    else if (entrance.direction == Core.direction.SOUTH)
	    {
		this.setCell(entrance.x,entrance.y-1,DungeonGen.tile.FLOOR);
		this.setCell(entrance.x,entrance.y+1,DungeonGen.tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x+1,entrance.y,DungeonGen.tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x-1,entrance.y,DungeonGen.tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x+1,entrance.y+1,DungeonGen.tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x-1,entrance.y+1,DungeonGen.tile.FIXEDWALL);
	    }
	    else if (entrance.direction == Core.direction.EAST)
	    {
		this.setCell(entrance.x-1,entrance.y,DungeonGen.tile.FLOOR);
		this.setCell(entrance.x+1,entrance.y,DungeonGen.tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x,entrance.y+1,DungeonGen.tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x,entrance.y-1,DungeonGen.tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x+1,entrance.y+1,DungeonGen.tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x+1,entrance.y-1,DungeonGen.tile.FIXEDWALL);
	    }
	    else if (entrance.direction == Core.direction.WEST)
	    {
		this.setCell(entrance.x+1,entrance.y,DungeonGen.tile.FLOOR);
		this.setCell(entrance.x-1,entrance.y,DungeonGen.tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x,entrance.y+1,DungeonGen.tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x,entrance.y-1,DungeonGen.tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x-1,entrance.y+1,DungeonGen.tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x-1,entrance.y-1,DungeonGen.tile.FIXEDWALL);
	    }
	    this.setCell(entrance.x,entrance.y,DungeonGen.tile.FIXEDWAYDOWN);
	    found=true;
	}
	tries++;
      }
    }
    return entrances;
}

/**
 * Pushes reference to room to openRoomList
 * 
 * @param 	scope	scope containing openRoomList
 * @param 	location	location of room origin (door)
 * @param 	rect	object defining bounds of room
 */
DungeonGen.prototype.createRoomCallback = function(scope,location,rect)
{
    scope.openRoomList.push({location:location,rect:rect});
}

/**
 * Generate a densely packed dungon and store in dungeonGen.array.
 * 
 * @param	origin			x,y,direction object starting point to generate from
 * @param	rect			object defining bounds of available space
 * @param 	roomCallback		function to call after creating a room
 * @param 	targetRooms		target number of rooms to place
 * @param 	maxTries		maximum number of unsuccessful room creation attempts before giving up
 * @return 	true if successfully generated
 */
DungeonGen.prototype.generateDenseDungeon = function(orig,rect,roomCallback=null,targetRooms=Core.RNR(4,8)+this.roomCount,maxTries=100)
{
  var initialDirection = orig.direction;
  
  var found = false;
  for (var i=0;i<100;i++)
  {
    found = this.createRoom(orig,initialDirection,rect,roomCallback);
    if (found) break;
  }
  if (!found)
    for (var i=0;i<100;i++)
    {
      found = this.digRoom(orig,initialDirection,rect,roomCallback);
      if (found) break;
    }
  if (!found)
    return false;
  
  var tries = 0;
  while ((this.roomCount < targetRooms) && (tries < maxTries))
  {
    var locD = this.pickWallDirection();
    if (locD != null)
    {
      if (this.createRoom(locD.location,locD.direction,rect,roomCallback))
	tries = 0;
      else
	this.wallOpenList.push({x:locD.x,y:locD.y});
    }
    tries++;
  }
  return true;
}

/**
 * Returns array value at location
 * 
 * @param 	location 	object containing x,y
 * @return 	array value at location
 */
DungeonGen.prototype.getTile = function(location)
{
    return this.getCell(location.x,location.y);
}

/**
 * Returns array value at x,y
 * 
 * @param 	x
 * @param	y
 * @return 	array value at location
 */
DungeonGen.prototype.getCell = function(x,y)
{
    if ((x>0) && (y >0) && (x < this.array.length) && (y < this.array[x].length))
      return this.array[x][y];
    else
      return DungeonGen.tile.UNUSED
}

/**
 * Set array value to particular tile at the given location
 * 
 * @param location 
 * @param tile	tile value to place
 */
DungeonGen.prototype.setTile = function(location,tile)
{
  this.setCell(location.x,location.y,tile);
}

/**
 * Set array value to particular tile at the given location
 * 
 * @param x
 * @param y 
 * @param t	tile value to place
 */
DungeonGen.prototype.setCell = function(x,y,t)
{
  if ((x>0) && (y>0) && (x < this.array.length) && (y < this.array[x].length))
  {
    // If there is already a wall here, remove it from the wallOpenList
    // because either it will be replaced by a new wall from a new room
    // making it no longer useful for generation, or it it no longer a 
    // wall.
    if (DungeonGen.tile.isWall(this.array[x][y]))
      this.wallOpenList.splice(this.wallOpenList.indexOf({x:x,y:y}),1);
    else if (DungeonGen.tile.isWall(t))
    {
      this.wallOpenList.push({x:x,y:y});
      if (this.externalDoors)
	this.doorOpenList.push({x:x,y:y});
    }
    // If it is being replaced by a new wall from a new room, this cell
    // is a candidate for a door.
    if ((DungeonGen.tile.isWall(this.array[x][y])) && (DungeonGen.tile.isWall(t)))
      this.doorOpenList.push({x:x,y:y});
    this.array[x][y] = t;
  }
}

/**
 * If cell is not yet set, set array value to particular tile at the given location.
 * 
 * @param x
 * @param y 
 * @param tile	tile value to place
 */
DungeonGen.prototype.setCellIfUnset = function(x,y,t)
{
  if ((x < this.array.length) && (y < this.array[x].length))
  {
    if (this.array[x][y] == DungeonGen.tile.UNUSED)
      this.setCell(x,y,t);
  }
}

/**
 * Check if a location is adjacent to a cell containing a particular tile
 * 
 * @param location	location to check
 * @param checkTile	tile to look for
 * @return 	true if checkTile is adjacent to location
 */
DungeonGen.prototype.isAdjacent = function(location,checkTile)
{
    if (this.getCell(location.x,location.y-1) == checkTile)
      return true;
    if (this.getCell(location.x,location.y+1) == checkTile)
      return true;
    if (this.getCell(location.x+1,location.y) == checkTile)
      return true;
    if (this.getCell(location.x-1,location.y) == checkTile)
      return true;
    return false;
}

/**
 * From the wallOpenList, pick a place to create a new room
 * 
 * @return location, direction pair
 */
DungeonGen.prototype.pickWallDirection = function()
{
  if (this.wallOpenList.length > 0)
  {
      var r = Core.RNR(0,this.wallOpenList.length-1);
      var location = this.wallOpenList[r];
      this.wallOpenList.splice(r,1);
  
      if (!this.isAdjacent(location,DungeonGen.tile.DOOR))
      {
	if (this.getCell(location.x,location.y-1) == DungeonGen.tile.FLOOR)
	  return {location:location,direction:Core.direction.SOUTH};
	else if (this.getCell(location.x,location.y+1) == DungeonGen.tile.FLOOR)
	  return {location:location,direction:Core.direction.NORTH};
	else if (this.getCell(location.x-1,location.y) == DungeonGen.tile.FLOOR)
	  return {location:location,direction:Core.direction.EAST};
	else if (this.getCell(location.x+1,location.y) == DungeonGen.tile.FLOOR)
	  return {location:location,direction:Core.direction.WEST};
      }
  }
  return null;
}


/**
 * Creates a room in the provided place. This will dig into other rooms, but will not replace FIXEDWALL tiles.
 */
DungeonGen.prototype.digRoom = function(location,dir,rect,callback=null,width=Core.RNR(3,3),height=Core.RNR(3,3),floor=DungeonGen.tile.FLOOR,door=DungeonGen.tile.DOOR,wall=DungeonGen.tile.WALL)
{
  if (typeof location == 'undefined')
    return false;
  
  switch (dir)
  {
    case Core.direction.NORTH:
      var xoffset = Core.RNR(1,width/2);
      var room = {left:location.x-xoffset,right:location.x-xoffset+width-1,top:location.y-height+1,bottom:location.y};
      break;
    case Core.direction.SOUTH:
      var xoffset = Core.RNR(1,width/2);
      var room = {left:location.x-xoffset,right:location.x-xoffset+width-1,top:location.y,bottom:location.y+height-1};
      break;
    case Core.direction.EAST:
      var yoffset = Core.RNR(1,height/2);
      var room = {left:location.x,right:location.x+width-1,top:location.y-yoffset,bottom:location.y-yoffset+height-1};
      break;
    case Core.direction.WEST:
      var yoffset = Core.RNR(1,height/2);
      var room = {left:location.x-width+1,right:location.x,top:location.y-yoffset,bottom:location.y-yoffset+height-1};
      break;
    return false;
  }
  
  if (!((room.left > rect.left) && (room.top > rect.top) && (room.right < rect.right) && (room.bottom < rect.bottom)))
    return false;

  for (var i=0;i<width;i++)
    for (var j=0;j<height;j++)
    {
        if (((i==0) && (j==0)) || ((i==width-1) && (j==0)) || ((j==height-1) && (i==0)) || ((j==height-1) && (i==width-1)))
	var t = DungeonGen.tile.CORNER;
      else if ((i==0) || (i==width-1) || (j==0) || (j==height-1))
	var t = DungeonGen.tile.WALL;
      else
	var t = DungeonGen.tile.FLOOR;

      if (!DungeonGen.tile.isFixed(this.getCell(room.left+i,room.top+j)))
	this.setCell(room.left+i,room.top+j,t);
    }
  if (!DungeonGen.tile.isFixed(this.getTile(location)))
  {
    this.setTile(location,DungeonGen.tile.DOOR);
    var index = this.doorOpenList.indexOf(location);
    this.doorOpenList.splice(index,1);
    this.updateDoorOpenList(location);
  }
  if (callback != null)
    callback(this,location,room);
  this.roomCount++;
  return true;
}

/**
 * Creates a room with given parameters, or returns false
 * 
 * @param 	location 	origin location (usually a door)
 * @param 	dir 		direction room extends from origin
 * @param 	rect		bounding rect of available space
 * @param 	callback 	function to call on room creation
 * @param 	width		width of room in cells, including walls
 * @param	height 		height of room in cells, including walls
 * @return 	true on success
 */
DungeonGen.prototype.createRoom = function(location,dir,rect,callback=null,width=Core.RNR(this.defaultMinSize,this.defaultMaxSize),height=Core.RNR(this.defaultMinSize,this.defaultMaxSize))
{
  if (typeof location == 'undefined')
    return false;
  
  switch (dir)
  {
    case Core.direction.NORTH:
      var xoffset = Core.RNR(2,width/2);
      var room = {left:location.x-xoffset,right:location.x-xoffset+width-1,top:location.y-height+1,bottom:location.y};
      break;
    case Core.direction.SOUTH:
      var xoffset = Core.RNR(2,width/2);
      var room = {left:location.x-xoffset,right:location.x-xoffset+width-1,top:location.y,bottom:location.y+height-1};
      break;
    case Core.direction.EAST:
      var yoffset = Core.RNR(2,height/2);
      var room = {left:location.x,right:location.x+width-1,top:location.y-yoffset,bottom:location.y-yoffset+height-1};
      break;
    case Core.direction.WEST:
      var yoffset = Core.RNR(2,height/2);
      var room = {left:location.x-width+1,right:location.x,top:location.y-yoffset,bottom:location.y-yoffset+height-1};
      break;
    return false;
  }
  
  if (!((room.left > rect.left) && (room.top > rect.top) && (room.right < rect.right) && (room.bottom < rect.bottom)))
    return false;
  
  for (var i=0;i<width;i++)
    for (var j=0;j<height;j++)
    {
      var t = this.getCell(room.left+i,room.top+j);
      if ((i==0) || (i==width-1) || (j==0) || (j==height-1))
      {
	if (!DungeonGen.tile.canOverlapEdge(t))
	  return false;
      }
      else
	if ((t != DungeonGen.tile.UNUSED) && (t != DungeonGen.tile.FLOOR) && (!DungeonGen.tile.isWall(t)) && (!DungeonGen.tile.isFixed(t)))
	  return false;
    }
  
  for (var i=0;i<width;i++)
    for (var j=0;j<height;j++)
    {
      if (((i==0) && (j==0)) || ((i==width-1) && (j==0)) || ((j==height-1) && (i==0)) || ((j==height-1) && (i==width-1)))
	var t = DungeonGen.tile.CORNER;
      else if ((i==0) || (i==width-1) || (j==0) || (j==height-1))
	var t = DungeonGen.tile.WALL;
      else
	var t = DungeonGen.tile.FLOOR;

      if (!DungeonGen.tile.isFixed(this.getCell(room.left+i,room.top+j)))
	this.setCell(room.left+i,room.top+j,t);
    }
  if (!DungeonGen.tile.isFixed(this.getTile(location)))
  {
    this.setTile(location,DungeonGen.tile.DOOR);
    var index = this.doorOpenList.indexOf(location);
    this.doorOpenList.splice(index,1);
    this.updateDoorOpenList(location);
  }
  if (callback != null)
    callback(this,location,room);
  this.roomCount++;
  return true;
}


/**
 * Returns whether point is within rectangle
 * 
 * @param	point	object containing x,y
 * @param	rect	object defining rectangle
 * @return	true if point is in rectangle
 */
DungeonGen.isPointInRect = function(point,rect)
{
  return ((point.x <= rect.right) || (point.y <= rect.bottom) || (point.x >= rect.left) || (point.y >= rect.top))
}

DungeonGen.textConvert = function(dungeon)
{
  var output = "";
  for (var i=0;i<dungeon.length;i++)
  {
    for (var j=0;j<dungeon[i].length;j++)
    {
	output += DungeonGen.tile.textConvert(dungeon[i][j]);
    }
    output += "<br />";
  }
  return output;
}


DungeonGen.tile = {
      NONE : "none",
      WALL : "wall",
      FIXEDWALL : "fixedwall",
      FLOOR : "floor",
      UNUSED : "unused",
      DOOR : "door",
      CORNER : "corner",
      FIXEDWAYDOWN: "fixedwaydown",
      FIXEDWAYUP: "fixedwayup",
      FIXEDFLOOR: "fixedfloor",
      
	    
      /**
      * Returns true if given tile is a type of wall
      * 
      * @param t 	tile
      * @return 	true if t is a wall
      */
      isWall: function(t)
      {
	if ((t==DungeonGen.tile.WALL) || (t==DungeonGen.tile.FIXEDWALL))
	  return true;
	return false;
      },

      /**
      * Returns true if given tile is a type of corner
      * 
      * @param t 	tile
      * @return 	true if t is a corer
      */
      isCorner:  function(t)
      {
	return (t == DungeonGen.tile.CORNER);
      },

      /**
      * Returns if given tile should not be overwritten
      * 
      * @param t the tile to check
      */
      isFixed: function(t)
      {
	if ((t==DungeonGen.tile.FIXEDWALL) || (t==DungeonGen.tile.FIXEDWAYDOWN) || (t==DungeonGen.tile.FIXEDWAYUP) || (t==DungeonGen.tile.FIXEDFLOOR))
	  return true;DungeonGen
	return false;
      },

      /**
      * Returns true if tile can overlap other rooms on edge (ie. wall), based on the type of tile
      * 
      * @param t 	tile to check
      * @return true when overlap permitted
      */
      canOverlapEdge: function(t)
      {
	if (t == DungeonGen.tile.FLOOR)
	  return true;
	return (!((t != DungeonGen.tile.UNUSED) && !((DungeonGen.tile.isWall(t)) || (DungeonGen.tile.isCorner(t)))) || (t==DungeonGen.tile.FIXEDWAYDOWN) || (t==DungeonGen.tile.FIXEDWAYUP) || (t == DungeonGen.tile.DOOR));
      },
      
      /**
      * Returns a single character representation of a given tile
      * 
      * @param 	t	the tile to convert
      */
      textConvert: function(t)
      {
	switch (t)
	{
	  case DungeonGen.tile.NONE:
	    //return "&nbsp;";
	    return "&#9724";
	    break;
	  case DungeonGen.tile.WALL:
	    return "&#9724;";	
	    break;
	  case DungeonGen.tile.FIXEDWALL:
	    return "&#9724;";
	    break;
	  case DungeonGen.tile.FLOOR:
	    return "&nbsp;";
	    break;
	  case DungeonGen.tile.UNUSED:
	    return "&#9640;";
	    break;
	  case DungeonGen.tile.DOOR:
	    return "&#9723;";
	    break;
	  case DungeonGen.tile.CORNER:
	    return "&#9724;";
	    break;
	  case DungeonGen.tile.FIXEDWAYUP:
	    return "&#9651;";
	    break;
	  case DungeonGen.tile.FIXEDWAYDOWN:
	    return "&#9661;";
	    break;
	  case DungeonGen.tile.FIXEDFLOOR:
	    return "&nbsp;";
	    break;
	}
	return "?";
      }
    };
   

DungeonGen.origin = {
  WAYUP : "wayup",
  WAYDOWN : "waydown",
  DOOR : "door",
  OPEN : "open",
  
  /**
  * Returns a random origin
  * 
  * @return the origin
  */
  random: function()
  {
    switch (Core.RNR(0,2))
    {
      case 0:
	return DungeonGen.origin.WAYUP;
      case 1:
	return DungeonGen.origin.DOOR;
      case 2:
	return DungeonGen.origin.OPEN;
    }
  }
};

DungeonGen.prototype.checkOrigins = function(minSize = 5)
{
 
    for (var o=0;o<this.origins.length;o++)
    {
	this.floodArray = new Array(this.array.length);
	for (var i=0; i<this.array.length;i++)
	{
	    this.floodArray[i] = new Array(this.array[i].length);
	    for (var j=0; j<this.array[i].length;j++)
	    {
		this.floodArray[i][j] = this.array[i][j];
	    }
	}
	return true;
	//if (this.floodFillCheckDirections(this.origins[o].x,this.origins[o].y,minSize) < minSize)
	  return false;
    }
    return true;
}

DungeonGen.prototype.floodFillCheck = function(x,y,target)
{
    if ((x<0) || (y<0) || (x>=this.floodArray.length) || (y >= this.floodArray[0].length))
	return 0;
    if (this.floodArray[x][y] != DungeonGen.tile.FLOOR)
	return 0;
    
    this.floodArray[x][y] = DungeonGen.tile.DOOR;
    return this.floodFillCheckDirections(x,y,target-1) + 1;
}

DungeonGen.prototype.floodFillCheckDirections = function(x,y,target)
{
    console.log(target);
    if (target < -1)
	return 0;
    var c = 0;
    c += this.floodFillCheck(x-1,y,target-c);
    if (target-c < -1)
	return 0;
    c += this.floodFillCheck(x,y-1,target-c);
    if (target-c < -1)
	return 0;
    c += this.floodFillCheck(x,y+1,target-c);
    if (target-c < -1)
	return 0;
    c += this.floodFillCheck(x+1,y,target-c);
    return c;
}


/**
 * Generates a cave bounded by the whole map size.
 * 
 * @param	origin			x,y,direction object starting point to generate from
 * @return 				the generated array containing the dungeon
 */
DungeonGen.prototype.generateAreaCave = function()
{
    return this.generateRegionCave({top:0,right:this.mapWidth-1,bottom:this.mapHeight-1,left:0});
}

/**
 * Generates a cave within a single region area. Origin must be within region!
 * 
 * @param	rect			object defining bounds of available space
 * @return 				the generated array containing the dungeon
 */
DungeonGen.prototype.generateRegionCave = function(rect)
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
  
  this.array = DungeonGen.generateCave(newArray);
   
  return true;
}


/**
 * Generate a densely packed dungon and store in dungeonGen.array.
 * 
 * @param	array			array defining the cellular automaton
 * @param 	numSteps		number of steps to run simulation
 * @return 	new array
 */
DungeonGen.generateCave = function(array,tileProbability=65,numSteps=4)
{
 
    for (var i=0; i<array.length;i++)
	for (var j=0; j<array[i].length;j++)
	{
	    if (Core.RNR(1,100) > tileProbability)
	      array[i][j] = DungeonGen.tile.UNUSED;
	    else
	      array[i][j] = DungeonGen.tile.FLOOR;
	}
    
    for (var i=0;i<numSteps;i++)
    {
	array = DungeonGen.caStep(array);
    }
    
    return array;
}

/**
 * Run a single step in simmulating the cellular automaton
 * 
 * @param	array			the array containing the cellular automaton
 * @return 	the new array after one step
 */
DungeonGen.caStep = function(array)
{
    var newArray = [];
    for (var i=0; i<array.length;i++)
    {
	newArray.push([]);
	for (var j=0; j<array[0].length;j++)
	{
	    newArray[i][j] = array[i][j];
	}
    }
  
    for (var i=0; i<array.length;i++)
      for (var j=0; j<array[i].length;j++)
	  newArray[i][j] = DungeonGen.caNextCell(i,j,array);
	
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
DungeonGen.caNextCell = function(x,y,array)
{
    var starvation = Core.RNR(1,2);
    var overpopulation = 8;
    var neighbours = DungeonGen.countAliveNeighbours(array, x, y);
    if (array[x][y] == DungeonGen.tile.UNUSED)
    {
	if(neighbours < starvation)
	    return DungeonGen.tile.FLOOR;
	else if(neighbours > overpopulation)
	    return DungeonGen.tile.FLOOR;
	return DungeonGen.tile.UNUSED
    }
    else if (neighbours > Core.RNR(3,5))
	return DungeonGen.tile.UNUSED;
    return DungeonGen.tile.FLOOR;
}

DungeonGen.countAliveNeighbours = function(array, x, y)
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
	    else if (array[neighbourX][neighbourY] == DungeonGen.tile.UNUSED)
		count++;
	}
	
    return count;
}
