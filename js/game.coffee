winW = window.innerWidth
winH = window.innerHeight

game = new Phaser.Game(winW,winH, Phaser.AUTO, "game")

# Add the 'mainState' to Phaser, and call it 'main'
game.state.add "play", playState
game.state.start "play"