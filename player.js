function Player()
{
      this.respawn = {x: 16, y: 16};
      this.sprite = game.add.sprite(this.respawn.x,this.respawn.y, 'player');
      game.physics.arcade.enable(this.sprite);
      this.sprite.animations.add('right', [0,1,2,3], 12, true);
      this.sprite.animations.add('left', [13,14,15,16], 12, true);
      this.sprite.animations.add('up', [0,1,2,3], 12, true);
      this.sprite.animations.add('down', [13,14,15,16], 12, true);
      
      this.sprite.anchor.setTo(0.5,0.5);
     
      this.target = {x:0,y:0};
      this.moveLock = false;
      this.sprite.body.moves = false;
      this.tileMoveTime = 300;
      this.hasActed = false;
      
      game.camera.follow(this.sprite);
}
  

Player.prototype.move = function()
{
    if ((this.sprite.x == this.target.x*tileWidth + tileWidth/2) && (this.sprite.y == this.target.y*tileHeight+ tileHeight/2))
    {
	this.moveLock = false;
	if (this.hasActed)
	{
	  AiTurn = true;
	  this.hasActed = false;
	}
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
      }
      else if (world.isValidTarget(newTarget))
      {
	this.target = newTarget;
	var t = game.add.tween(this.sprite);
      t.to({x: this.target.x*tileWidth+tileWidth/2, y:this.target.y*tileHeight+tileHeight/2}, this.tileMoveTime /*duration of the tween (in ms)*/, Phaser.Easing.Linear.None /*easing type*/, true /*autostart?*/, 0 /*delay*/, false /*yoyo?*/);
	this.moveLock = true;
	this.hasActed = true;
      }     
    }
};
