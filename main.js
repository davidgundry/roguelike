var mainState = {
  
    preload: function()
    {

    },

    create: function()
    {
	this.world = new World();
	this.player = new Player();
	game.world.setBounds(0,0,20*tileWidth,20*tileHeight);

	game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP,Phaser.Keyboard.DOWN,Phaser.Keyboard.LEFT,Phaser.Keyboard.RIGHT]);
	this.cursor = game.input.keyboard.createCursorKeys();
	this.world.create(this.player);
	this.world.start();
    },

    update: function()
    {
	var currentLevel = this.world.getLevel();
	if (loopCounter == 20)
	{
	  currentLevel.updateMinimapLayer();
	  loopCounter = 0;
	}
	else
	  loopCounter++;
	for (var i=0;i<currentLevel.monsters.length;i++)
	    if (currentLevel.monsters[i].alive)
		currentLevel.monsters[i].move();
	  
	if (!AiTurn)
	{
	    this.player.move();
	    if ((!this.player.moveLock) && (!this.player.hasActed)  && (!this.player.animating))
		this.player.input(this.cursor,currentLevel);
	}
	else
	    this.runAiTurn(currentLevel);
    },

    runAiTurn: function(currentLevel)
    {    
	for (var i=0;i<currentLevel.monsters.length;i++)
	{
	    if (currentLevel.monsters[i].alive)
	      if (!currentLevel.monsters[i].moveLock)
		  if (!currentLevel.monsters[i].hasActed)
		      currentLevel.monsters[i].act(currentLevel);
	}
	
	var allDone = true;
	for (var i=0;i<currentLevel.monsters.length;i++)
	    if (currentLevel.monsters[i].alive)
		if (!((currentLevel.monsters[i].hasActed)))// && (!currentLevel.monsters[i].moveLock))) 	//Non-blocking version
		//if (!((currentLevel.monsters[i].hasActed) && (!currentLevel.monsters[i].moveLock))) 		//Blocking version
		    allDone = false;
	  
	if (allDone)
	{
	    for (var i=0;i<currentLevel.monsters.length;i++)
	    {
		if (currentLevel.monsters[i].alive)
		{
		    currentLevel.monsters[i].hasActed = false;
		    currentLevel.monsters[i].moveLock = false;
		}
	    }
	    AiTurn = false;
	}
    },

    render: function () {   
	/*if (AiTurn)
	    game.debug.text('AI Turn', 8, 12);
	else
	    game.debug.text('Player Turn', 8, 12);*/
	game.debug.text(this.player.coins, 120, 12);
	game.debug.text(log.getLast(),5,555);
      
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
var log = new Log();

var timer = new Phaser.Timer(game,false);
var loopCounter = 0;

game.state.add('preload', preloadState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('main', mainState);
game.state.start('preload');