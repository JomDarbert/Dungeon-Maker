mainState =
  preload: ->
    
    # Load the image
    game.load.image "logo", "phaser-logo-small.png"
    return

  create: ->
    
    # Display the image on the screen
    @sprite = game.add.sprite(200, 150, "logo")
    return

  update: ->
    
    # Increment the angle of the sprite by 1, 60 times per seconds
    @sprite.angle += 1
    return

game = new Phaser.Game(400, 300, Phaser.AUTO, "gameDiv")
game.state.add "main", mainState
game.state.start "main"