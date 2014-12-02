function Dungeon(regionSize)
{
    this.regionSize = regionSize * 3;
    this.mapSize = 20;
  
    this.array = new Array(regionSize+this.mapSize*3);
    for (var i=0; i<regionSize+this.mapSize*3;i++)
    {
	this.array[i] = new Array(regionSize+this.mapSize*3);
	for (var j=0; j<regionSize+this.mapSize*3;j++)
	{
	    this.array[i][j] = tile.UNUSED;
	}
    }
    
    this.origin = {x:Math.floor(regionSize/2),y:Math.floor(regionSize/2)};
}

Dungeon.prototype.tile = {
      WALL : "wall",
      FLOOR : "floor",
      UNUSED : "unused",
      DOOR : "door",
      CORRIDOR : "corridor"
    }
    
Dungeon.prototype.direction = {
      NORTH : "north",
      SOUTH : "south",
      EAST : "east",
      WEST : "west"
    }

Dungeon.prototype.generate = function ()
{
  createRoom(this.origin,direction.NORTH);
  for (var i=0;i<10;i++)
  {
      createFeature();
  }
}

Dungeon.prototype.RNR = function(low, high)
{
  high = Math.floor(high);
  low = Math.floor(low);
  var a = Math.floor(Math.random()*high+1)+low;
  if (a > high)
    a = high;
  return a;
}

Dungeon.prototype.getTile(location)
{
    return this.array[location.x][location.y];
}

Dungeon.prototype.getCell(x,y)
{
    return this.array[x][y];
}

Dungeon.prototype.setTile(location,t)
{
  this.array[location.x][location.y] = t;
}

Dungeon.prototype.setCell(x,y,t)
{
  this.array[x][y] = t;
}


Dungeon.prototype.isAdjacent(location,checkTile)
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

Dungeon.prototype.createFeature = function()
{
  var maxTries = 1000;
  for (var i=0;i<maxTries;i++)
  {
    var location = {x:RNR(0,this.regionSize),y:RNR(0,this.regionSize)};
    if (this.getTile(location) == tile.WALL)
    {
      if (!isAdjacent(location,tile.DOOR)
      {
	if (this.getCell(location.x,location.y-1) == tile.FLOOR)
	  this.createRoom(location,direction.SOUTH);
	if (this.getCell(location.x,location.y+1) == tile.FLOOR)
	  this.createRoom(location,direction.NORTH);
	if (this.getCell(location.x-1,location.y) == tile.FLOOR)
	  this.createRoom(location,direction.EAST);
	if (this.getCell(location.x+1,location.y) == tile.FLOOR)
	  this.createRoom(location,direction.WEST);
      }
    }
  }
}

Dungeon.prototype.createRoom = function(location,dir)
{
  var width = 3;
  var height = 3;
  if ((dir == direction.NORTH) || (dir == direction.SOUTH))
    var offset = RNR(-width/2,width/2);
  else
    var offset = RNR(-height/2,height/2);
  
  this.setTile(location,tile.DOOR);
  location = this.moveLocation(location,dir);
  
  for (var i=0;i<width;i++)
    for (var j=0;j<height;j++)
    {
      if ((i==0) || (i==width-1) || (j==0) || (j==height-1))
	var t = tile.WALL;
      else
	var t = tile.FLOOR;
	
      if ((dir == direction.NORTH)
	this.setCell(location.x+i+offset,location.y-j,t)
      else if ((dir == direction.SOUTH)
	this.setCell(location.x+i+offset,location.y+j,t)
      if ((dir == direction.EAST)
	this.setCell(location.x+i,location.y+j+offset,t)
      else if ((dir == direction.WEST)
	this.setCell(location.x-i,location.y+j+offset,t)
    }
  
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