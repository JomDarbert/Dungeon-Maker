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
    @dungeon     = @createDungeonArray(@gameW,@gameH)

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
      num: 5
      gid: 0

    wallObj =
      name: "ground"
      num: 5
      gid: 1

    toBuild.push groundObj
    toBuild.push wallObj

    @placeBlocks(toBuild)
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

  placeBlocks: (obj) ->
    layer = @map.create("dungeon", @gameW, @gameH, @tileSize, @tileSize)
    layer.resizeWorld()

    for o in obj
      start       = @randTile(@dungeon,layer)
      count       = 0
      blob        = []

      # Catch errors
      # WHAT ABOUT 'NO AREAS AVAILABLE THAT WILL FIT THAT SIZE'
      if @gameA < o.gid then throw new Error "Requested blob size bigger than game size"

      # Loop for size of blob, placing tiles where they will fit
      loop
        if not current? then current = @map.getTile(start.x,start.y,layer,true)
        last  = null
        availTiles = @getAvail(current)
        @map.putTile(o.gid,current.x,current.y,layer)

        # If some direction is available, pick a random one
        if availTiles.length > 0
          next = @randElem(availTiles)
          blob.push current
          last = current
          current = next
          count++

        # No current paths to travel - pick another spot to check in blob

        # PICK UIP HEREeee!!!
        else
          console.log "crap"
          fix = []
          for block in blob
            a = @getAvail(block)
            if a.length > 0 then fix.push block

          if fix.length > 0
            current = @randElem(fix)
            blob = fix
          else
            console.log "double crap"
            current = @randTile(@dungeon,layer)


        break unless count < o.num


  moveSprite: (ptr) ->
    sprite = @player
    speed = 300
    tween.stop() if tween and tween.isRunning
    duration = (game.physics.arcade.distanceToPointer(sprite, ptr) / speed) * 1000
    tween = game.add.tween(sprite).to( {x: ptr.x, y: ptr.y}, duration, Phaser.Easing.Linear.None, true)
    return