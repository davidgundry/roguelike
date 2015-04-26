
var tileWidth = 32, tileHeight = 32;
var screenDimensions = {height: tileHeight*20+47, width: tileWidth*20+240};
var game = new Phaser.Game(screenDimensions.width,screenDimensions.height, Phaser.AUTO, 'gameDiv');
var AiTurn = false;
var AiTurnCount = 0;
var log = new Log();
var gui = null;

var timer = new Phaser.Timer(game,false);
var loopCounter = 0;


game.state.add('preload', preloadState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('main', mainState);
game.state.start('preload');