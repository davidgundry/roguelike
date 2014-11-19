function World()
{
  this.map = game.add.tilemap();
  this.layer = this.map.create('level1', 10, 10, 32, 32);
  this.map.addTilesetImage('tileset');
  for (var i=0;i<10;i++)
    for (var j=0;j<10;j++)
      this.map.putTile(1,i,j,this.layer);
}

World.prototype.isValidTarget = function(target)
{
  if ((target.x >= 0) && (target.y >= 0) && (target.x<this.map.width) && (target.y<this.map.height))
    return true;
  return false;
}