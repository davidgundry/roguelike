function GUI(game)
{
	this.game = game;
	this.textstyle = { font: "12px Mono", fill: "#ff0044", align: "left" };
	this.textstyleSmall = { font: "10px Mono", fill: "#ff0044", align: "left" };
	this.bonusTextStyle = { font: "14px Mono", fill: "#00ff00", align: "left" };
	this.equipNameStyle = { font: "10px Mono", fill: "#00aaaa", align: "left" };
	this.dialogStyle = { font: "12px Mono", fill: "#aaaaaa", align: "left" };
	this.dialog = false;
	
	//game.add.text(10,10,"FPS: "+game.time.fps,style);
}

GUI.prototype.update = function()
{
      var bmd = game.add.bitmapData(160, 360);
      bmd.ctx.beginPath();
      bmd.ctx.rect(0, 0, 160, 360);
      bmd.ctx.fillStyle = '#111111';
      bmd.ctx.fill();
  
      var xpText = this.game.add.text(650, 250,"Level " + this.game.player.level + " " + this.game.player.class.name + " ("+this.game.player.xp+"xp)",this.textstyleSmall);
      var hpText = this.game.add.text(650, 270,"HP: " + this.game.player.hitPoints,this.textstyle);
      
      var mgtText = this.game.add.text(650, 300,"Mgt: " + this.game.player.mgt,this.textstyle);
      var endText = this.game.add.text(650, 320,"End: " + this.game.player.end,this.textstyle);
      var intText = this.game.add.text(650, 340,"Int: " + this.game.player.int,this.textstyle);
      var wisText = this.game.add.text(650, 360,"Wis: " + this.game.player.wis,this.textstyle);
      
      var attText = this.game.add.text(750, 300,"Att: " + this.game.player.att,this.textstyle);
      var defText = this.game.add.text(750, 320,"Def: " + this.game.player.def,this.textstyle);
      var skillText = this.game.add.text(750, 340,"Skl: " + this.game.player.skill,this.textstyle);
      var resText = this.game.add.text(750, 360,"Res: " + this.game.player.res,this.textstyle);
     
      bmd.draw(xpText,10,10);
      bmd.draw(hpText,10,30);
      
      bmd.draw(mgtText,10,60);
      bmd.draw(endText,10,80);
      bmd.draw(intText,10,100);
      bmd.draw(wisText,10,120);
      
      bmd.draw(attText,90,60);
      bmd.draw(defText,90,80);
      bmd.draw(skillText,90,100);
      bmd.draw(resText,90,120);
      
      xpText.destroy();
      hpText.destroy();
      
      mgtText.destroy();
      endText.destroy();
      intText.destroy();
      wisText.destroy();
      
      attText.destroy();
      defText.destroy();
      skillText.destroy();
      resText.destroy();
        
      var coinSprite = this.game.add.sprite(750,263,'loot');
      coinSprite.frame = 19;
      var coinsText = this.game.add.text(780, 270,"" + this.game.player.coins,this.textstyle);
      
      bmd.draw(coinSprite,80,21);
      bmd.draw(coinsText,110,30);
      
      coinSprite.destroy();
      coinsText.destroy();
   
      var weaponSprite = this.game.add.sprite(650,380,'equipment');
      weaponSprite.frame = this.game.player.weapon.img;
      var weaponNameText = this.game.add.text(683, 382,this.game.player.weapon.name,this.equipNameStyle);
      weaponNameText.wordWrapWidth = 80;
      weaponNameText.wordWrap  =true;
      var weaponText = this.game.add.text(690, 395,"+" + this.game.player.weaponBonus,this.bonusTextStyle);
      
      bmd.draw(weaponSprite,5,140);
      bmd.draw(weaponNameText,50,142);
      bmd.draw(weaponText,25,155);
      
      weaponSprite.destroy();
      weaponNameText.destroy();
      weaponText.destroy();
      
      var armourSprite = this.game.add.sprite(750,380,'equipment');
      armourSprite.frame = this.game.player.armour.img;
      var armourNameText = this.game.add.text(783, 382,this.game.player.armour.name,this.equipNameStyle);
      armourNameText.wordWrapWidth = 80;
      armourNameText.wordWrap  =true;
      var armourText = this.game.add.text(790, 395,"+" + this.game.player.armourBonus,this.bonusTextStyle);
      
      bmd.draw(armourSprite,5,180);
      bmd.draw(armourNameText,50,182);
      bmd.draw(armourText,25,195);
      
      armourSprite.destroy();
      armourNameText.destroy();
      armourText.destroy();
      
      var hatSprite = this.game.add.sprite(650,420,'equipment');
      hatSprite.frame = this.game.player.hat.img;
      var hatNameText = this.game.add.text(683, 422,this.game.player.hat.name,this.equipNameStyle);
      hatNameText.wordWrapWidth = 80;
      hatNameText.wordWrap  =true;
      var hatText = this.game.add.text(690, 435,"+" + this.game.player.hatBonus,this.bonusTextStyle);
      
      bmd.draw(hatSprite,5,220);
      bmd.draw(hatNameText,50,222);
      bmd.draw(hatText,25,235);
      
      hatSprite.destroy();
      hatNameText.destroy();
      hatText.destroy();
      
      var amuletSprite = this.game.add.sprite(750,420,'equipment');
      amuletSprite.frame = this.game.player.amulet.img;
      var amuletNameText = this.game.add.text(783, 422,this.game.player.amulet.name,this.equipNameStyle);
      amuletNameText.wordWrapWidth = 80;
      amuletNameText.wordWrap  =true;
      var amuletText = this.game.add.text(790, 435,"+" + this.game.player.amuletBonus,this.bonusTextStyle);
      
      bmd.draw(amuletSprite,5,260);
      bmd.draw(amuletNameText,50,262);
      bmd.draw(amuletText,25,275);
      
      amuletSprite.destroy();
      amuletNameText.destroy();
      amuletText.destroy();
      
      var logText = this.game.add.text(650,500,log.getLast(),this.textstyle);
      logText.wordWrapWidth = 160;
      logText.wordWrap = true;
      
      bmd.draw(logText,5,300);
      logText.destroy();
      
      if (this.guiBuffer == null)
      {
	  this.guiBuffer = game.add.sprite(640,240, bmd);
	  this.guiBuffer.anchor.setTo(0,0);
      }
      else
      {
	  this.guiBuffer.loadTexture(bmd);
      }
      
      /*this.logText.setText(log.getLast());*/
}

GUI.prototype.createDialog = function(text)
{
    var width = 200 // example;
    var height = 100 // example;
    var bmd = game.add.bitmapData(width, height);
    
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fillStyle = '#333333';
    bmd.ctx.fill();
    
    var mainText = this.game.add.text(320+5-width/2,320+5-height/2,text,this.dialogStyle);
    mainText.wordWrapWidth = width-10;
    mainText.wordWrap = true;
    var exitText = this.game.add.text(320+5-width/2,320-19+height/2,"Press [space] to close",this.dialogStyle);
    this.dialog = true;
    
    bmd.draw(mainText,5,5);
    bmd.draw(exitText,20,height-19);
    
    mainText.destroy();
    exitText.destroy();
    
    if (this.dialogBackground == null)
    {
      this.dialogBackground = game.add.sprite(320, 320, bmd);
      this.dialogBackground.anchor.setTo(0.5, 0.5);
    }
    else
    {
      this.dialogBackground.loadTexture(bmd);
    }
}

GUI.prototype.destroyDialog = function()
{
    this.dialogBackground.destroy();
    this.dialog = false;
}
