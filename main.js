var mainState = {
  
  preload: function()
  {

  },
  
  create: function()
  {
      this.world = new World();
      this.player = new Player();
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.world.setBounds(0,0,640,640);

      game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP,Phaser.Keyboard.DOWN,Phaser.Keyboard.LEFT,Phaser.Keyboard.RIGHT]);
      this.cursor = game.input.keyboard.createCursorKeys();
  },
  
  update: function()
  {
      //game.physics.arcade.collide(this.player.sprite, this.layer);
      


      if (!AiTurn)
      {
	this.player.move();
	if (!this.player.moveLock)
	  this.player.input(this.cursor,this.world);
      }
      else
      {
	
	for (var i=0;i<this.world.enemies.length;i++)
	{
	  this.world.enemies[i].move();
	  if (!this.world.enemies[i].moveLock)
	    if (!this.world.enemies[i].hasActed)
	      this.world.enemies[i].act(this.world);
	}
	
	var allDone = true;
	for (var i=0;i<this.world.enemies.length;i++)
	  if (!((this.world.enemies[i].hasActed) && (!this.world.enemies[i].moveLock)))
	    allDone = false;
	  
	if (allDone)
	{
	  for (var i=0;i<this.world.enemies.length;i++)
	  {
	    this.world.enemies[i].hasActed = false;
	    this.world.enemies[i].moveLock = false;
	  }
	  AiTurn = false;
	}
      }
  },
  
  render: function () {
    game.debug.text('x:' + this.player.target.x + 'y:' + this.player.target.y, 32, 32);
    
    if (AiTurn)
      game.debug.text('AI Turn', 32, 50);
    else
      game.debug.text('Player Turn', 32, 50);
    
  }

};

var screenDimensions = {height: 300, width: 400};
var game = new Phaser.Game(screenDimensions.width,screenDimensions.height, Phaser.AUTO, 'gameDiv');
var tileWidth = 32, tileHeight = 32;
var AiTurn = false;

var timer = new Phaser.Timer(game,false);

game.state.add('preload', preloadState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('main', mainState);
game.state.start('preload');