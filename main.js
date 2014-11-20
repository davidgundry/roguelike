var mainState = {
  
    preload: function()
    {

    },

    create: function()
    {
	this.world = new World();
	this.player = new Player();
	this.world.player = this.player;
	this.world.createEnemies();
	game.world.setBounds(0,0,this.world.mapSize*tileWidth,this.world.mapSize*tileHeight);

	game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP,Phaser.Keyboard.DOWN,Phaser.Keyboard.LEFT,Phaser.Keyboard.RIGHT]);
	this.cursor = game.input.keyboard.createCursorKeys();
    },

    update: function()
    {
	for (var i=0;i<this.world.numEnemies;i++)
	    if (this.world.enemies[i].alive)
		this.world.enemies[i].move();
	  
	if (!AiTurn)
	{
	    this.player.move();
	    if ((!this.player.moveLock) && (!this.player.hasActed))
		this.player.input(this.cursor,this.world);
	}
	else
	    this.runAiTurn();
    },

    runAiTurn: function()
    {    
	for (var i=0;i<this.world.numEnemies;i++)
	{
	    if (this.world.enemies[i].alive)
	      if (!this.world.enemies[i].moveLock)
		  if (!this.world.enemies[i].hasActed)
		      this.world.enemies[i].act(this.world);
	}
	
	var allDone = true;
	for (var i=0;i<this.world.numEnemies;i++)
	    if (this.world.enemies[i].alive)
		if (!((this.world.enemies[i].hasActed)))// && (!this.world.enemies[i].moveLock))) 	//Non-blocking version
		//if (!((this.world.enemies[i].hasActed) && (!this.world.enemies[i].moveLock))) 		//Blocking version
		    allDone = false;
	  
	if (allDone)
	{
	    for (var i=0;i<this.world.numEnemies;i++)
	    {
		if (this.world.enemies[i].alive)
		{
		    this.world.enemies[i].hasActed = false;
		    this.world.enemies[i].moveLock = false;
		}
	    }
	    AiTurn = false;
	}
    },

    render: function () {   
	if (AiTurn)
	    game.debug.text('AI Turn', 8, 12);
	else
	    game.debug.text('Player Turn', 8, 12);
	game.debug.text(this.player.coins, 120, 12);
      
    }
};

var tileWidth = 32, tileHeight = 32;
var screenDimensions = {height: 352, width: 416};
var game = new Phaser.Game(screenDimensions.width,screenDimensions.height, Phaser.AUTO, 'gameDiv');
var AiTurn = false;

var timer = new Phaser.Timer(game,false);

game.state.add('preload', preloadState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('main', mainState);
game.state.start('preload');