function EasyMonster(x,y)
{
  this.sprite = game.add.sprite(x*tileWidth+tileWidth/2,y*tileHeight+tileHeight/2,'monster');
  this.sprite.anchor.setTo(0.5,0.5);
  this.target = {x:x,y:y};
  this.moveLock = false;
  this.hasActed = false;
  this.tileMoveTime = 250;
}

EasyMonster.prototype.move = function()
{
    if ((this.sprite.x == this.target.x*tileWidth + tileWidth/2) && (this.sprite.y == this.target.y*tileHeight+ tileHeight/2))
    {
	this.moveLock = false;
	this.sprite.animations.stop();
    }
    
    if (this.target.x*tileWidth < this.sprite.x)
	this.sprite.animations.play('left');
    else if (this.target.x*tileWidth > this.sprite.x)
	this.sprite.animations.play('right');
    else if (this.target.y*tileHeight > this.sprite.y)
	this.sprite.animations.play('down');
    else if (this.target.y*tileHeight < this.sprite.y)
	this.sprite.animations.play('up');
}

EasyMonster.prototype.act = function(world)
{
  
  
  var direction = Math.floor(Math.random()*4);
  if (direction == 1)
  {
    var target = this.target;
    target.y -=1;
    if ((world.isValidTarget(target)) && (!world.isEnemyAt(target)))
    {
      this.target = target;
      var t = game.add.tween(this.sprite);
      t.to({x: this.target.x*tileWidth+tileWidth/2, y:this.target.y*tileHeight+tileHeight/2}, this.tileMoveTime /*duration of the tween (in ms)*/, Phaser.Easing.Linear.None /*easing type*/, true /*autostart?*/, 0 /*delay*/, false /*yoyo?*/);
      this.moveLock = true;
      this.hasActed = true;
    }
  }
  if (direction == 2)
    this.target.x+=1;
  if (direction == 3)
    this.target.y+=1;
  if (direction == 4)
    this.target.x-=1;
  
}