var game, winH, winW;

winW = window.innerWidth;

winH = window.innerHeight;

game = new Phaser.Game(32 * 3, 32 * 3, Phaser.AUTO, "game");

game.state.add("play", playState);

game.state.start("play");
