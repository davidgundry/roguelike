function EasyMonster(x,y)
{
  this.sprite = game.add.sprite(x*tileWidth+tileWidth/2,y*tileHeight+tileHeight/2,'monster');
  this.sprite.anchor.setTo(0.5,0.5);
  this.target = {x:x,y:y};
  this.moveLock = false;
  this.hasActed = false;
  this.tileMoveTime = 500;
  
  this.sprite.animations.add('right', [0,1,2,3], 12, true);
  this.sprite.animations.add('left', [13,14,15,16], 12, true);
  this.sprite.animations.add('up', [0,1,2,3], 12, true);
  this.sprite.animations.add('down', [13,14,15,16], 12, true);
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

EasyMonster.prototype.kill = function()
{
    this.sprite.destroy();
    this.target = {x:-1,y:-1};
}

EasyMonster.prototype.act = function(world)
{
  var direction = Math.floor(Math.random()*4)+1;
  var newTarget = {x:this.target.x,y:this.target.y};
  if (direction == 1)
  {
    newTarget.y -=1;
  }
  else if (direction == 2)
  {
    newTarget.x +=1;
  }
  else if (direction == 3)
  {
    newTarget.y +=1;
  }
  else if (direction == 4)
  {
    newTarget.x -=1;
  }
  if (world.isPlayerAt(newTarget))
  {
    
  }
  else if ((world.isValidTarget(newTarget)) && !(world.isEnemyAt(newTarget)))
  {
    this.target = newTarget;
    var t = game.add.tween(this.sprite);
    t.to({x: this.target.x*tileWidth+tileWidth/2, y:this.target.y*tileHeight+tileHeight/2}, this.tileMoveTime /*duration of the tween (in ms)*/, Phaser.Easing.Linear.None /*easing type*/, true /*autostart?*/, 0 /*delay*/, false /*yoyo?*/);
    this.moveLock = true;
  } 
  this.hasActed = true;
}