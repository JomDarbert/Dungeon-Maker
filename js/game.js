var game;

game = new Phaser.Game(300, 150, Phaser.AUTO, "game");

game.state.add("play", playState);

game.state.start("play");
