var game, winH, winW;

winW = window.innerWidth;

winH = window.innerHeight;

game = new Phaser.Game(winW, winH, Phaser.AUTO, "game");

game.state.add("play", playState);

game.state.start("play");
