

function Monster(enemyType,x,y,level)
{
    this.enemy = enemyType;
    this.level = level;
    this.target = {x:x,y:y};
    this.moveLock = false;
    this.hasActed = false;
    this.animating = false;
    this.alive = true;
    this.tileMoveTime = 100;

    this.sprite = game.add.sprite(x*tileWidth+tileWidth/2,y*tileHeight+tileHeight/2,'characters');
    this.sprite.anchor.setTo(0.5,0.5);

    this.hitPoints = enemyType.hp;
    this.maxHitPoints = this.hitPoints;
    this.xp=enemyType.xp;
    this.att=enemyType.att;
    this.def=enemyType.def;
    
    this.action = enemyType.action;
      
    if (enemyType.emright != null)
      this.sprite.animations.add('emright', enemyType.emright, 20, true);
    if (enemyType.emup != null)
      this.sprite.animations.add('emup', enemyType.emup, 20, true);
    if (enemyType.emattackright != null)
      this.sprite.animations.add('emattackright', enemyType.emattackright, 20, false);
    
    this.sprite.frame = this.enemy.emright[0];
}

Monster.prototype.dropLoot = function()
{
  var drop = null;
  if (Math.random()<this.enemy.lootchance)
    drop = this.enemy.loot;
  else
    drop = this.enemy.altloot;
  if ((drop != null) && (drop != loot.NONE))
    this.level.addLoot(new Loot(drop,this.target.x,this.target.y));
}

Monster.prototype.act = function()
{
  switch (this.enemy.action)
  {
    case actions.ANIMAL:
      if (RNR(1,100) > this.enemy.actionProb)
	this.moveAction(this.level,RNR(1,4));
      break;
    case actions.DEFAULT:
      this.actDefault(this.level)
      break;
  }
  this.hasActed = true;
}

Monster.prototype.actDefault = function(level)
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
    this.hitBar = game.add.sprite(0, -14, bmd);
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
    this.hitBar.scale.x = this.sprite.scale.x;
}

Monster.prototype.damage = function(damage)
{
    var maxDef = this.def-2;
    var minDef = Math.round(maxDef*(2/3));
    var def = RNR(minDef,maxDef);
    damage -= def;
    if (damage >0)
    {
      this.hitPoints -= damage;
      if (this.hitPoints<=0)
      {
	  this.kill();
	  return true;
      }
      else
      {
	  if(this.hitBar == null)
	    this.createHitBar();
	  this.updateHitBar();
	  return false;
      }
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

Monster.prototype.getMaxDamage = function()
{
  return Math.round((this.att*this.att)/3)
}

Monster.prototype.getMinDamage = function()
{
  return Math.round(((this.att*this.att)-this.getMaxDamage())/3)
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
	if (!this.enemy.friendly)
	{
	    this.animating = true;
	    var damage = RNR(this.getMinDamage(),this.getMaxDamage());
	    level.player.damage(damage);
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
    }
    else if ((level.isValidTarget(newTarget)) && !(level.isMonsterAt(newTarget)))
    {
	this.target = newTarget;
	var t = game.add.tween(this.sprite);
	t.to({x: this.target.x*tileWidth+tileWidth/2, y:this.target.y*tileHeight+tileHeight/2}, this.tileMoveTime /*duration of the tween (in ms)*/, Phaser.Easing.Linear.None /*easing type*/, true /*autostart?*/, 0 /*delay*/, false /*yoyo?*/);
	t.repeat(0);
	t.onComplete.add(function()
	{
	  this.moveLock = false;
	  this.sprite.animations.stop();
	  this.sprite.frame = this.enemy.emright[0];
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
}