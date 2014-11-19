var mainState = {
  
  preload: function()
  {

  },
  
  create: function()
  {
      this.world = new World();
      this.player = new Player();
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.world.setBounds(0,0,1000,1000);

      game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP,Phaser.Keyboard.DOWN,Phaser.Keyboard.LEFT,Phaser.Keyboard.RIGHT]);
      this.cursor = game.input.keyboard.createCursorKeys();
  },
  
  update: function()
  {
      //game.physics.arcade.collide(this.player.sprite, this.layer);
      
      if (!this.player.moveLock)
	this.player.input(this.cursor,this.world);
      
      this.player.move();
      //this.manageEnemies();
  },

  manageEnemies: function()
  {
    this.bitmap.context.clearRect(0, 0, this.game.width, this.game.height);
    
    this.world.monsters.forEach(function(enemy)
    {
      enemy.behaviour.act(enemy,this.player,this.world);
    }, this);
  },
};

var screenDimensions = {height: 400, width: 400};
var game = new Phaser.Game(screenDimensions.width,screenDimensions.height, Phaser.AUTO, 'gameDiv');

var timer = new Phaser.Timer(game,false);

game.state.add('preload', preloadState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('main', mainState);
game.state.start('preload');