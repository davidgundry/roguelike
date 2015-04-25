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
	game.load.spritesheet('objects', 'assets/objects.png',32,32);
	game.load.spritesheet('equipment', 'assets/equipment.png',32,32);
	game.load.image('tileset', 'assets/tileset.png');
	game.load.image('minitileset', 'assets/minitileset.png');
	
	
	game.load.audio('hurt','assets/hurt.wav');
	game.load.audio('attack','assets/attack.wav');
	game.load.audio('SND_COIN','assets/coin.wav');
	game.load.audio('SND_LEVL','assets/levl.wav');
	
	game.load.audio('SND_LEVR','assets/levr.wav');
	game.load.audio('SND_GATE','assets/gate.wav');
	game.load.audio('SND_LOCK','assets/lock.wav');
	game.load.audio('SND_OLCK','assets/olck.wav');
	game.load.audio('SND_TPFL','assets/tpfl.wav');
	game.load.audio('SND_TRAP','assets/trap.wav');
	game.load.audio('SND_GULP','assets/gulp.wav');
	game.load.audio('SND_TELE','assets/tele.wav');	
	game.load.audio('SND_PPLT','assets/pplt.wav');
	game.load.audio('SND_APPL','assets/appl.wav');
    },
    
    create: function()
    {
	game.state.start('main');
    }
}