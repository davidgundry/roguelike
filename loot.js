function Loot(x,y)
{
}

Loot.prototype.kill = function()
{
    this.sprite.destroy();
    this.target = {x:-1,y:-1};
}

Loot.prototype.pickedUp = function(player)
{
    this.kill();
}


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
}


Potion.prototype.pickedUp = function(player)
{
    player.hitPoints += 10;
    log.append("The potion restores 10 HP");
    if (player.hitPoints > player.maxHitPoints)
      player.hitPoints = player.maxHitPoints;
    player.updateHitBar();
    var potion = game.add.audio('potion');
    potion.play();
    this.kill();
}


Coin.prototype = new Loot();
Coin.prototype.constructor=Coin;
function Coin(x,y,denomination)
{
  this.sprite = game.add.sprite(x*tileWidth+tileWidth/2,y*tileHeight+tileHeight/2,'loot');
  this.sprite.anchor.setTo(0.5,0.5);
  this.target = {x:x,y:y};
  this.sprite.animations.add('lootcpspin', [0,1,2,3,4,5,6,7], 12, true);
  this.sprite.animations.add('lootspspin', [8,9,10,11,12,13,14,15], 12, true);
  this.sprite.animations.add('lootgpspin', [16,17,18,19,20,21,22,23], 12, true);
  this.sprite.frame=0;
  if (denomination == 2)
  {
    this.sprite.animations.play('lootgpspin');
    this.value = 10;
  }
  if (denomination == 1)
  {
    this.sprite.animations.play('lootspspin');
    this.value = 5;
  }
  else
  {
    this.sprite.animations.play('lootcpspin');
    this.value = 1;
  }
}


Coin.prototype.pickedUp = function(player)
{
    player.coins+= this.value;
    var coin = game.add.audio('coin');
    coin.play();
    this.kill();
}