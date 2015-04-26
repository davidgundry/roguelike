var loot = {
  NONE: {name:"None"},
  COPPERCOIN: {name:"Copper Coin",frames:[0,1,2,3,4,5,6,7]},
  SILVERCOIN: {name:"Silver Coin",frames:[8,9,10,11,12,13,14,15]},
  GOLDCOIN: {name:"Gold Coin",frames:[16,17,18,19,20,21,22,23]},
  GARNET: {name:"Garnet",frames:[24]},
  EMERALD: {name:"Emerald",frames:[25]},
  SAPPHIRE: {name:"Sapphire",frames:[26]},
  REDPOTION: {name:"Potion",frames:[27]},
  BLUEPOTION: {name:"Mana Potion",frames:[28]}
}

function Loot(lootType,x,y)
{
  this.loot = lootType;
  this.sprite = game.add.sprite(x*tileWidth+tileWidth/2,y*tileHeight+tileHeight/2,'loot');
  this.sprite.anchor.setTo(0.5,0.5);
  this.target = {x:x,y:y};
  if (this.loot.frames.length > 1)
  {
    this.sprite.animations.add('anim', this.loot.frames, 12, true);
    this.sprite.animations.play('anim');
  }
  else
    this.sprite.frame=this.loot.frames[0];
}

Loot.prototype.kill = function()
{
    this.sprite.destroy();
    this.target = {x:-1,y:-1};
}

Loot.prototype.pickedUp = function(player)
{
    switch (this.loot)
    {
      case loot.COPPERCOIN:
	  player.gainCoins(1);
	  break;
      case loot.SILVERCOIN:
	  player.gainCoins(5);
	  break;
      case loot.GOLDCOIN:
	  player.gainCoins(25);
	  break;
      case loot.GARNET:
	  player.gainCoins(50);
	  break;
      case loot.EMERALD:
	  player.gainCoins(100);
      case loot.SAPPHIRE:
	  player.gainCoins(200);
	  break;
      case loot.REDPOTION:
	  player.heal(10);
	  log.append("The potion restores 10 HP");
	  var potion = game.add.audio('SND_GULP');
	  potion.play();
	  break;
      case loot.BLUEPOTION:
	  log.append("The potion (will) restore 10 MP");
	  var potion = game.add.audio('SND_GULP');
	  potion.play();
	  break;
    }
    this.kill();
    gui.update();
}

/*
Potion.prototype = new Loot();
Potion.prototype.constructor=Potion;
function Potion(x,y)
{
  this.sprite = game.add.sprite(x*tileWidth+tileWidth/2,y*tileHeight+tileHeight/2,'potions');
  this.sprite.anchor.setTo(0.5,0.5);
  this.target = {x:x,y:y};
  
  var r = Math.floor(Math.random()*3);
  if (r==0)
    this.sprite.frame=10;
  else if (r==1)
    this.sprite.frame=41;
  else 
    this.sprite.frame=47;
}*/