var weapon = [
      {type:"weapon", level:0, name: "No Weapon", img:16, bonus:0},
      {type:"weapon", level:0, name: "Crude Sword", img: 0, bonus:3},
      {type:"weapon", level:3, name: "Guard's Sword", img: 1, bonus:4},
      {type:"weapon", level:6, name: "Steel Cleaver", img: 2, bonus:5},
      {type:"weapon", level:9, name: "Warrior's Sword", img: 3, bonus:6},
      {type:"weapon", level:12, name: "Pirate's Cutlass", img: 4, bonus:7},
      {type:"weapon", level:15, name: "Fine Broadsword", img: 5, bonus:8},
      {type:"weapon", level:18, name: "Elven Longsword", img: 6, bonus:9},
      {type:"weapon", level:21, name: "Captain's Cutlass", img: 7, bonus:10},
      {type:"weapon", level:24, name: "Guardian's Blade", img: 8, bonus:11},
      {type:"weapon", level:27, name: "Enchanted Broadsword", img: 9, bonus:12},
      {type:"weapon", level:30, name: "Notched Blade", img: 10, bonus:13},
      {type:"weapon", level:33, name: "Hero's Blade", img: 11, bonus:14},
      {type:"weapon", level:36, name: "Royal Longsword", img: 12, bonus:15},
      {type:"weapon", level:39, name: "Wizard's Blade", img: 13, bonus:16},
      {type:"weapon", level:42, name: "Angelic Sword", img: 14, bonus:17},
      {type:"weapon", level:45, name: "Vorpal Blade", img: 15, bonus:18}
    ];
    
var armour = [
      {type:"armour", level:0, name: "No Armour", img: 16, bonus:0},
      {type:"armour", level:1, name: "Peasant's Jerkin", img: 80, bonus:2},
      {type:"armour", level:4, name: "Rusty Mail", img: 81, bonus:3},
      {type:"armour", level:7, name: "Scale Mail", img: 82, bonus:4},
      {type:"armour", level:10, name: "Breast Plate", img: 83, bonus:5},
      {type:"armour", level:13, name: "Dwarven Chain", img: 84, bonus:6},
      {type:"armour", level:16, name: "Mithril Chain", img: 85, bonus:7},
      {type:"armour", level:19, name: "Adamantine Full Plate", img: 86, bonus:8},
      {type:"armour", level:22, name: "Dragon Armour", img: 87, bonus:9},
    ];
    
var hat = [
      {type:"hat", level:2, name: "No Hat", img: 16, bonus:0},
      {type:"hat", level:5, name: "Green Hat", img: 160, bonus:1},
      {type:"hat", level:8, name: "Leather Cap", img: 161, bonus:2},
      {type:"hat", level:11, name: "Horned Helm", img: 162, bonus:3},
      {type:"hat", level:14, name: "Iron Cap", img: 163, bonus:4},
      {type:"hat", level:17, name: "Steel Helmet", img: 164, bonus:5},
      {type:"hat", level:20, name: "Full Helm", img: 165, bonus:6},
      {type:"hat", level:23, name: "Winged Helm", img: 166, bonus:7}
    ];
    
var amulet = [
      {type:"amulet", level:2, name: "No Amulet", img: 16, bonus:0},
      {type:"amulet", level:5, name: "Strong Belt", img: 240, bonus:2},
      {type:"amulet", level:8, name: "Sturdy Boots", img: 240, bonus:3},
      {type:"amulet", level:11, name: "Necklass", img: 240, bonus:4},
      {type:"amulet", level:14, name: "Ring", img: 240, bonus:5},
      {type:"amulet", level:17, name: "Necklass", img: 240, bonus:6},
      {type:"amulet", level:20, name: "Gauntlets", img: 240, bonus:7},
      {type:"amulet", level:23, name: "Paladin Boots", img: 240, bonus:8}
    ];
    
var knightLevels = [{},// Level 0 doesn't really exist, but this makes the indexes match
		    {xp:0, mgt:8,end:6,int:4,wis:4,hp:24,healingTurns:25}, 
		    {xp:100, mgt:8,end:6,int:4,wis:4,hp:30,healingTurns:25},
		    {xp:250, mgt:8,end:6,int:4,wis:4,hp:36,healingTurns:25},
		    {xp:500, mgt:9,end:6,int:4,wis:4,hp:43,healingTurns:25}, // Level 4
		    {xp:850, mgt:9,end:7,int:4,wis:4,hp:50,healingTurns:24},
		    {xp:1300, mgt:9,end:7,int:4,wis:4,hp:57,healingTurns:24},
		    {xp:1850, mgt:9,end:7,int:4,wis:4,hp:64,healingTurns:24}, 
		    {xp:2500, mgt:10,end:7,int:5,wis:5,hp:72,healingTurns:24} // Level 8
];

var characterClass = {
      KNIGHT : {name: "Knight", startCoins:0,startXP:0,startWeapon: weapon[1],startArmour: armour[0], startHat: hat[0], startAmulet: amulet[0], levels:knightLevels}
}

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
