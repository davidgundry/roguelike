var mainState = {
  
    preload: function()
    {

    },

    create: function()
    {
	this.world = new World();
	this.player = new Player();
	this.world.player = this.player;
	game.world.setBounds(0,0,this.world.mapSize*tileWidth,this.world.mapSize*tileHeight);

	game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP,Phaser.Keyboard.DOWN,Phaser.Keyboard.LEFT,Phaser.Keyboard.RIGHT]);
	this.cursor = game.input.keyboard.createCursorKeys();
    },

    update: function()
    {
	if (loopCounter == 10)
	{
	  this.world.updateMinimapLayer();
	  loopCounter = 0;
	}
	else
	  loopCounter++;
	for (var i=0;i<this.world.monsters.length;i++)
	    if (this.world.monsters[i].alive)
		this.world.monsters[i].move();
	  
	if (!AiTurn)
	{
	    this.player.move();
	    if ((!this.player.moveLock) && (!this.player.hasActed)  && (!this.player.animating))
		this.player.input(this.cursor,this.world);
	}
	else
	    this.runAiTurn();
    },

    runAiTurn: function()
    {    
	for (var i=0;i<this.world.monsters.length;i++)
	{
	    if (this.world.monsters[i].alive)
	      if (!this.world.monsters[i].moveLock)
		  if (!this.world.monsters[i].hasActed)
		      this.world.monsters[i].act(this.world);
	}
	
	var allDone = true;
	for (var i=0;i<this.world.monsters.length;i++)
	    if (this.world.monsters[i].alive)
		if (!((this.world.monsters[i].hasActed)))// && (!this.world.monsters[i].moveLock))) 	//Non-blocking version
		//if (!((this.world.monsters[i].hasActed) && (!this.world.monsters[i].moveLock))) 		//Blocking version
		    allDone = false;
	  
	if (allDone)
	{
	    for (var i=0;i<this.world.monsters.length;i++)
	    {
		if (this.world.monsters[i].alive)
		{
		    this.world.monsters[i].hasActed = false;
		    this.world.monsters[i].moveLock = false;
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