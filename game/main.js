var mainState = {
  
    preload: function()
    {
      //game.time.advancedTiming = true;
    },

    create: function()
    {
	this.world = new World(this);
	this.player = new Player();
	game.world.setBounds(0,0,20*tileWidth,20*tileHeight);

	game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP,Phaser.Keyboard.DOWN,Phaser.Keyboard.LEFT,Phaser.Keyboard.RIGHT,Phaser.Keyboard.ENTER,Phaser.Keyboard.SPACEBAR,Phaser.Keyboard.N]);
	this.keys = {spacebar: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),enter: game.input.keyboard.addKey(Phaser.Keyboard.ENTER)}
	this.cursor = game.input.keyboard.createCursorKeys();
	this.cursor.w = game.input.keyboard.addKey(Phaser.Keyboard.W);
	this.cursor.a = game.input.keyboard.addKey(Phaser.Keyboard.A);
	this.cursor.s = game.input.keyboard.addKey(Phaser.Keyboard.S);
	this.cursor.d = game.input.keyboard.addKey(Phaser.Keyboard.D);
	this.cursor.n = game.input.keyboard.addKey(Phaser.Keyboard.N);
	
	gui = new GUI(this);
	
	this.world.create(this.player);
	this.world.start();
	this.currentLevel = this.world.getLevel();
	log.append("Welcome to the game, " + this.player.name + " the " + this.player.class.name+".");
	//gui.createDialog("The Evil Empire of Takoth has stolen the Talisman of Doom. You must recover it to save the Kingdom!");
	gui.update();
    },

    update: function()
    {
	if (loopCounter == 20)
	{
	  this.currentLevel.updateMinimapLayer();
	  loopCounter = 0;
	}
	else
	  loopCounter++;
	  
	if (!AiTurn)
	{
	  if (gui.dialog)
	  {
	    if ((this.keys.spacebar.isDown) || (this.keys.enter.isDown))
	      gui.destroyDialog();
	  }
	  else
	  {
	    if ((!this.player.moveLock) && (!this.player.animating) && (!this.player.hasActed))
		this.player.input(this.cursor,this.world);
	  }
	}
	else
	    this.runAiTurn();
    },

    runAiTurn: function()
    {    
    //  AiTurnCount++;
     // if (AiTurnCount >= this.currentLevel.monsters.length)
	//AiTurnCount = 0;
      
      //if (AiTurnCount < this.currentLevel.monsters.length)
      //{
      for (var i=0;i<this.currentLevel.monsters.length;i++)
      {
	if (this.currentLevel.monsters[i].alive)
	  //if (!this.currentLevel.monsters[AiTurnCount].moveLock)
	      if (!this.currentLevel.monsters[i].hasActed)
		this.currentLevel.monsters[i].act(this.currentLevel);
      }
	  
	  //if (AiTurnCount == 0)
	 // {
	    var allDone = true;
	    for (var i=0;i<this.currentLevel.monsters.length;i++)
		if (this.currentLevel.monsters[i].alive)
		{
		    if (!((this.currentLevel.monsters[i].hasActed)))// && (!this.currentLevel.monsters[i].moveLock))) 	//Non-blocking version
		    //if (!((this.currentLevel.monsters[i].hasActed) && (!this.currentLevel.monsters[i].moveLock))) 		//Blocking version
			allDone = false;
		}
		else
		{
		    this.currentLevel.monsters.splice(i,1);
		}
	      
	    if (allDone)
	    {
		for (var i=0;i<this.currentLevel.monsters.length;i++)
		{
		    if (this.currentLevel.monsters[i].alive)
		    {
			this.currentLevel.monsters[i].hasActed = false;
			this.currentLevel.monsters[i].moveLock = false;
		    }
		}
		this.perTurn();
		AiTurn = false;
	    }
	  //}
      //}
      //else
      //{
	//AiTurn = false;
	this.perTurn();
      //}
    },
    
    perTurn: function () {
      // Player regens hits slowly
      this.player.healingTurns++;
      if (this.player.healingTurns >= this.player.maxHealingTurns)
      {
	this.player.heal(1);
	this.player.healingTurns = 0;
      }
    },

    render: function () {   
	/*/*if (AiTurn)
	    game.debug.text('AI Turn', 8, 12);
	else
	    game.debug.text('Player Turn', 8, 12);
	game.debug.text(this.player.coins, 120, 12);
	game.debug.text(log.getLast(),5,555);
	game.debug.text("FPS: "+game.time.fps,10,10);
	
	
	rendering text really slows down things
	*/
      
    }
};