t = 32
w = t*10
h = t*10

game = new Phaser.Game(w,h, Phaser.AUTO, "game")

# Add the 'mainState' to Phaser, and call it 'main'
game.state.add "play", playState
game.state.start "play"