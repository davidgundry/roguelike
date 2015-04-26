var preloadState = {
  
  preload: function()
  {
    game.load.image('progressBar','assets/loading.png');
  },
  
  create: function()
  {
    game.state.start('load');
  }
}
