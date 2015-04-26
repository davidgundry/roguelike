 var direction = {
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
}

