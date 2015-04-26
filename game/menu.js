var menuState = {
  
  preload: function()
  {
      game.stage.backgroundColor = "#1466bb";  
  },
  
  create: function()
  {
      var loadingLabel = game.add.text(game.world.centerX, game.world.centerY, 'Light Adventure', { font: '30px Arial', fill: '#ffffff'});
      loadingLabel.anchor.setTo(0.5,0.5);
      game.add.button(screenDimensions.width*(1/3),screenDimensions.height*(1/3),'startGame',this.startGame,this);
      game.add.button(screenDimensions.width*(2/3),screenDimensions.height*(1/3),'resumeGame',this.resumeGame,this);      
  },
  
  startGame: function()
  {
    game.state.start('main');
  },
  
  resumeGame: function()
  {
    game.state.start('main');
  }
  
}