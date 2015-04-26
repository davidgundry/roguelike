/*var direction = {
      NORTH : "north",
      SOUTH : "south",
      EAST : "east",
      WEST : "west"
    }
    
function randomDirection()
{
    var r = RNR(0,3);
    if (r==0)
      return direction.NORTH;
    if (r==1)
      return direction.SOUTH;
    if (r==2)
      return direction.EAST;
    else
      return direction.WEST;
}*/

Core.direction = {
  NORTH : "north",
  SOUTH : "south",
  EAST : "east",
  WEST : "west",
  
  /**
  * Returns a random direction
  * 
  * @return the direction
  */
  random:  function()
  {
    switch (Core.RNR(0,3))
    {
      case 0:
	return Core.direction.NORTH;
      case 1:
	return Core.direction.EAST;
      case 2:
	return Core.direction.SOUTH;
      case 3:
	return Core.direction.WEST;
    }
  },
  
  /**
  * Returns opposite direction to passed argument
  * 
  * @param dir 	direction
  * @return 	opposite direction
  */
  opposite: function(dir)
  {
      if (dir == Core.direction.NORTH)
	return Core.direction.SOUTH;
      if (dir == Core.direction.SOUTH)
	return Core.direction.NORTH;
      if (dir == Core.direction.EAST)
	return Core.direction.WEST;
      if (dir == Core.direction.WEST)
	return Core.direction.EAST;
  },
  
  /**
  * Return a location found by moving 1 cell in a given Core.direction.
  * 
  * @param location 	starting location
  * @param dir 		direction to move
  * @return 		newcation location
  */
  moveLocation: function(location,dir)
  {
      if (dir == Core.direction.NORTH)
	return {x:location.x,y:location.y-1};
      if (dir == Core.direction.SOUTH)
	return {x:location.x,y:location.y+1};
      if (dir == Core.direction.EAST)
	return {x:location.x-1,y:location.y};
      if (dir == Core.direction.WEST)
	return {x:location.x+1,y:location.y};
      return location;
  }
};