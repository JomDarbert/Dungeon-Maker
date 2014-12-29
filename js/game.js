var game, h, tileSize, w;

tileSize = 32;

w = tileSize * 20;

h = tileSize * 20;

game = new Phaser.Game(w, h, Phaser.AUTO, "game");

game.state.add("play", playState);

game.state.start("play");
