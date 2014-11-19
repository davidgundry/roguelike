function World()
{
  this.map = game.add.tilemap();
  this.layer = this.map.create('level1', 30, 30, 32, 32);
  this.map.addTilesetImage('tileset');
  for (var i=0;i<30;i++)
    for (var j=0;j<30;j++)
      this.map.putTile(1,i,j,this.layer);
}

