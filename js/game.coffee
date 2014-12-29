tileSize = 32
w = tileSize*20
h = tileSize*20

game = new Phaser.Game(w,h, Phaser.AUTO, "game")

# Add the 'mainState' to Phaser, and call it 'main'
game.state.add "play", playState
game.state.start "play"