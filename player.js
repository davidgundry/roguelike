function Player()
{
      this.target = {x:2,y:2};
      
      this.sprite = game.add.sprite(this.target.x*tileWidth+tileWidth/2,this.target.y*tileHeight+tileHeight/2, 'characters');
      game.physics.arcade.enable(this.sprite);
      this.sprite.animations.add('pright', [14,15,16,17], 12, true);
      this.sprite.animations.add('pup', [14,15,16,17], 12, true);
      this.sprite.animations.add('pattackright', [23,24,25,26,27,14], 12, false);
      this.sprite.frame=14;
      
      this.sprite.anchor.setTo(0.5,0.5);

      this.moveLock = false;
      this.sprite.body.moves = false;
      this.tileMoveTime = 300;
      this.hasActed = false;
      this.animating = false;
      
      game.camera.follow(this.sprite);
}
  

Player.prototype.move = function()
{
    if (this.animating)
    {
      //this.sprite.animations.play('right');
    }
    else if ((this.sprite.x == this.target.x*tileWidth + tileWidth/2) && (this.sprite.y == this.target.y*tileHeight+ tileHeight/2))
    {
	this.moveLock = false;
	if (this.hasActed)
	{
	  AiTurn = true;
	  this.hasActed = false;
	}
	this.sprite.animations.stop();
    }
}

Player.prototype.attack = function(attackTarget,world)
{
    world.getAt(attackTarget).kill();
}
  
Player.prototype.input = function(cursor,world)
{
    var pressedKey = true;
    var newTarget = {x:0,y:0};
    
    if (cursor.left.isDown)
      newTarget = {x:this.target.x-1,y:this.target.y};
    else if (cursor.right.isDown)
      newTarget = {x:this.target.x+1,y:this.target.y};
    else if (cursor.up.isDown)
      newTarget = {x:this.target.x,y:this.target.y-1};
    else if (cursor.down.isDown)
      newTarget = {x:this.target.x,y:this.target.y+1};
    else
      pressedKey=false;
    
    if (pressedKey)
    {
      if (world.isEnemyAt(newTarget))
      {
	this.attack(newTarget,world);
	this.hasActed = true;
	this.animating = true;
	if (newTarget.x > this.target.x)
	{
	  this.sprite.scale.x = 1;
	  this.sprite.animations.play('pattackright');
	}
	else
	{
	  this.sprite.scale.x = -1;
	  this.sprite.animations.play('pattackright');
	}
	this.sprite.events.onAnimationComplete.add(function()
	{
	  this.animating = false;
	}, this);

      }
      else if (world.isValidTarget(newTarget))
      {
	this.target = newTarget;
	var t = game.add.tween(this.sprite);
      t.to({x: this.target.x*tileWidth+tileWidth/2, y:this.target.y*tileHeight+tileHeight/2}, this.tileMoveTime /*duration of the tween (in ms)*/, Phaser.Easing.Linear.None /*easing type*/, true /*autostart?*/, 0 /*delay*/, false /*yoyo?*/);
	this.moveLock = true;
	this.hasActed = true;
	
	if (this.target.x*tileWidth < this.sprite.x)
	{
	    this.sprite.scale.x = -1;
	    this.sprite.animations.play('pright');
	}
	else if (this.target.x*tileWidth > this.sprite.x)
	{
	    this.sprite.scale.x = 1;
	    this.sprite.animations.play('pright');
	}
	else if (this.target.y*tileHeight > this.sprite.y)
	{
	    this.sprite.scale.x = -1;
	    this.sprite.animations.play('pup');
	}
	else if (this.target.y*tileHeight < this.sprite.y)
	{
	    this.sprite.scale.x = 1;
	    this.sprite.animations.play('pup');
	}
      }     
    }
};
