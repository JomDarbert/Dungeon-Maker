playState =
  preload: ->
    game.load.image "player", "assets/star.png"
    game.load.image "ground", "assets/ground.png"
    game.load.image "wall", "assets/wall.png"
    game.load.image "water", "assets/water.png"
    game.load.image "lava", "assets/lava.png"
    @map = game.add.tilemap()
    game.stage.backgroundColor = "#2d2d2d"


  create: ->

    # CREATE DUNGEON TILES
    @map.addTilesetImage("ground","ground",32,32,null,null,0)
    @map.addTilesetImage("wall","wall",32,32,null,null,1)
    @map.addTilesetImage("water","water",32,32,null,null,2)
    @map.addTilesetImage("lava","lava",32,32,null,null,3)

    w = game.width/tileSize
    h = game.height/tileSize
    a = w*h

    ground = name: "ground", size: 15, gid: 0, maxRadius: 2, fillHoles: true
    wall   = name: "wall",   size: 13, gid: 1, maxRadius: 2, fillHoles: true
    water  = name: "water",  size: 13, gid: 2, maxRadius: 2, fillHoles: true
    lava   = name: "lava",   size: 13, gid: 3, maxRadius: 2, fillHoles: true
    nodes  = [ground,wall,water,lava]

    options = width: w, height: h, tileSize: tileSize, map: @map, nodes: nodes
    @dung = new window.Dungeon(options)
    @dung.build()

    # CREATE SELECTION HOLDER
    @selection = []
    return

  update: ->
    ptr = game.input.mousePointer
    esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC)

    if esc.isDown
      @map.putTile(tile.index,tile.x,tile.y) for tile in @selection
      @selection = []

    if ptr.isDown

      @map.putTile(0,ptr.x,ptr.y)
      #why isn't putTile rendering?
      
      ###
      tile = @map.getTileWorldXY(ptr.x,ptr.y,tileSize,tileSize,@layer)
      if tile? and tile not in @selection
        @selection.push tile
        new_tile = tile
        new_tile.index = 0
        @map.putTile(new_tile,tile.x,tile.y)
        console.log @selection
      if tile? and tile in @selection
        return
        #unselect
      ###