function Dungeon(regionSize)
{
    this.regionSize = regionSize * 3;
    this.mapSize = 20;
    this.roomCount = 0;
  
    this.array = new Array(this.regionSize+this.mapSize*3);
    for (var i=0; i<this.regionSize+this.mapSize*3;i++)
    {
	this.array[i] = new Array(regionSize+this.mapSize*3);
	for (var j=0; j<this.regionSize+this.mapSize*3;j++)
	{
	    this.array[i][j] = tile.UNUSED;
	}
    }
}

Dungeon.prototype.convert = function()
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

Dungeon.prototype.convertTile = function(t)
{
  if (t==tile.FLOOR)
    return 5;
  if (t==tile.WALL)
    return 11;
  if (t==tile.UNUSED)
    return 0;
  if (t==tile.DOOR)
    return 4;
  return 0;
}

var tile = {
      WALL : "wall",
      FLOOR : "floor",
      UNUSED : "unused",
      DOOR : "door",
      CORRIDOR : "corridor"
    }
    
var direction = {
      NORTH : "north",
      SOUTH : "south",
      EAST : "east",
      WEST : "west"
    }

Dungeon.prototype.generate = function(origin)
{
  var maxTries = 100;
  var targetRooms = 20;
  this.gen(maxTries,targetRooms,origin,{top:0,right:this.regionSize-1,bottom:this.regionSize-1,left:0});
}

/*
 * Generates a dungeon within a single region area. Origin MUST be within region!
 */
Dungeon.prototype.generateRegionDungeon = function(origin,x,y)
{
  var startingRoomCount = this.roomCount;
  if ((origin.x < x*this.mapSize) || (origin.y*this.mapSize < y) || (origin.x > (x+1)*this.mapSize) || (origin.y > (y+1)*this.mapSize))
  {
    console.log("origin must be within region!");
    return false;
  }
  var targetRooms = RNR(4,8);
  var maxTries = 1000;
  this.gen(maxTries,startingRoomCount+targetRooms,origin,{top:y*this.mapSize,right:x*this.mapSize+this.mapSize,bottom:y*this.mapSize+this.mapSize,left:x*this.mapSize});
  if (this.roomCount == startingRoomCount)
    return false;
  return true;
}

Dungeon.prototype.gen = function(maxTries,targetRooms,origin,rect)
{
  this.createRoom(origin,direction.NORTH,rect);
  this.setTile(origin,tile.WALL);
  var tries = 0;
  while ((this.roomCount < targetRooms) && (tries < maxTries))
  {
    this.createFeature(rect);
    tries++;
  }
}

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
  return a;
}

Dungeon.prototype.getTile = function(location)
{
    return this.array[location.x][location.y];
}

Dungeon.prototype.getCell = function(x,y)
{
    return this.array[x][y];
}

Dungeon.prototype.setTile = function(location,t)
{
  this.array[location.x][location.y] = t;
}

Dungeon.prototype.setCell = function(x,y,t)
{
  this.array[x][y] = t;
}


Dungeon.prototype.isAdjacent = function(location,checkTile)
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

Dungeon.prototype.createFeature = function(rect)
{
  var maxTries = 1000;
  for (var i=0;i<maxTries;i++)
  {
    var location = {x:RNR(rect.left,rect.right),y:RNR(rect.top,rect.bottom)};
    if (this.getTile(location) == tile.WALL)
    {
      if (!this.isAdjacent(location,tile.DOOR))
      {
	if (this.getCell(location.x,location.y-1) == tile.FLOOR)
	{
	  this.createRoom(location,direction.SOUTH,rect);
	  break;
	}
	else if (this.getCell(location.x,location.y+1) == tile.FLOOR)
	{
	  this.createRoom(location,direction.NORTH,rect);
	  break;
	}
	else if (this.getCell(location.x-1,location.y) == tile.FLOOR)
	{
	  this.createRoom(location,direction.EAST,rect);
	  break;
	}
	else if (this.getCell(location.x+1,location.y) == tile.FLOOR)
	{
	  this.createRoom(location,direction.WEST,rect);
	  break;
	}
      }
    }
  }
}

Dungeon.prototype.createRoom = function(location,dir,rect,floor=tile.FLOOR,door=tile.DOOR,wall=tile.WALL)
{
  var width = RNR(3,11);
  var height = RNR(3,11);
  if ((dir == direction.NORTH) || (dir == direction.SOUTH))
    var offset = RNR(-width/2-1,0);
  else
    var offset = RNR(-height/2-1,0);

  if (typeof location == 'undefined')
    return false;
  
  if (!((location.x-width >= rect.left) && (location.y-height >= rect.top) && (location.x+width < rect.right) && (location.y+height < rect.bottom)))
    return false;
  
  for (var i=0;i<width;i++)
    for (var j=0;j<height;j++)
    {
      if ((i==0) || (i==width-1) || (j==0) || (j==height-1))
	var t = tile.WALL;
      else
	var t = tile.FLOOR;
	
      if (dir == direction.NORTH)
      {
	var t = this.getCell(location.x+i+offset,location.y-j);
	if ((t != tile.UNUSED) && (t != tile.WALL))
	  return false;
      }
      else if (dir == direction.SOUTH)
      {
	var t = this.getCell(location.x+i+offset,location.y+j);
	if  ((t != tile.UNUSED) && (t != tile.WALL))
	  return false;
      }
      else if (dir == direction.EAST)
      {
	var t = this.getCell(location.x+i,location.y+j+offset);
	if ((t != tile.UNUSED) && (t != tile.WALL))
	  return false;
      }
      else if (dir == direction.WEST)
      {
	var t = this.getCell(location.x-i,location.y+j+offset);
	if ((t != tile.UNUSED) && (t != tile.WALL))
	  return false;
      }
    }
  
  for (var i=0;i<width;i++)
    for (var j=0;j<height;j++)
    {
      if ((i==0) || (i==width-1) || (j==0) || (j==height-1))
	var t = tile.WALL;
      else
	var t = floor;
	
      if (dir == direction.NORTH)
	this.setCell(location.x+i+offset,location.y-j,t)
      else if (dir == direction.SOUTH)
	this.setCell(location.x+i+offset,location.y+j,t)
      if (dir == direction.EAST)
	this.setCell(location.x+i,location.y+j+offset,t)
      else if (dir == direction.WEST)
	this.setCell(location.x-i,location.y+j+offset,t)
    }
      
  this.setTile(location,floor);
  this.setTile(location,door);
  this.roomCount++;
}

Dungeon.prototype.oppositeDirection = function(dir)
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

Dungeon.prototype.moveLocation = function(location,dir)
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