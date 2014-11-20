var loadState = {
  
    preload: function()
    {
	game.stage.backgroundColor = "#000000";
	    
	var loadingLabel = game.add.text(game.world.centerX, game.world.centerY, 'Loading...', { font: '30px Arial', fill: '#ffffff'});
	loadingLabel.anchor.setTo(0.5,0.5);
	
	var progressBar = game.add.sprite(game.world.centerX,game.world.centerY + 40, 'progressBar');
	progressBar.anchor.setTo(0.5, 0.5);
	game.load.setPreloadSprite(progressBar);
	  
	game.load.spritesheet('characters', 'assets/characters.png',32,32);
	game.load.spritesheet('loot', 'assets/loot.png',32,32);
	game.load.spritesheet('potions', 'assets/potions.png',25,25);
	game.load.image('tileset', 'assets/tileset.png');
	
	game.load.audio('coin','assets/coin.wav');
	game.load.audio('hurt','assets/hurt.wav');
	game.load.audio('attack','assets/attack.wav');
	game.load.audio('potion','assets/potion.wav');
    },
    
    create: function()
    {
	game.state.start('main');
    }
}