function MonsterAnimal(x,y)
{
  this.sprite = game.add.sprite(x*tileWidth+tileWidth/2,y*tileHeight+tileHeight/2,'characters');
  this.sprite.anchor.setTo(0.5,0.5);
  this.target = {x:x,y:y};
  this.moveLock = false;
  this.hasActed = false;
  this.alive = true;
  this.tileMoveTime = 500;
  
  this.hitPoints = Math.floor(Math.random()*7)+7;
  this.maxHitPoints = this.hitPoints;
  
  this.sprite.animations.add('emright', [0,1,2,3], 12, true);
  this.sprite.animations.add('emup', [0,1,2,3], 12, true);
  this.sprite.frame=0;
    
 // this.sprite.animations.add('emright', [28,29,30,31], 12, true);
 // this.sprite.animations.add('emup', [28,29,30,31], 12, true);
 // this.sprite.frame=28;
  
 // this.sprite.animations.add('emright', [42,43,44,45], 12, true);
 // this.sprite.animations.add('emup', [42,43,44,45], 12, true);
 // this.sprite.frame=42;
  
  var width = 22;
  var height = 3;
  
  var bmd = game.add.bitmapData(width, height);
  bmd.ctx.beginPath();
  bmd.ctx.rect(0, 0, width, height);
  bmd.ctx.fillStyle = '#ffffff';
  bmd.ctx.fill();
  this.hitBarDamaged = null;
  this.hitBar = game.add.sprite(this.sprite.x+27, this.sprite.y+4, bmd);
  this.hitBar.anchor.setTo(1, 0.5);
  this.sprite.addChild(this.hitBar);
  this.hitBar.visible =false;
}

MonsterAnimal.prototype.setSpritePosition = function()
{
  this.sprite.x = this.target.x*tileWidth+tileWidth/2;
  this.sprite.y = this.target.y*tileHeight+tileHeight/2;
}

MonsterAnimal.prototype.move = function()
{
    if ((this.sprite.x == this.target.x*tileWidth + tileWidth/2) && (this.sprite.y == this.target.y*tileHeight+ tileHeight/2))
    {
	this.moveLock = false;
	this.sprite.animations.stop();
    }
}

MonsterAnimal.prototype.damage = function(damage)
{
    this.hitPoints -= damage;
    if (this.hitPoints<=0)
    {
      this.kill()
      return true;
    }
    else
    {
      var width = 22*(this.hitPoints/this.maxHitPoints);
      var height = 3;
      var bmd = game.add.bitmapData(width, height);
      bmd.ctx.beginPath();
      bmd.ctx.rect(0, 0, width, height);
      bmd.ctx.fillStyle = '#ff0000';
      bmd.ctx.fill();
      if (this.hitBarDamaged != null)
	  this.hitBarDamaged.destroy();
      this.hitBarDamaged = game.add.sprite(0,0, bmd);
      this.hitBarDamaged.anchor.setTo(1, 0.5);
      this.hitBar.addChild(this.hitBarDamaged);
      this.hitBar.visible = true;
      return false;
    }
}

MonsterAnimal.prototype.kill = function()
{
    this.sprite.destroy();
    this.target = {x:-1,y:-1};
    this.alive = false;
}

MonsterAnimal.prototype.act = function(world)
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