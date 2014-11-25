winW = window.innerWidth
winH = window.innerHeight

game = new Phaser.Game(32*3,32*3, Phaser.AUTO, "game")

# Add the 'mainState' to Phaser, and call it 'main'
game.state.add "play", playState
game.state.start "play"