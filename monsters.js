function EasyMonster(x,y)
{
  this.sprite = game.add.sprite(x*tileWidth+tileWidth/2,y*tileHeight+tileHeight/2,'characters');
  this.sprite.anchor.setTo(0.5,0.5);
  this.target = {x:x,y:y};
  this.moveLock = false;
  this.hasActed = false;
  this.tileMoveTime = 500;
  
  this.sprite.animations.add('emright', [0,1,2,3], 12, true);
  this.sprite.animations.add('emup', [0,1,2,3], 12, true);
  this.sprite.frame=0;
    
 // this.sprite.animations.add('emright', [28,29,30,31], 12, true);
 // this.sprite.animations.add('emup', [28,29,30,31], 12, true);
 // this.sprite.frame=28;
  
 // this.sprite.animations.add('emright', [42,43,44,45], 12, true);
 // this.sprite.animations.add('emup', [42,43,44,45], 12, true);
 // this.sprite.frame=42;
}

EasyMonster.prototype.setSpritePosition = function()
{
  this.sprite.x = this.target.x*tileWidth+tileWidth/2;
  this.sprite.y = this.target.y*tileHeight+tileHeight/2;
}

EasyMonster.prototype.move = function()
{
    if ((this.sprite.x == this.target.x*tileWidth + tileWidth/2) && (this.sprite.y == this.target.y*tileHeight+ tileHeight/2))
    {
	this.moveLock = false;
	this.sprite.animations.stop();
    }
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
    
     if (this.target.x*tileWidth < this.sprite.x)
     {
	this.sprite.animations.play('emright');
	this.sprite.scale.x = -1;
     }
    else if (this.target.x*tileWidth > this.sprite.x)
    {
	this.sprite.scale.x = 1;
	this.sprite.animations.play('emright');
    }
    else if (this.target.y*tileHeight > this.sprite.y)
    {
	this.sprite.scale.x = -1;
	this.sprite.animations.play('emup');
    }
    else if (this.target.y*tileHeight < this.sprite.y)
    {
	this.sprite.scale.x = 1;
	this.sprite.animations.play('emup');
    }
  } 
  this.hasActed = true;
}