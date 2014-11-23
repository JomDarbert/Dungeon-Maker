playState =
  preload: ->
    game.load.image "player", "assets/star.png"
    game.load.image("ground", "assets/ground.png")
    @map = game.add.tilemap()

  create: ->
    game.stage.backgroundColor = "#3498db"
    game.physics.startSystem Phaser.Physics.ARCADE

    @player = game.add.sprite(game.world.centerX, game.world.centerY, 'player')
    @player.anchor.setTo 0.5, 0.5

    game.physics.arcade.enable @player
    game.input.onDown.add @moveSprite, this

    @createWorld()
    return

  update: ->
    game.physics.arcade.collide(@player,@layer)
  
  createDungeonArray: (rows, cols) ->
    dungeon = new Array()
    for r in [0..rows]
      dungeon.push []
      for c in [0..cols]
        dungeon[r].push null
    return dungeon

  pickRandTile: (arr) ->
    if not arr or arr.length is 0 or arr[0].length is 0 then return false
    rows = arr.length
    cols = arr[0].length
    r = Math.floor(Math.random() * rows)
    c = Math.floor(Math.random() * cols)
    return [r,c]

  createWorld: ->
    @map.addTilesetImage "ground"
    @layer = @map.create("Tile Layer 1", 10, 10, 32, 32)
    rows = game.height/32
    cols = game.width/32

    dungeon = @createDungeonArray(rows,cols)
    pick = @pickRandTile(dungeon)

    @layer.resizeWorld()

  moveSprite: (ptr) ->
    sprite = @player
    speed = 300
    tween.stop() if tween and tween.isRunning
    duration = (game.physics.arcade.distanceToPointer(sprite, ptr) / speed) * 1000
    tween = game.add.tween(sprite).to( {x: ptr.x, y: ptr.y}, duration, Phaser.Easing.Linear.None, true)
    return