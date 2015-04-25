var tile = {
      NONE : "none",
      WALL : "wall",
      FIXEDWALL : "fixedwall",
      FLOOR : "floor",
      UNUSED : "unused",
      DOOR : "door",
      CORRIDOR : "corridor",
      ROOMWALL : "roomwall",
      CORRIDORWALL : "corridorwall"
    }

Generator.prototype.generateDungeon = function(challengeLevel)
{
    this.array = new Array(this.mapSize*3);
    for (var i=0; i<this.array.length;i++)
    {
	this.array[i] = new Array(this.mapSize*3);
	for (var j=0; j<this.array[i].length;j++)
	{
	    this.array[i][j] = tile.UNUSED;
	}
    }
    
    this.roomCount = 0;
    this.openRoomList = [];
    this.closedRoomList = [];
    
    for (var i=0;i<this.exits.length;i++)
    {
      if (this.exits[i].direction == direction.NORTH)
	{
	    this.setCell(this.exits[i].x,this.exits[i].y-1,tile.FIXEDWALL);
	    this.setCell(this.exits[i].x+1,this.exits[i].y,tile.FIXEDWALL);
	    this.setCell(this.exits[i].x-1,this.exits[i].y,tile.FIXEDWALL);
	    this.setCell(this.exits[i].x-1,this.exits[i].y-1,tile.FIXEDWALL);
	    this.setCell(this.exits[i].x-1,this.exits[i].y-1,tile.FIXEDWALL);
	}
	else if (this.exits[i].direction == direction.SOUTH)
	{
	    this.setCell(this.exits[i].x,this.exits[i].y+1,tile.FIXEDWALL);
	    this.setCell(this.exits[i].x+1,this.exits[i].y,tile.FIXEDWALL);
	    this.setCell(this.exits[i].x-1,this.exits[i].y,tile.FIXEDWALL);
	    this.setCell(this.exits[i].x+1,this.exits[i].y+1,tile.FIXEDWALL);
	    this.setCell(this.exits[i].x-1,this.exits[i].y+1,tile.FIXEDWALL);
	}
	else if (this.exits[i].direction == direction.EAST)
	{
	    this.setCell(this.exits[i].x+1,this.exits[i].y,tile.FIXEDWALL);
	    this.setCell(this.exits[i].x,this.exits[i].y+1,tile.FIXEDWALL);
	    this.setCell(this.exits[i].x,this.exits[i].y-1,tile.FIXEDWALL);
	    this.setCell(this.exits[i].x+1,this.exits[i].y+1,tile.FIXEDWALL);
	    this.setCell(this.exits[i].x+1,this.exits[i].y-1,tile.FIXEDWALL);
	}
	else if (this.exits[i].direction == direction.WEST)
	{
	    this.setCell(this.exits[i].x-1,this.exits[i].y,tile.FIXEDWALL);
	    this.setCell(this.exits[i].x,this.exits[i].y+1,tile.FIXEDWALL);
	    this.setCell(this.exits[i].x,this.exits[i].y-1,tile.FIXEDWALL);
	    this.setCell(this.exits[i].x-1,this.exits[i].y+1,tile.FIXEDWALL);
	    this.setCell(this.exits[i].x-1,this.exits[i].y-1,tile.FIXEDWALL);
	}
    }
     
    for (var i=0;i<this.exits.length;i++)
    {
	this.generateRegionDungeon(this.exits[i]);
	this.addObject(this.exits[i],object.STEPSUP);
	this.setCell(this.exits[i].x,this.exits[i].y,tile.FIXEDWALL);
	this.populateRooms();
    }
    this.entrances = this.randomDungeonEntrances(7);
	
    this.levelMap = this.convert();
    this.enemies = this.randomEnemies(challengeLevel);
    for (var i=0;i<this.entrances.length;i++)
    {
	this.addObject(this.entrances[i],object.STEPSDOWN);
    }
}

Generator.prototype.addObject = function(location,object)
{
    this.objects.push({location:location,object:object});
}

Generator.prototype.generateAreaDungeon = function(origin)
{
    var targetRooms = 20;
    this.generateDenseDungeon(origin,{top:0,right:this.mapSize-1,bottom:this.mapSize-1,left:0},targetRooms,this.createRoomCallback);
}

/*
 * Generates a dungeon within a single region area. Origin MUST be within region!
 */
Generator.prototype.generateRegionDungeon = function(origin,type=this.randomDungeonType())
{
  var x = Math.floor(origin.x/this.mapSize); 
  var y = Math.floor(origin.y/this.mapSize); 
  var startingRoomCount = this.roomCount;
  if ((origin.x < x*this.mapSize) || (origin.y*this.mapSize < y) || (origin.x > (x+1)*this.mapSize) || (origin.y > (y+1)*this.mapSize))
  {
    console.log("origin must be within region!");
    return false;
  }
  this.generateX(type,origin,{top:y*this.mapSize,right:x*this.mapSize+this.mapSize-1,bottom:y*this.mapSize+this.mapSize-1,left:x*this.mapSize});
  
  if (this.roomCount == startingRoomCount)
    return false;
  return true;
}

var dungeonTypes = {DENSE: "dense",
		LABYRINTH: "labyrinth",
		HALO: "halo"
};

Generator.prototype.randomDungeonEntrances = function(target)
{
    var entrances = [];
    for (var i=0;i<target;i++)
    {
      var tries = 0;
      var found = false;
      while ((tries < 100) && (!found))
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
	var x = inx+rx*this.mapSize;
	var y = iny+ry*this.mapSize;
	console.log(x+","+y);
	
	var dir;
	
	if ((this.getCell(x,y) == tile.WALL) && (!this.isAdjacent({x:x,y:y},tile.DOOR)))
	{
	    if (this.getCell(x,y-1) == tile.FLOOR)
		dir = direction.SOUTH;
	    if (this.getCell(x,y+1) == tile.FLOOR)
		dir = direction.NORTH;
	    if (this.getCell(x+1,y) == tile.FLOOR)
		dir = direction.WEST;
	    if (this.getCell(x-1,y) == tile.FLOOR)
		dir = direction.EAST;
			      
	    var entrance = {x:x,y:y,direction:dir};
	    entrances.push(entrance);
	    if (entrance.direction == direction.NORTH)
	    {
		this.setCell(entrance.x,entrance.y+1,tile.FLOOR);
		this.setCell(entrance.x,entrance.y-1,tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x+1,entrance.y,tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x-1,entrance.y,tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x-1,entrance.y-1,tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x-1,entrance.y-1,tile.FIXEDWALL);
	    }
	    else if (entrance.direction == direction.SOUTH)
	    {
		this.setCell(entrance.x,entrance.y-1,tile.FLOOR);
		this.setCell(entrance.x,entrance.y+1,tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x+1,entrance.y,tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x-1,entrance.y,tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x+1,entrance.y+1,tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x-1,entrance.y+1,tile.FIXEDWALL);
	    }
	    else if (entrance.direction == direction.EAST)
	    {
		this.setCell(entrance.x-1,entrance.y,tile.FLOOR);
		this.setCell(entrance.x+1,entrance.y,tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x,entrance.y+1,tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x,entrance.y-1,tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x+1,entrance.y+1,tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x+1,entrance.y-1,tile.FIXEDWALL);
	    }
	    else if (entrance.direction == direction.WEST)
	    {
		this.setCell(entrance.x+1,entrance.y,tile.FLOOR);
		this.setCell(entrance.x-1,entrance.y,tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x,entrance.y+1,tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x,entrance.y-1,tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x-1,entrance.y+1,tile.FIXEDWALL);
		this.setCellIfUnset(entrance.x-1,entrance.y-1,tile.FIXEDWALL);
	    }
	    this.setCell(entrance.x,entrance.y,tile.FIXEDWALL);
	    found=true;
	}
	tries++;
      }
    }
    return entrances;
}

Generator.prototype.populateRooms = function()
{
  for (var i=0;i<this.openRoomList.length;i++)
  {
    var location = this.openRoomList[i].location;
    var roomRect = this.openRoomList[i].rect;
    var height = roomRect.top-roomRect.bottom-1;
    var width = roomRect.right-roomRect.left-1;
    
    var x = RNR(roomRect.left+1,roomRect.right-1);
    var y = RNR(roomRect.top+1,roomRect.bottom-1);
    
    if (RNR(1,100) > 50)
    {
      if (!this.isWall(this.getTile(location)))
	this.addObject(location,object.DOOR);
    }
    
    if ((this.getCell(x,y) == tile.FLOOR) && (!this.isObjectAtLocation({x:x,y:y})) && (!this.isAdjacent(location,tile.DOOR)))
    {
      var r = RNR(1,100);
      if (r >=50)
      {
	  
	  
      }
      else if (r >= 20)
      {
	  var rObj = this.randomObject();
	  if (rObj != null)
	    this.addObject({x:x,y:y},rObj);
      }
    }
    this.closedRoomList.push(this.openRoomList.pop());
  }
}

Generator.prototype.randomDungeonType = function()
{
    return dungeonTypes.DENSE;
    var pick = RNR(0,Object.keys(dungeonTypes).length);
    var key = Object.keys(dungeonTypes)[pick];
    return dungeonTypes[key];
}

Generator.prototype.generateX = function(type,origin,rect)
{
  if (type == dungeonTypes.DENSE)
    this.generateDenseDungeon(origin,rect,this.createRoomCallback);
  else if (type == dungeonTypes.LABYRINTH)
    this.generateLabyrinthDungeon(origin,rect);
  else if (type == dungeonTypes.HALO)
    this.generateHaloDungeon(origin,rect);
}

Generator.prototype.isObjectAtLocation = function(location)
{
    for (var i=0;i<this.objects.length;i++)
    {
	if ((this.objects[i].location.x == location.x) && (this.objects[i].location.y == location.y))
	    return true;
    }
    return false;
}

Generator.prototype.createRoomCallback = function(scope,location,rect)
{
    scope.openRoomList.push({location:location,rect:rect});
}

Generator.prototype.randomObject = function()
{
 var dungeonObjectsTable = [
    {n:10,object:object.FOUNTAIN},
    {n:15,object:object.DRYFOUNTAIN},
    {n:30,object:object.CHEST},
    {n:50,object:object.TRASHHEAP},
    {n:75,object:object.BOOKCASE},
    {n:100,object:null}];
    var table = dungeonObjectsTable;
    
    var r = RNR(0,100);
    for (var i=0;i<table.length;i++)
    {
	if (r <=table[i].n )
	{
	  return table[i].object;
	}
    }
  return null;
}

Generator.prototype.generateDenseDungeon = function(origin,rect,roomCallback=null,targetRooms=RNR(4,8)+this.roomCount,maxTries=1000)
{
  var initialDirection = null;
  if (this.getCell(origin.x,origin.y-1) != tile.FIXEDWALL)
    initialDirection = direction.NORTH;
  else if (this.getCell(origin.x+1,origin.y) != tile.FIXEDWALL)
    initialDirection = direction.EAST;
  else if (this.getCell(origin.x,origin.y+1) != tile.FIXEDWALL)
    initialDirection = direction.SOUTH;
  else if (this.getCell(origin.x-1,origin.y) != tile.FIXEDWALL)
    initialDirection = direction.WEST;
  else
    return false;
  
  var tries = 0;
  var found = false
  for (var i=0;i<100;i++)
  {
    found = this.createRoom(origin,initialDirection,rect,roomCallback);
    if (found) break;
  }
  if (!found)
    for (var i=0;i<100;i++)
    {
      found = this.digRoom(origin,initialDirection,rect,roomCallback);
      if (found) break;
    }
  if (!found)
    return false;
  
  var tries = 0;
  while ((this.roomCount < targetRooms) && (tries < maxTries))
  {
    var locD = this.pickWallDirection(rect);
    if (locD != null)
      this.createRoom(locD.location,locD.direction,rect,roomCallback);
    tries++;
  }
  return true;
}

Generator.prototype.generateLabyrinthDungeon = function(origin,rect,roomCallback=null,targetRooms=RNR(15,25)+this.roomCount,maxTries=1000)
{
  if (this.createRoom(origin,direction.NORTH,rect,roomCallback,3,3,tile.FLOOR,tile.FLOOR))
    this.setTile(origin,tile.WALL);
  else
    return false;
  
  var tries = 0;
  while ((this.roomCount < targetRooms) && (tries < maxTries))
  {
    var locD = this.pickWallDirection(rect);
    if (locD != null)
      this.createRoom(locD.location,locD.direction,rect,roomCallback,3,3,tile.FLOOR,tile.FLOOR);
    tries++;
  }
  return true;
}

Generator.prototype.generateHaloDungeon = function(origin,rect,roomCallback=null,targetRooms=RNR(15,20)+this.roomCount,maxTries=1000)
{
  if (this.createRoom(origin,direction.NORTH,rect,roomCallback,3,3,tile.FLOOR,tile.FLOOR,tile.CORRIDORWALL))
    this.setTile(origin,tile.CORRIDORWALL);
  else
    return false;
  
  var tries = 0;
  while ((this.roomCount < targetRooms) && (tries < maxTries))
  {
    var locD = this.pickWallDirection(rect,tile.FLOOR,tile.DOOR,tile.CORRIDORWALL);
    if (locD != null)
      this.createRoom(locD.location,locD.direction,rect,roomCallback,3,3,tile.FLOOR,tile.FLOOR,tile.CORRIDORWALL);
    tries++;
  }
  
  var tries = 0;
  var haloRoomTarget = RNR(5,8);
  while ((this.roomCount < targetRooms+haloRoomTarget) && (tries < maxTries))
  {
    var locD = this.pickWallDirection(rect,tile.FLOOR,tile.DOOR,tile.CORRIDORWALL);
    if (locD != null)
	this.createRoom(locD.location,locD.direction,rect,roomCallback,RNR(4,6),RNR(4,6),tile.FLOOR,tile.DOOR,tile.ROOMWALL);
    tries++;
  }
  
  return true;
}

Generator.prototype.getTile = function(location)
{
    return this.array[location.x][location.y];
}

Generator.prototype.getCell = function(x,y)
{
    return this.array[x][y];
}

Generator.prototype.setTile = function(location,t)
{
  this.array[location.x][location.y] = t;
}

Generator.prototype.setCell = function(x,y,t)
{
  this.array[x][y] = t;
}

Generator.prototype.setCellIfUnset = function(x,y,t)
{
  if (this.array[x][y] == tile.UNUSED)
    this.array[x][y] = t;
}


Generator.prototype.isAdjacent = function(location,checkTile)
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

Generator.prototype.pickWallDirection = function(rect,floorTile=tile.FLOOR,doorTile=tile.DOOR,wallTile=tile.WALL,maxTries=100)
{
  for (var i=0;i<maxTries;i++)
  {
    var location = {x:RNR(rect.left,rect.right),y:RNR(rect.top,rect.bottom)};
    if (this.getTile(location) == wallTile)
    {
      if (!this.isAdjacent(location,doorTile))
      {
	if (this.getCell(location.x,location.y-1) == floorTile)
	  return {location:location,direction:direction.SOUTH};
	else if (this.getCell(location.x,location.y+1) == floorTile)
	  return {location:location,direction:direction.NORTH};
	else if (this.getCell(location.x-1,location.y) == floorTile)
	  return {location:location,direction:direction.EAST};
	else if (this.getCell(location.x+1,location.y) == floorTile)
	  return {location:location,direction:direction.WEST};
      }
    }
  }
  return null;
}

Generator.prototype.isWall = function(t)
{
  if ((t==tile.WALL) || (t==tile.CORRIDORWALL) || (t==tile.ROOMWALL) || (t==tile.FIXEDWALL))
    return true;
  return false;
}

Generator.prototype.isFixed = function(t)
{
  if (t==tile.FIXEDWALL)
    return true;
  return false;
}

/*
 * Creates a room in the provided place. This will dig into other rooms, but will not replace FIXEDWALL tiles.
 */
Generator.prototype.digRoom = function(location,dir,rect,callback=null,width=RNR(3,3),height=RNR(3,3),floor=tile.FLOOR,door=tile.DOOR,wall=tile.WALL)
{
  if (typeof location == 'undefined')
    return false;
  
  switch (dir)
  {
    case direction.NORTH:
      var xoffset = RNR(1,width/2);
      var room = {left:location.x-xoffset,right:location.x-xoffset+width-1,top:location.y-height+1,bottom:location.y};
      break;
    case direction.SOUTH:
      var xoffset = RNR(1,width/2);
      var room = {left:location.x-xoffset,right:location.x-xoffset+width-1,top:location.y,bottom:location.y+height-1};
      break;
    case direction.EAST:
      var yoffset = RNR(1,height/2);
      var room = {left:location.x,right:location.x+width-1,top:location.y-yoffset,bottom:location.y-yoffset+height-1};
      break;
    case direction.WEST:
      var yoffset = RNR(1,height/2);
      var room = {left:location.x-width+1,right:location.x,top:location.y-yoffset,bottom:location.y-yoffset+height-1};
      break;
    return false;
  }
  
  if (!((room.left > rect.left) && (room.top > rect.top) && (room.right < rect.right) && (room.bottom < rect.bottom)))
    return false;

  for (var i=0;i<width;i++)
    for (var j=0;j<height;j++)
    {
      if ((i==0) || (i==width-1) || (j==0) || (j==height-1))
      {
	if (this.getCell(room.left+i,room.top+j) == tile.UNUSED)
	  this.setCell(room.left+i,room.top+j,wall);
      }
      else
	if (!this.isFixed(this.getCell(room.left+i,room.top+j)))
	  this.setCell(room.left+i,room.top+j,floor);
	  
    }
  if (!this.isFixed(this.getTile(location)))
    this.setTile(location,door);
  if (callback != null)
    callback(this,location,room);
  this.roomCount++;
  return true;
}

Generator.prototype.createRoom = function(location,dir,rect,callback=null,width=RNR(5,7),height=RNR(5,7),floor=tile.FLOOR,door=tile.DOOR,wall=tile.WALL)
{
  if (typeof location == 'undefined')
    return false;
  
  switch (dir)
  {
    case direction.NORTH:
      var xoffset = RNR(2,width/2);
      var room = {left:location.x-xoffset,right:location.x-xoffset+width-1,top:location.y-height+1,bottom:location.y};
      break;
    case direction.SOUTH:
      var xoffset = RNR(2,width/2);
      var room = {left:location.x-xoffset,right:location.x-xoffset+width-1,top:location.y,bottom:location.y+height-1};
      break;
    case direction.EAST:
      var yoffset = RNR(2,height/2);
      var room = {left:location.x,right:location.x+width-1,top:location.y-yoffset,bottom:location.y-yoffset+height-1};
      break;
    case direction.WEST:
      var yoffset = RNR(2,height/2);
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
	if ((t != tile.UNUSED) && (!this.isWall(t)))
	  return false;
      else
	if ((t != tile.UNUSED) && (!this.isWall(t)) && (!this.isFixed(t)))
	  return false;
    }
  
  for (var i=0;i<width;i++)
    for (var j=0;j<height;j++)
    {
      if ((i==0) || (i==width-1) || (j==0) || (j==height-1))
	var t = wall;
      else
	var t = floor;

      if (!this.isFixed(this.getCell(room.left+i,room.top+j)))
	this.setCell(room.left+i,room.top+j,t);
    }
  if (!this.isFixed(this.getTile(location)))
    this.setTile(location,door);
  if (callback != null)
    callback(this,location,room);
  this.roomCount++;
  return true;
}

Generator.prototype.oppositeDirection = function(dir)
{
    if (dir == direction.NORTH)
      return direction.SOUTH;
    if (dir == direction.SOUTH)
      return direction.NORTH;
    if (dir == direction.EAST)
      return direction.WEST;
    if (dir == direction.WEST)
      return direction.EAST;
}

Generator.prototype.moveLocation = function(location,dir)
{
    if (dir == direction.NORTH)
      return {x:location.x,y:location.y-1};
    if (dir == direction.SOUTH)
      return {x:location.x,y:location.y+1};
    if (dir == direction.EAST)
      return {x:location.x-1,y:location.y};
    if (dir == direction.WEST)
      return {x:location.x+1,y:location.y};
    return location;
}

Generator.prototype.convert = function()
{
    var tilesArray = new Array(this.array.length);
    for (var i=0; i<this.array.length;i++)
    {
	tilesArray[i] = new Array(this.array[0].length);
	for (var j=0; j<this.array[0].length;j++)
	{
	    tilesArray[i][j] = this.convertTile(this.array[i][j]);
	}
    }
    return tilesArray;
}

Generator.prototype.convertTile = function(t)
{
  if ((t==tile.FLOOR) || (t==tile.DOOR))
    return floorType.FLOOR;
  if ((t==tile.WALL) || (t==tile.CORRIDORWALL) || (t==tile.ROOMWALL) || (t==tile.FIXEDWALL))
    return floorType.WALL;
  if (t==tile.UNUSED)
    return floorType.ROCK;
  return 0;
}