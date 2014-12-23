var game, h, t, w;

t = 32;

w = t * 20;

h = t * 20;

game = new Phaser.Game(w, h, Phaser.AUTO, "game");

game.state.add("play", playState);

game.state.start("play");
