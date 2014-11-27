###
Need a fix for spidering resources
###

playState =
  preload: ->
    game.load.image "player", "assets/star.png"
    game.load.image "ground", "assets/ground.png"
    game.load.image "wall", "assets/wall.png"
    @map = game.add.tilemap()
    @tileSize    = 32
    @gameW       = Math.floor(game.width/@tileSize)
    @gameH       = Math.floor(game.height/@tileSize)
    @gameA       = @gameW*@gameH

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

    toBuild = []
    groundObj = 
      name: "ground"
      num: 30
      gid: 0

    wallObj =
      name: "ground"
      num: 30
      gid: 1

    toBuild.push groundObj
    toBuild.push wallObj

    @placeBlocks(toBuild)
    return

  update: ->
    #game.physics.arcade.collide(@player,@layer)

  randOpenTile: (layer) ->
    open = layer.layer.data.filter (y) -> return 1 for x in y when x.index is -1
    if open.length <= 0 then return false
    return @randElem(@randElem(open))

  randElem: (arr) -> return arr[Math.floor(Math.random()*arr.length)]

  getAvail: (tile) ->
    adj = 
      up: @map.getTileAbove(@map.getLayer(),tile.x,tile.y) 
      right: @map.getTileRight(@map.getLayer(),tile.x,tile.y) 
      down: @map.getTileBelow(@map.getLayer(),tile.x,tile.y) 
      left: @map.getTileLeft(@map.getLayer(),tile.x,tile.y)
    available = []
    for dir,tile of adj when tile isnt null and tile.index is -1
      available.push {tile: tile, dir: dir}
    return available

  placeBlocks: (node) ->
    layer = @map.create("dungeon", @gameW, @gameH, @tileSize, @tileSize)
    layer.resizeWorld()

    for o in node
      count = 0
      log = []

      # Catch errors
      if @gameA < o.gid then throw new Error "Requested node size bigger than game size"

      # Loop for size of node, placing tiles where they will fit
      loop
        if not current? then current = {tile: @randOpenTile(layer), dir: null}
        @map.putTile(o.gid,current.tile.x,current.tile.y,layer)

        # If some direction is available, pick a random one
        available = @getAvail(current.tile)
        if available.length > 0
          log.push current
          current = @randElem(available)
          count++

        # Otherwise no current paths are available to travel, so pick another spot to check in log
        else
          log = log.filter (b) -> if playState.getAvail(b.tile).length > 0 then return 1
          if log.length > 0 then current = @randElem(log)
          else current = {tile: @randOpenTile(layer), dir: null}
        break if count >= o.num or current is false

  moveSprite: (ptr) ->
    sprite = @player
    speed = 300
    tween.stop() if tween and tween.isRunning
    duration = (game.physics.arcade.distanceToPointer(sprite, ptr) / speed) * 1000
    tween = game.add.tween(sprite).to( {x: ptr.x, y: ptr.y}, duration, Phaser.Easing.Linear.None, true)
    return