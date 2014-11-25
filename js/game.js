var game, winH, winW;

winW = window.innerWidth;

winH = window.innerHeight;

game = new Phaser.Game(32 * 5, 32 * 5, Phaser.AUTO, "game");

game.state.add("play", playState);

game.state.start("play");
