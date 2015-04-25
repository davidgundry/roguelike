var actions = {
      ANIMAL: "animal",
      DEFAULT: "default"
};

var enemy = {
      BANDIT: {name:"bandit",hp:90,att:6,def:7,xp:50,loot:loot.REDPOTION,lootchance:0.3,altloot:loot.SILVERCOIN,emright:[28,29,30,31],emup:[28,29,30,31],emattackright:null,action:actions.DEFAULT},
      GOLEM: {name:"golem",hp:80,att:5,def:10,xp:40,loot:loot.BLUEPOTION,lootchance:0.3,altloot:loot.GOLDCOIN,emright:[0,1,2,3],emup:[0,1,2,3],emattackright:[9,10,11,12,13,0],action:actions.DEFAULT},
      
      //Vermin
      RAT: {name:"rat",xp:2,hp:20,att:5,def:5,loot:loot.COPPERCOIN,lootchance:0.5,altloot:loot.NONE,emright:[46,47],emup: [46,47],emattackright:null,friendly:false,action:actions.ANIMAL,actionProb: 70},
      SNAKE: {name:"snake",xp:2,hp:20,att:5,def:5,loot:loot.COPPERCOIN,lootchance:0.5,altloot:loot.NONE,emright:[42,43,44,45],emup: [42,43,44,45],emattackright:null,friendly:false,action:actions.ANIMAL,actionProb: 80},
      BEETLE: {name:"beetle",xp:2,hp:20,att:5,def:5,loot:loot.COPPERCOIN,lootchance:0.5,altloot:loot.NONE,emright:[48,48],emup: [50,51],emattackright:null,action:actions.DEFAULT},
      SCORPION: {name:"scorpion",xp:10,hp:52,att:5,def:6,loot:loot.COPPERCOIN,lootchance:0.8,altloot:loot.NONE,emright:[52,53],emup: [52,53],emattackright:null,action:actions.DEFAULT},
      SPIDER: {name:"spider",xp:10,hp:52,att:6,def:5,loot:loot.COPPERCOIN,lootchance:0.8,altloot:loot.NONE,emright:[54,55],emup: [54,55],emattackright:null,action:actions.DEFAULT},
      GIANTSPIDER: {name:"giant spider",xp:25,hp:74,att:6,def:7,loot:loot.NONE,lootchance:0,altloot:loot.COPPERCOIN,emright:[64,65],emup: [64,65],emattackright:null,action:actions.DEFAULT},
  
      //Animals
      CHICKEN: {name:"chicken",xp:0,hp:6,att:3,def:3,loot:loot.COPPERCOIN,lootchance:0.5,altloot:loot.NONE,emright:[56,57],emup: [56,57],emattackright:null,friendly:true,action:actions.ANIMAL, actionProb: 80},
      COW: {name:"cow",xp:2,hp:20,att:5,def:6,loot:loot.COPPERCOIN,lootchance:0.5,altloot:loot.NONE,emright:[58,59],emup: [58,59],emattackright:null,friendly:true,action:actions.ANIMAL, actionProb: 95},
      DOG: {name:"dog",xp:5,hp:52,att:5,def:6,loot:loot.COPPERCOIN,lootchance:0.5,altloot:loot.NONE,emright:[60,61],emup: [60,61],emattackright:null,friendly:true,action:actions.ANIMAL, actionProb: 70},
      WOLF: {name:"wolf",xp:25,hp:74,att:6,def:6,loot:loot.COPPERCOIN,lootchance:0.5,altloot:loot.NONE,emright:[62,63],emup: [62,63],emattackright:null,action:actions.DEFAULT}
};

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