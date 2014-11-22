var game, mainState;

mainState = {
  preload: function() {
    return game.load.image("player", "assets/star.png");
  },
  create: function() {
    game.stage.backgroundColor = "#3498db";
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    this.player.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(this.player);
    return this.cursor = game.input.keyboard.createCursorKeys();
  },
  update: function() {
    return this.movePlayer();
  },
  movePlayer: function() {
    if (game.input.mousePointer.isDown) {
      return game.physics.arcade.moveToPointer(this.player, 400);
    }
  }
};

game = new Phaser.Game(500, 340, Phaser.AUTO, "gameDiv");

game.state.add("main", mainState);

game.state.start("main");
