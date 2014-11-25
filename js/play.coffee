playState =
  preload: ->
    game.load.image "player", "assets/star.png"
    game.load.image("ground", "assets/ground.png")
    @map = game.add.tilemap()
    @tileSize    = 32
    @gameW       = Math.floor(game.width/@tileSize)
    @gameH       = Math.floor(game.height/@tileSize)
    @gameA       = @gameW*@gameH
    @dungeon     = @createDungeonArray(@gameW,@gameH)

  create: ->
    game.stage.backgroundColor = "#3498db"
    game.physics.startSystem Phaser.Physics.ARCADE

    @player = game.add.sprite(game.world.centerX, game.world.centerY, 'player')
    @player.anchor.setTo 0.5, 0.5

    game.physics.arcade.enable @player
    game.input.onDown.add @moveSprite, this

    @map.addTilesetImage "ground" # Replace with function's type

    @placeBlocks(5,"test1")
    @placeBlocks(5,"test1")
    return

  update: ->
    #game.physics.arcade.collide(@player,@layer)
  
  createDungeonArray: (cols, rows) ->
    dungeon = new Array()
    for r in [0..rows-1]
      dungeon.push []
      for c in [0..cols-1]
        dungeon[r].push null
    return dungeon

  randTile: (arr,layer) ->
    if not arr? or arr.length is 0 or arr[0].length is 0
      throw new Error("Dungeon array is not properly defined")

    loop
      rows = arr.length
      cols = arr[0].length
      y = Math.floor(Math.random() * rows)
      x = Math.floor(Math.random() * cols)
      tile = @map.getTile(x,y,@layer,true)
      break unless tile.index isnt -1
    return tile

  randElem: (arr) ->
    return arr[Math.floor(Math.random()*arr.length)]

  getAvail: (tile) ->
    index     = @map.getLayer()
    up        = @map.getTileAbove(index,tile.x,tile.y)
    right     = @map.getTileRight(index,tile.x,tile.y)
    down      = @map.getTileBelow(index,tile.x,tile.y)
    left      = @map.getTileLeft(index,tile.x,tile.y)
    adj       = up: up, right: right, down: down, left: left
    avail     = []
    maxW      = game.width/@tileSize - 1
    maxH      = game.height/@tileSize - 1 
    for dir,val of adj when val isnt null and val.index is -1
      avail.push val
    return avail

  placeBlocks: (size,name) ->
    layer = @map.create("test", @gameW, @gameH, @tileSize, @tileSize)
    layer.resizeWorld()

    start       = @randTile(@dungeon,layer)
    count       = 0
    blob        = []

    # Place first tile in a random unallocated spot
    @map.putTile(0,start.x,start.y,layer)

    # Catch errors
    # WHAT ABOUT 'NO AREAS AVAILABLE THAT WILL FIT THAT SIZE'
    if @gameA < size then throw new Error "Requested blob size bigger than game size"

    # Loop for size of blob, placing tiles where they will fit
    loop
      if not current? then current = @map.getTile(start.x,start.y,layer,true)
      last  = null
      type  = 0 # temporary variable - replace with function's type
      avail = @getAvail(current)
      @map.putTile(type,current.x,current.y,layer)

      # If some direction is available, pick a random one
      if avail.length > 0 then next = @randElem(avail)

      # No current paths to travel - pick another spot to check in blob
      else
        throw new Error("Won't fit!")
        ###
        for block in blob
          a = @getAvail(block)
          console.log a.length
          console.log a.index
        ###

      blob.push current
      last = current
      current = next
      break unless ++count < size


  moveSprite: (ptr) ->
    sprite = @player
    speed = 300
    tween.stop() if tween and tween.isRunning
    duration = (game.physics.arcade.distanceToPointer(sprite, ptr) / speed) * 1000
    tween = game.add.tween(sprite).to( {x: ptr.x, y: ptr.y}, duration, Phaser.Easing.Linear.None, true)
    return