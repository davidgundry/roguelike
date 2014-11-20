function Loot(x,y)
{
  this.sprite = game.add.sprite(x*tileWidth+tileWidth/2,y*tileHeight+tileHeight/2,'loot');
  this.sprite.anchor.setTo(0.5,0.5);
  this.target = {x:x,y:y};
  this.sprite.animations.add('lootcpspin', [0,1,2,3,4,5,6,7], 12, true);
  this.sprite.animations.add('lootspspin', [8,9,10,11,12,13,14,15], 12, true);
  this.sprite.animations.add('lootgpspin', [16,17,18,19,20,21,22,23], 12, true);
  this.sprite.frame=0;
  this.sprite.animations.play('lootcpspin');
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

function Potion(x,y)
{
  this.sprite = game.add.sprite(x*tileWidth+tileWidth/2,y*tileHeight+tileHeight/2,'potions');
  this.sprite.anchor.setTo(0.5,0.5);
  this.target = {x:x,y:y};
  this.sprite.frame=Math.floor(Math.random()*60);
}

Potion.prototype.kill = function()
{
    this.sprite.destroy();
    this.target = {x:-1,y:-1};
}

Potion.prototype.pickedUp = function(player)
{
    player.hitPoints += 10;
    if (player.hitPoints > player.maxHitPoints)
      player.hitPoints = player.maxHitPoints;
    player.updateHitBar();
    this.kill();
}