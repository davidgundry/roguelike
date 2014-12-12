function Player()
{
    this.target = {x:10,y:10};

    this.recreate();

    this.moveLock = false;
    this.sprite.body.moves = false;
    this.tileMoveTime = 300;
    this.hasActed = false;
    this.animating = false;
    
    this.hitPoints = Math.floor(Math.random()*10)+10;
    this.maxHitPoints = this.hitPoints;
    this.createHitBar();
    
    this.coins = 0;
}

Player.prototype.recreate = function()
{
    if (this.sprite != null)
      this.sprite.destroy();
  
    this.sprite = game.add.sprite(this.target.x*tileWidth+tileWidth/2,this.target.y*tileHeight+tileHeight/2, 'characters');
    game.physics.arcade.enable(this.sprite);
    this.sprite.animations.add('pright', [14,15,16,17], 12, true);
    this.sprite.animations.add('pup', [14,15,16,17], 12, true);
    this.sprite.animations.add('pattackright', [23,24,25,26,27,14], 12, false);
    this.sprite.frame=14;

    this.sprite.anchor.setTo(0.5,0.5);
    game.camera.follow(this.sprite);
}
  
Player.prototype.createHitBar = function()
{
    var width = 22;
    var height = 3;
    
    var bmd = game.add.bitmapData(width, height);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fillStyle = '#ffffff';
    bmd.ctx.fill();
    this.hitBarDamaged = null;
    this.hitBar = game.add.sprite(0, -14, bmd);
    this.hitBar.anchor.setTo(0.5, 0.5);
    this.sprite.addChild(this.hitBar);
    this.hitBar.visible =false;
    this.hitBar.alpha = 0.7;
}

Player.prototype.updateHitBar = function()
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
    this.hitBarDamaged = game.add.sprite(-11,0, bmd);
    this.hitBarDamaged.anchor.setTo(0, 0.5);
    this.hitBar.addChild(this.hitBarDamaged);
    
    if (this.hitPoints < this.maxHitPoints)
      this.hitBar.visible = true;
    else
       this.hitBar.visible = false;
}

Player.prototype.damage = function(damage)
{
    this.hitPoints -= damage;
    log.append("You were hit for " + damage + " damage!");
    var hurt = game.add.audio('hurt');
    hurt.play();
    
    if (this.hitPoints<=0)
    {
	this.kill()
	return true;
    }
    else
    {
	this.updateHitBar();
	return false;
    }
}
  
Player.prototype.kill = function()
{
  log.append("You have been killed.");
 //TODO: stub 
}

Player.prototype.move = function()
{
    // no blocking on player:
    if (this.hasActed)
    {
	AiTurn = true;
	this.hasActed = false;
    }
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

Player.prototype.attack = function(attackTarget,level)
{
    level.getMonsterAt(attackTarget).damage(Math.floor(Math.random()*8+1+2)); //1d8+2
}
  
Player.prototype.input = function(cursor,level)
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
	if (level.isObjectAt(newTarget))
	{
	  level.useObjectAt(newTarget);
	}
	else if (level.isMonsterAt(newTarget))
	{
	    this.attack(newTarget,level);
	    this.hasActed = true;
	    this.animating = true;
	    if (newTarget.x > this.target.x)
	    {
		this.sprite.scale.x = 1;
		this.hitBar.scale.x = 1;
		this.sprite.animations.play('pattackright');
	    }
	    else
	    {
		this.sprite.scale.x = -1;
		this.hitBar.scale.x = -1;
		this.sprite.animations.play('pattackright');
	    }
	    this.sprite.events.onAnimationComplete.add(function()
	    {
		this.animating = false;
	    }, this);
	    var attackSound = game.add.audio('attack');
	    attackSound.play();
	}
	else if (level.isValidTarget(newTarget))
	{
	    this.target = newTarget;
	    var t = game.add.tween(this.sprite);
	  t.to({x: this.target.x*tileWidth+tileWidth/2, y:this.target.y*tileHeight+tileHeight/2}, this.tileMoveTime /*duration of the tween (in ms)*/, Phaser.Easing.Linear.None /*easing type*/, true /*autostart?*/, 0 /*delay*/, false /*yoyo?*/);
	    this.moveLock = true;
	    this.hasActed = true;
	    
	    if (level.isLootAt(newTarget))
	    {
		var loot = level.getLootAt(newTarget);
		for (var i=0;i<loot.length;i++)
		  loot[i].pickedUp(this);
	    }
	    
	    if (this.target.x*tileWidth < this.sprite.x)
	    {
		this.sprite.scale.x = -1;
		this.hitBar.scale.x = -1;
		this.sprite.animations.play('pright');
	    }
	    else if (this.target.x*tileWidth > this.sprite.x)
	    {
		this.sprite.scale.x = 1;
		this.hitBar.scale.x = 1;
		this.sprite.animations.play('pright');
	    }
	    else if (this.target.y*tileHeight > this.sprite.y)
	    {
		this.sprite.scale.x = -1;
		this.hitBar.scale.x = -1;
		this.sprite.animations.play('pup');
	    }
	    else if (this.target.y*tileHeight < this.sprite.y)
	    {
		this.sprite.scale.x = 1;
		this.hitBar.scale.x = 1;
		this.sprite.animations.play('pup');
	    }
	}
	else if (level.isOffMap(newTarget))
	{
	    if (level.isOffRegionRight(newTarget))
	      level.changeRegionRight();
	    if (level.isOffRegionLeft(newTarget))
	      level.changeRegionLeft();
	    if (level.isOffRegionTop(newTarget))
	      level.changeRegionUp();
	    if (level.isOffRegionBottom(newTarget))
	      level.changeRegionDown();
	}
	
    }
};
