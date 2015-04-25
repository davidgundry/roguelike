function World(state)
{
    this.state = state;
    this.worldAreas = [];
    this.player = null;
}

World.prototype.create = function(player)
{
    this.player = player;
    if (this.player == null)
      console.log("Cannot create world with null player.");
    else
    {
      this.worldAreas[0] = new WorldArea(this);
    }
}

World.prototype.start = function()
{
    this.getArea().create(this.player);
    this.worldAreas[0].switchLevel(1); // This line starts the player in a dungeon.
    this.getArea().getLevel().placePlayerRandomly();
}

World.prototype.getArea = function()
{
    return this.worldAreas[0];
}

World.prototype.getLevel = function()
{
    return this.getArea().getLevel();
}

World.prototype.changedLevel = function()
{
    this.state.currentLevel = this.getLevel();
    AiTurnCount = 0;
}