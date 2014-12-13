game = new Phaser.Game(300,150, Phaser.AUTO, "game")

# Add the 'mainState' to Phaser, and call it 'main'
game.state.add "play", playState
game.state.start "play"