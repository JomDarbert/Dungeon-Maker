winW = window.innerWidth
winH = window.innerHeight

game = new Phaser.Game(32*5,32*5, Phaser.AUTO, "game")

# Add the 'mainState' to Phaser, and call it 'main'
game.state.add "play", playState
game.state.start "play"