var enemy = {
      BANDIT: "bandit",
      GOLEM: "golem",
      ANIMAL: "animal"
}

function Monster(x,y,level)
{
}

Monster.prototype.dropLoot = function(){}
Monster.prototype.act = function(){this.hasActed = true;}

Monster.prototype.createHitBar = function()
{
    var width = 22;
    var height = 3;
    
    var bmd = game.add.bitmapData(width, height);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fillStyle = '#ffffff';
    bmd.ctx.fill();
    this.hitBarDamaged = null;
    this.hitBar = game.add.sprite(this.sprite.x+16, this.sprite.y+4, bmd);
    this.hitBar.anchor.setTo(0.5, 0.5);
    this.sprite.addChild(this.hitBar);
    this.hitBar.visible =false;
    this.hitBar.alpha = 0.7;
}

Monster.prototype.updateHitBar = function()
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
    this.hitBar.visible = true;
}

Monster.prototype.damage = function(damage)
{
    if(this.hitBar == null)
      this.createHitBar();
    this.hitPoints -= damage;
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

Monster.prototype.kill = function()
{
    this.dropLoot();
    this.sprite.destroy();
    this.target = {x:-1,y:-1};
    this.alive = false;
}

Monster.prototype.setSpritePosition = function()
{
    this.sprite.x = this.target.x*tileWidth+tileWidth/2;
    this.sprite.y = this.target.y*tileHeight+tileHeight/2;
}

Monster.prototype.rescaleHitBar = function(x)
{
  if (this.hitBar != null)
    this.hitBar.scale.x = x;
}

Monster.prototype.moveAction = function(level,direction)
{
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
    if (level.isObjectAt(newTarget))
    {
      
    }
    else if (level.isPlayerAt(newTarget))
    {
	this.animating = true;
	level.player.damage(Math.floor(Math.random(6)+1));
	this.sprite.animations.play('emattackright');
	this.sprite.events.onAnimationComplete.add(function()
	{
	    this.animating = false;
	}, this);
	
	if (newTarget.x > this.target.x)
	{
	    this.sprite.scale.x = 1;
	    this.rescaleHitBar(1);
	    this.sprite.animations.play('emattackright');
	}
	else
	{
	    this.sprite.scale.x = -1;
	    this.rescaleHitBar(-1);
	    this.sprite.animations.play('emattackright');
	}
    }
    else if ((level.isValidTarget(newTarget)) && !(level.isMonsterAt(newTarget)))
    {
	this.target = newTarget;
	var t = game.add.tween(this.sprite);
	t.to({x: this.target.x*tileWidth+tileWidth/2, y:this.target.y*tileHeight+tileHeight/2}, this.tileMoveTime /*duration of the tween (in ms)*/, Phaser.Easing.Linear.None /*easing type*/, true /*autostart?*/, 0 /*delay*/, false /*yoyo?*/);
	t.onComplete.add(function()
	{
	  this.moveLock = false;
	  this.sprite.animations.stop();
	},this);
	this.moveLock = true;
	
	if (this.target.x*tileWidth < this.sprite.x)
	{
	    this.sprite.animations.play('emright');
	    this.sprite.scale.x = -1;
	    this.rescaleHitBar(-1);
	}
	else if (this.target.x*tileWidth > this.sprite.x)
	{
	    this.sprite.scale.x = 1;
	    this.rescaleHitBar(1);
	    this.sprite.animations.play('emright');
	}
	else if (this.target.y*tileHeight > this.sprite.y)
	{
	    this.sprite.scale.x = -1;
	    this.rescaleHitBar(-1);
	    this.sprite.animations.play('emup');
	}
	else if (this.target.y*tileHeight < this.sprite.y)
	{
	    this.sprite.scale.x = 1;
	    this.rescaleHitBar(1);
	    this.sprite.animations.play('emup');
	}
    } 
    this.hasActed = true;
}


MonsterAnimal.prototype = new Monster();
MonsterAnimal.prototype.constructor=MonsterAnimal;
function MonsterAnimal(x,y,level)
{
    this.enemy = enemy.ANIMAL;
    this.level = level;
    this.target = {x:x,y:y};
    this.moveLock = false;
    this.hasActed = false;
    this.animating = false;
    this.alive = true;
    this.tileMoveTime = 300;

    this.sprite = game.add.sprite(x*tileWidth+tileWidth/2,y*tileHeight+tileHeight/2,'characters');
    this.sprite.anchor.setTo(0.5,0.5);

    
    this.hitPoints = Math.floor(Math.random()*6)+1  +  Math.floor(Math.random()*6)+1;  //2d6
    this.maxHitPoints = this.hitPoints;
    
  //  this.sprite.animations.add('emright', [0,1,2,3], 12, true);
  //  this.sprite.animations.add('emup', [0,1,2,3], 12, true);
  //  this.sprite.animations.add('emattackright', [9,10,11,12,13,0], 12, false);
  //  this.sprite.frame=0;
      

   this.sprite.animations.add('emright', [42,43,44,45], 12, true);
   this.sprite.animations.add('emup', [42,43,44,45], 12, true);
   this.sprite.frame=42;
}

MonsterAnimal.prototype.dropLoot = function()
{
    this.level.addLoot(new Coin(this.target.x,this.target.y,Math.floor(Math.random()*3+1)));
}

MonsterAnimal.prototype.act = function(level)
{
    var direction = Math.floor(Math.random()*5)+1;
    this.moveAction(level,direction);
}


MonsterGolem.prototype = new Monster();
MonsterGolem.prototype.constructor=MonsterAnimal;
function MonsterGolem(x,y,level)
{
    this.enemy = enemy.GOLEM;
    this.level = level;
    this.target = {x:x,y:y};
    this.moveLock = false;
    this.hasActed = false;
    this.animating = false;
    this.alive = true;
    this.tileMoveTime = 300;

    this.sprite = game.add.sprite(x*tileWidth+tileWidth/2,y*tileHeight+tileHeight/2,'characters');
    this.sprite.anchor.setTo(0.5,0.5);
    
    this.hitPoints = Math.floor(Math.random()*10)+1  +  Math.floor(Math.random()*10)+1  + 4;  //2d10+4
    this.maxHitPoints = this.hitPoints;
    
    this.sprite.animations.add('emright', [0,1,2,3], 12, true);
    this.sprite.animations.add('emup', [0,1,2,3], 12, true);
    this.sprite.animations.add('emattackright', [9,10,11,12,13,0], 12, false);
    this.sprite.frame=0;
    
}

MonsterGolem.prototype.dropLoot = function()
{
    if (Math.random()>0.6)
	this.level.addLoot(new Potion(this.target.x,this.target.y));
    else
	this.level.addLoot(new Coin(this.target.x,this.target.y,Math.floor(Math.random()*3+1)));
}

MonsterGolem.prototype.act = function(level)
{
    var direction = 0;
    var xdiff = (level.player.target.x - this.target.x);
    var ydiff = (level.player.target.y - this.target.y);
    if (Math.abs(xdiff) >= Math.abs(ydiff))
    {
	if (xdiff > 0)
	    direction = 2;
	else
	    direction = 4;
    }
    else
    {
       	if (ydiff > 0)
	    direction = 3;
	else
	    direction = 1;
    }
    
    this.moveAction(level,direction);
}




MonsterBandit.prototype = new Monster();
MonsterBandit.prototype.constructor=MonsterAnimal;
function MonsterBandit(x,y,level)
{
    this.enemy = enemy.BANDIT;
    this.level = level;
    this.target = {x:x,y:y};
    this.moveLock = false;
    this.hasActed = false;
    this.animating = false;
    this.alive = true;
    this.tileMoveTime = 300;

    this.sprite = game.add.sprite(x*tileWidth+tileWidth/2,y*tileHeight+tileHeight/2,'characters');
    this.sprite.anchor.setTo(0.5,0.5);
    
    this.hitPoints = Math.floor(Math.random()*8)+1  +  Math.floor(Math.random()*8)+1  + 4;  //2d8+4
    this.maxHitPoints = this.hitPoints;
    
   this.sprite.animations.add('emright', [28,29,30,31], 12, true);
   this.sprite.animations.add('emup', [28,29,30,31], 12, true);
   this.sprite.frame=28;
    
}

MonsterBandit.prototype.dropLoot = function()
{
    if (Math.random()>0.5)
	this.level.addLoot(new Potion(this.target.x,this.target.y));
    else
	this.level.addLoot(new Coin(this.target.x,this.target.y,Math.floor(Math.random()*3+1)));
}

MonsterBandit.prototype.act = function(level)
{
    var direction = 0;
    var xdiff = (level.player.target.x - this.target.x);
    var ydiff = (level.player.target.y - this.target.y);
    if (Math.abs(xdiff) >= Math.abs(ydiff))
    {
	if (xdiff > 0)
	    direction = 2;
	else
	    direction = 4;
    }
    else
    {
       	if (ydiff > 0)
	    direction = 3;
	else
	    direction = 1;
    }
    
    this.moveAction(level,direction);
}