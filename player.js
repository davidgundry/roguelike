function Player()
{
      this.respawn = {x: 40, y: 40};
      this.sprite = game.add.sprite(this.respawn.x,this.respawn.y, 'player');
      game.physics.arcade.enable(this.sprite);
      this.sprite.animations.add('right', [0,1,2,3], 12, true);
      this.sprite.animations.add('left', [13,14,15,16], 12, true);
      this.sprite.animations.add('up', [0,1,2,3], 12, true);
      this.sprite.animations.add('down', [13,14,15,16], 12, true);
      
      this.sprite.anchor.setTo(0.5,0.5);
     
      this.target = {x:1,y:1};
      this.moveLock = false;
      
      game.camera.follow(this.sprite);
}
  

Player.prototype.move = function()
{
    var spriteSpeed = 10;
    var tileWidth = 32;
    var tileHeight = 32;
    
    if (this.target.x*tileWidth < this.sprite.x)
    {
      var diff = this.target.x*tileWidth - this.sprite.x;
      this.sprite.body.velocity.x = -spriteSpeed;
    }
    else if (this.target.x*tileWidth > this.sprite.x)
      this.sprite.body.velocity.x = spriteSpeed;
    else
      this.sprite.body.velocity.x = 0;
    
    if (this.target.y*tileHeight < this.sprite.y)
      this.sprite.body.velocity.y = -spriteSpeed;
    else if (this.target.y*tileHeight > this.sprite.y)
      this.sprite.body.velocity.y = spriteSpeed;
    else
      this.sprite.body.velocity.y = 0;
      
    if (this.sprite.body.velocity.x <0)
      this.sprite.animations.play('left');
    else if (this.sprite.body.velocity.x >0)
      this.sprite.animations.play('right');
    else if (this.sprite.body.velocity.y >0)
      this.sprite.animations.play('down');
    else if (this.sprite.body.velocity.y <0)
      this.sprite.animations.play('up');
    else
    {
      this.sprite.animations.stop();
      this.moveLock = false;
    }
}
  
  
Player.prototype.input = function(cursor,world)
{
    if (cursor.left.isDown)
      this.target = {x:this.target.x-1,y:this.target.y};
    else if (cursor.right.isDown)
      this.target = {x:this.target.x+1,y:this.target.y};
    else if (cursor.up.isDown)
      this.target = {x:this.target.x,y:this.target.y-1};
    else if (cursor.down.isDown)
      this.target = {x:this.target.x,y:this.target.y+1};

    this.moveLock = true;
};
  
Player.prototype.die = function()
{
  //timer.add(1000);
  //timer.onEvent.add(Player.spawn, this);
  //timer.start();
  this.dieSound.play();
  this.dead = true;
  this.spawn();

};

Player.prototype.spawn = function()
{
  this.sprite.body.x = this.respawn.x;
  this.sprite.body.y = this.respawn.y;
  this.sprite.body.velocity.x = 0;
  this.sprite.body.velocity.y = 0;
  this.dead = false;
};
