var tile = {
      NONE : "none",
      WALL : "wall",
      FLOOR : "floor",
      UNUSED : "unused",
      DOOR : "door",
      CORRIDOR : "corridor",
      ROOMWALL : "roomwall",
      CORRIDORWALL : "corridorwall"
    }
    
var object = {
      STEPSUP : "stepsup",
      STEPSDOWN : "stepsdown"
    }
    
var direction = {
      NORTH : "north",
      SOUTH : "south",
      EAST : "east",
      WEST : "west"
    }


Dungeon.prototype = new WorldLevel();
Dungeon.constructor = Dungeon;
function Dungeon(worldArea,levelID) {WorldLevel.call(this,worldArea,levelID);}

Dungeon.prototype.initialise = function()
{
    this.array = new Array(this.regionSize+this.mapSize*3);
    for (var i=0; i<this.regionSize+this.mapSize*3;i++)
    {
	this.array[i] = new Array(this.regionSize+this.mapSize*3);
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
  if ((t==tile.WALL) || (t==tile.CORRIDORWALL) || (t==tile.ROOMWALL))
    return 11;
  if (t==tile.UNUSED)
    return 0;
  if (t==tile.DOOR)
    return 4;
  return 0;
}


Dungeon.prototype.generateAreaDungeon = function(origin)
{
  var targetRooms = 20;
  this.generateDenseDungeon(origin,{top:0,right:this.regionSize-1,bottom:this.regionSize-1,left:0},targetRooms,this.createRoomCallback);
}

/*
 * Generates a dungeon within a single region area. Origin MUST be within region!
 */
Dungeon.prototype.generateRegionDungeon = function(origin,x,y,type=this.randomDungeonType())
{
  var startingRoomCount = this.roomCount;
  if ((origin.x < x*this.mapSize) || (origin.y*this.mapSize < y) || (origin.x > (x+1)*this.mapSize) || (origin.y > (y+1)*this.mapSize))
  {
    console.log("origin must be within region!");
    return false;
  }
  this.generateX(type,origin,{top:y*this.mapSize,right:x*this.mapSize+this.mapSize,bottom:y*this.mapSize+this.mapSize,left:x*this.mapSize});
  
  if (this.roomCount == startingRoomCount)
    return false;
  return true;
}

dungeonTypes = {DENSE: "dense",
		LABYRINTH: "labyrinth",
		HALO: "halo"
};

Dungeon.prototype.randomDungeonType = function()
{
    return dungeonTypes.HALO;
    var pick = RNR(0,Object.keys(dungeonTypes).length);
    var key = Object.keys(dungeonTypes)[pick];
    return dungeonTypes[key];
}

Dungeon.prototype.generateX = function(type,origin,rect)
{
  if (type == dungeonTypes.DENSE)
    this.generateDenseDungeon(origin,rect,this.createRoomCallback);
  else if (type == dungeonTypes.LABYRINTH)
    this.generateLabyrinthDungeon(origin,rect);
  else if (type == dungeonTypes.HALO)
    this.generateHaloDungeon(origin,rect);
}

Dungeon.prototype.createRoomCallback = function(scope,location,width,height,direction,offset)
{
    scope.enemies.push({location:location,enemy:enemy.BANDIT});
}



Dungeon.prototype.generateDenseDungeon = function(origin,rect,roomCallback=null,targetRooms=RNR(4,8)+this.roomCount,maxTries=1000)
{
  if (this.createRoom(origin,direction.NORTH,rect))
    this.setTile(origin,tile.WALL);
  else
    return false;
  
  var tries = 0;
  while ((this.roomCount < targetRooms) && (tries < maxTries))
  {
    var locD = this.pickWallDirection(rect);
    if (locD != null)
      this.createRoom(locD.location,locD.direction,rect,roomCallback);
    tries++;
  }
  this.levelMap = this.convert();
  return true;
}

Dungeon.prototype.generateLabyrinthDungeon = function(origin,rect,roomCallback=null,targetRooms=RNR(15,25)+this.roomCount,maxTries=1000)
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
  this.levelMap = this.convert();
  return true;
}

Dungeon.prototype.generateHaloDungeon = function(origin,rect,roomCallback=null,targetRooms=RNR(15,20)+this.roomCount,maxTries=1000)
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
  
  this.levelMap = this.convert();
  return true;
}

/* Doesn't seem to work?*/
Dungeon.prototype.randomEnemies = function(numEnemies)
{
    for (var i=0;i<numEnemies;i++)
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
	    x = Math.floor(Math.random()*this.mapSize);
	    y = Math.floor(Math.random()*this.mapSize);
	    if ((this.isValidLocation({x:x,y:y})) && !(this.world.isMonsterAt({x:x,y:y})) && !(this.world.isObjectAt({x:x,y:y})))
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

Dungeon.prototype.addObject = function(location,object)
{
    this.objects.push({location:location,object:object});
}

Dungeon.prototype.pickWallDirection = function(rect,floorTile=tile.FLOOR,doorTile=tile.DOOR,wallTile=tile.WALL,maxTries=100)
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

Dungeon.prototype.isWall = function(t)
{
  if ((t==tile.WALL) || (t==tile.CORRIDORWALL) || (t==tile.ROOMWALL))
    return true;
  return false;
}

Dungeon.prototype.createRoom = function(location,dir,rect,callback=null,width=RNR(4,8),height=RNR(4,8),floor=tile.FLOOR,door=tile.DOOR,wall=tile.WALL)
{
  if ((dir == direction.NORTH) || (dir == direction.SOUTH))
    var offset = RNR(-width/2,0);
  else
    var offset = RNR(-height/2,0);

  if (typeof location == 'undefined')
    return false;
  
  if (!((location.x-width >= rect.left) && (location.y-height >= rect.top) && (location.x+width < rect.right) && (location.y+height < rect.bottom)))
    return false;
  
  for (var i=0;i<width;i++)
    for (var j=0;j<height;j++)
    {
      if ((i==0) || (i==width-1) || (j==0) || (j==height-1))
	var t = wall;
      else
	var t = floor;
	
      if (dir == direction.NORTH)
      {
	var t = this.getCell(location.x+i+offset,location.y-j);
	if ((t != tile.UNUSED) && (!this.isWall(t)))
	  return false;
      }
      else if (dir == direction.SOUTH)
      {
	var t = this.getCell(location.x+i+offset,location.y+j);
	if  ((t != tile.UNUSED) && (!this.isWall(t)))
	  return false;
      }
      else if (dir == direction.EAST)
      {
	var t = this.getCell(location.x+i,location.y+j+offset);
	if ((t != tile.UNUSED) && (!this.isWall(t)))
	  return false;
      }
      else if (dir == direction.WEST)
      {
	var t = this.getCell(location.x-i,location.y+j+offset);
	if ((t != tile.UNUSED) && (!this.isWall(t)))
	  return false;
      }
    }
  
  for (var i=0;i<width;i++)
    for (var j=0;j<height;j++)
    {
      if ((i==0) || (i==width-1) || (j==0) || (j==height-1))
	var t = wall;
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
      
  this.setTile(location,door);
  if (callback != null)
    callback(this,location,width,height,dir,offset);
  this.roomCount++;
  return true;
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