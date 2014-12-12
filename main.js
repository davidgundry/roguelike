var mainState = {
  
    preload: function()
    {
      //game.time.advancedTiming = true;
    },

    create: function()
    {
	this.world = new World(this);
	this.player = new Player();
	game.world.setBounds(0,0,20*tileWidth,20*tileHeight);

	game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP,Phaser.Keyboard.DOWN,Phaser.Keyboard.LEFT,Phaser.Keyboard.RIGHT]);
	this.cursor = game.input.keyboard.createCursorKeys();
	this.world.create(this.player);
	this.world.start();
	this.currentLevel = this.world.getLevel();
    },

    update: function()
    {
	
	if (loopCounter == 20)
	{
	  this.currentLevel.updateMinimapLayer();
	  loopCounter = 0;
	}
	else
	  loopCounter++;
	  
	if (!AiTurn)
	{
	    if ((!this.player.moveLock) && (!this.player.hasActed)  && (!this.player.animating))
		this.player.input(this.cursor,this.currentLevel);
	}
	else
	    this.runAiTurn();
    },

    runAiTurn: function()
    {    
      AiTurnCount++;
      if (AiTurnCount == this.currentLevel.monsters.length)
	AiTurnCount = 0;
      
      if (AiTurnCount < this.currentLevel.monsters.length)
      {
	if (this.currentLevel.monsters[AiTurnCount].alive)
	  if (!this.currentLevel.monsters[AiTurnCount].moveLock)
	      if (!this.currentLevel.monsters[AiTurnCount].hasActed)
		this.currentLevel.monsters[AiTurnCount].act(this.currentLevel);
	  
	  
	  if (AiTurnCount == 0)
	  {
	    var allDone = true;
	    for (var i=0;i<this.currentLevel.monsters.length;i++)
		if (this.currentLevel.monsters[i].alive)
		    if (!((this.currentLevel.monsters[i].hasActed)))// && (!this.currentLevel.monsters[i].moveLock))) 	//Non-blocking version
		    //if (!((this.currentLevel.monsters[i].hasActed) && (!this.currentLevel.monsters[i].moveLock))) 		//Blocking version
			allDone = false;
	      
	    if (allDone)
	    {
		for (var i=0;i<this.currentLevel.monsters.length;i++)
		{
		    if (this.currentLevel.monsters[i].alive)
		    {
			this.currentLevel.monsters[i].hasActed = false;
			this.currentLevel.monsters[i].moveLock = false;
		    }
		}
		AiTurn = false;
	    }
	  }
      }
    },

    render: function () {   
	/*/*if (AiTurn)
	    game.debug.text('AI Turn', 8, 12);
	else
	    game.debug.text('Player Turn', 8, 12);
	game.debug.text(this.player.coins, 120, 12);
	game.debug.text(log.getLast(),5,555);
	game.debug.text("FPS: "+game.time.fps,10,10);
	
	
	rendering text really slows down things
	*/
      
    }
};

function Log()
{
    this.log = [""];
}

Log.prototype.append = function(string)
{
    this.log.push(string);
}

Log.prototype.getLast = function()
{
    return this.log[this.log.length-1];
}

var tileWidth = 32, tileHeight = 32;
var screenDimensions = {height: tileHeight*20+47, width: tileWidth*20+240};
var game = new Phaser.Game(screenDimensions.width,screenDimensions.height, Phaser.AUTO, 'gameDiv');
var AiTurn = false;
var AiTurnCount = 0;
var log = new Log();

var timer = new Phaser.Timer(game,false);
var loopCounter = 0;

game.state.add('preload', preloadState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('main', mainState);
game.state.start('preload');