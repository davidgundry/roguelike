function Player()
{
    this.target = {x:10,y:10};
    this.moveLock = false;
    this.tileMoveTime = 100;
    this.hasActed = false;
    this.animating = false;
    
    this.name = "Tolf";
    this.class = characterClass.KNIGHT

    this.coins = this.class.startCoins;
    this.xp = this.class.startXP;
    
    this.level = this.xpToLevel(this.xp);
    
    this.mgt = this.class.levels[this.level].mgt;
    this.end = this.class.levels[this.level].end;
    this.int = this.class.levels[this.level].int;
    this.wis = this.class.levels[this.level].wis;
    
    this.weapon = this.class.startWeapon;
    this.armour = this.class.startArmour;
    this.hat = this.class.startHat;
    this.amulet = this.class.startAmulet;
    
    this.hitPoints = this.class.levels[this.level].hp;
    this.maxHitPoints = this.hitPoints;
    
    this.updateStats();
    
    this.healingTurns = 0;
    this.maxHealingTurns = this.class.levels[this.level].healingTurns;
}

Player.prototype.updateStats = function()
{
    this.weaponBonus = this.weapon.bonus;
    this.armourBonus = this.armour.bonus;
    this.hatBonus = this.hat.bonus;
    this.amuletBonus = this.amulet.bonus;
    
    this.att = this.mgt + this.weaponBonus;
    this.def = this.end + this.armourBonus;
    this.skill = this.int + this.hatBonus;
    this.res = this.wis + this.amuletBonus;
    
    this.level = this.xpToLevel(this.xp);
    
    if (gui != null)
      gui.update();
}

Player.prototype.xpToLevel = function(xp)
{
    if (xp<=0)
      return 1;
    for (var i=2;i<this.class.levels.length;i++)
    {
	if (this.class.levels[i].xp > xp)
	  return i-1;
    }
    return this.class.levels.length-1;
}

Player.prototype.gainXP = function(xp)
{
  this.xp += xp;
  if (this.xpToLevel(this.xp) > this.level)
  {
    this.level = this.xpToLevel(this.xp);
    this.levelUp();
  }
  gui.update();
}

Player.prototype.gainCoins = function(coins)
{
    this.coins += coins;
    var snd = game.add.audio('SND_COIN');
    snd.play();
    gui.update();
}

Player.prototype.gainObject = function(obj)
{
  if (obj.type == "weapon") this.gainWeapon(obj);
  else if (obj.type == "armour") this.gainArmour(obj);
  else if (obj.type == "hat") this.gainHat(obj);
  else if (obj.type == "amulet") this.gainAmulet(obj);
}

Player.prototype.gainWeapon = function(weapon)
{
    if (weapon.bonus > this.weapon.bonus)
      this.weapon = weapon;
    this.updateStats();
    gui.update();
}

Player.prototype.gainArmour = function(armour)
{
    if (armour.bonus > this.armour.bonus)
      this.armour = armour;
    this.updateStats();
    gui.update();
}

Player.prototype.gainHat = function(hat)
{
    if (hat.bonus > this.hat.bonus)
      this.hat = hat;
    this.updateStats();
    gui.update();
}

Player.prototype.gainAmulet = function(amulet)
{
    if (amulet.bonus > this.amulet.bonus)
      this.amulet = amulet;
    this.updateStats();
    gui.update();
}

Player.prototype.levelUp = function()
{
    log.append("You have leveled up!");
    
    var snd = game.add.audio('SND_LEVL');
    snd.play();
    
    this.mgt = this.class.levels[this.level].mgt;
    this.end = this.class.levels[this.level].end;
    this.int = this.class.levels[this.level].int;
    this.wis = this.class.levels[this.level].wis;
    
    this.maxHealingTurns = this.class.levels[this.level].healingTurns;
    this.maxHitPoints = this.class.levels[this.level].hp;
    this.hitPoints = this.maxHitPoints;
    
    this.updateStats();
    this.updateHitBar();
    
    gui.update();
}

Player.prototype.recreate = function()
{
    if (this.sprite != null)
    {
      this.sprite.animations.stop();
      this.sprite.destroy();
      this.sprite = null;
    }
  
    this.sprite = game.add.sprite(this.target.x*tileWidth+tileWidth/2,this.target.y*tileHeight+tileHeight/2, 'characters');
    this.sprite.animations.add('pright', [14,15,16,17], 20, true);
    this.sprite.animations.add('pup', [14,15,16,17], 20, true);
    this.sprite.animations.add('pattackright', [23,24,25,26,27,14], 20, false);
    this.sprite.frame=14;

    this.sprite.anchor.setTo(0.5,0.5);
    game.camera.follow(this.sprite);
    this.createHitBar();
    this.updateHitBar();
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
    var maxDef = this.def-2;
    var minDef = Math.round(maxDef*(2/3));
    var def = RNR(minDef,maxDef);
    damage -= def;
    if (damage >0)
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
	  gui.update();
	  return false;
      }
    }
}

Player.prototype.heal = function(amount)
{
  this.hitPoints+= amount;
  if (this.hitPoints > this.maxHitPoints)
    this.hitPoints = this.maxHitPoints;
  gui.update();
  this.updateHitBar();
}
  
Player.prototype.kill = function()
{
  log.append("You have been killed.");
  gui.update();
 //TODO: stub 
}


Player.prototype.attack = function(attackTarget,level)
{
    var xp = level.getMonsterAt(attackTarget).xp;
    var enemy = level.getMonsterAt(attackTarget).enemy;
    var maxDamage = Math.round((this.att*this.att)/3);
    var minDamage = Math.round(((this.att*this.att)-maxDamage)/3);
    var damage = RNR(minDamage,maxDamage);
    if (damage >0)
    {
      if (level.getMonsterAt(attackTarget).damage(damage))
      {
	log.append("You get " + xp + " XP from killing the " + enemy.name);
	this.gainXP(xp);
      }
    }
}

Player.prototype.input = function(cursor,world)
{
    var pressedKey = true;
    var newTarget = {x:0,y:0};
    
    if ((cursor.left.isDown) || (cursor.a.isDown))
	newTarget = {x:this.target.x-1,y:this.target.y};
    else if ((cursor.right.isDown) || (cursor.d.isDown))
	newTarget = {x:this.target.x+1,y:this.target.y};
    else if ((cursor.up.isDown) || (cursor.w.isDown))
	newTarget = {x:this.target.x,y:this.target.y-1};
    else if ((cursor.down.isDown) || (cursor.s.isDown))
	newTarget = {x:this.target.x,y:this.target.y+1};
    else if (cursor.n.isDown)
    {
      pressedKey = false;
      this.hasActed = false;
      AiTurn = true;
    }
    else
	pressedKey=false;
    
    if (pressedKey)
    {
	var monster = false;
	var objBlock = false;
	var changedRegion = false;
	
	if (world.getLevel().isOffMap(newTarget))
	{
	    if (world.getLevel().isOffRegionRight(newTarget))
	      world.getLevel().changeRegionRight();
	    else if (world.getLevel().isOffRegionLeft(newTarget))
	      world.getLevel().changeRegionLeft();
	    else if (world.getLevel().isOffRegionTop(newTarget))
	      world.getLevel().changeRegionUp();
	    else if (world.getLevel().isOffRegionBottom(newTarget))
	      world.getLevel().changeRegionDown();
	    changedRegion = true;
	}
	else if (world.getLevel().isMonsterAt(newTarget))
	{
	    monster = true;
	    this.attack(newTarget,world.getLevel());
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
		AiTurn = true;
		this.hasActed = false;
	    }, this);
	    var attackSound = game.add.audio('attack');
	    attackSound.play();
	}
	else if (world.getLevel().isObjectAt(newTarget))
	{
	  objBlock = world.getLevel().useObjectAt(newTarget);
	  world.getLevel().createObjects();
	}
	
	if ((!changedRegion) && (!monster) && (!objBlock) && world.getLevel().isValidTarget(newTarget))
	{
	    this.target = newTarget;
	    var t = game.add.tween(this.sprite);
	    t.to({x: this.target.x*tileWidth+tileWidth/2, y:this.target.y*tileHeight+tileHeight/2}, this.tileMoveTime /*duration of the tween (in ms)*/, Phaser.Easing.Linear.None /*easing type*/, true /*autostart?*/, 0 /*delay*/, false /*yoyo?*/);
	    t.repeat(0);
	    t.onComplete.add(function()
	    {
	      this.moveLock = false;
	      this.sprite.animations.stop();
	      AiTurn = true;
	      this.hasActed = false;
	    },this);
	    this.moveLock = true;
	    this.hasActed = true;
	    
	    if (world.getLevel().isLootAt(newTarget))
	    {
		var loot = world.getLevel().getLootAt(newTarget);
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
	
    }
};
