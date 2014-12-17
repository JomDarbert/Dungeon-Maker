var game, h, t, w;

t = 32;

w = t * 8;

h = t * 8;

game = new Phaser.Game(w, h, Phaser.AUTO, "game");

game.state.add("play", playState);

game.state.start("play");
