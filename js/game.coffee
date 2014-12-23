t = 32
w = t*20
h = t*20

game = new Phaser.Game(w,h, Phaser.AUTO, "game")

# Add the 'mainState' to Phaser, and call it 'main'
game.state.add "play", playState
game.state.start "play"