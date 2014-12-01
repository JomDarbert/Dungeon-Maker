playState =
  preload: ->
    game.load.image "player", "assets/star.png"
    game.load.image "ground", "assets/ground.png"
    game.load.image "wall", "assets/wall.png"
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

    w = game.width/32
    h = game.width/32
    a = w*h

    toBuild = []
    groundObj = 
      name: "ground"
      num: 50
      gid: 0

    wallObj =
      name: "ground"
      num: 50
      gid: 1

    dung = new window.Dungeon(20,20,32,@game,@map)

    toBuild.push groundObj
    toBuild.push wallObj

    dung.placeBlocks(toBuild)
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