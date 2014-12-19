playState =
  preload: ->
    game.load.image "player", "assets/star.png"
    game.load.image "ground", "assets/ground.png"
    game.load.image "wall", "assets/wall.png"
    game.load.image "water", "assets/water.png"
    game.load.image "lava", "assets/lava.png"
    @map = game.add.tilemap()

  create: ->
    game.stage.backgroundColor = "#3498db"
    ###
    game.physics.startSystem Phaser.Physics.ARCADE

    @player = game.add.sprite(game.world.centerX, game.world.centerY, 'player')
    @player.anchor.setTo 0.5, 0.5

    game.physics.arcade.enable @player
    game.input.onDown.add @moveSprite, this
    ###
    @map.addTilesetImage("ground","ground",32,32,null,null,0)
    @map.addTilesetImage("wall","wall",32,32,null,null,1)
    @map.addTilesetImage("water","water",32,32,null,null,2)
    @map.addTilesetImage("lava","lava",32,32,null,null,3)

    t = 32
    w = game.width/t
    h = game.height/t
    a = w*h

    ground = 
      name: "ground"
      size: 15
      gid: 0
      maxRadius: 2
      fillHoles: true

    wall =
      name: "ground"
      size: 13
      gid: 1
      maxRadius: 2
      fillHoles: true

    water =
      name: "water"
      size: 13
      gid: 2
      maxRadius: 2
      fillHoles: true

    lava =
      name: "lava"
      size: 13
      gid: 3
      maxRadius: 2
      fillHoles: true

    nodes = [ground,wall,water,lava]

    options = 
      width: w
      height: h
      tileSize: t
      map: @map
      nodes: nodes

    dung = new window.Dungeon(options)
    dung.build()

    return

  update: ->
    #game.physics.arcade.collide(@player,@layer)

  moveSprite: (ptr) ->
    sprite = @player
    speed = 300
    tween.stop() if tween and tween.isRunning
    duration = (game.physics.arcade.distanceToPointer(sprite, ptr) / speed) * 1000
    tween = game.add.tween(sprite).to( {x: ptr.x, y: ptr.y}, duration, Phaser.Easing.Linear.None, true)
    return