class window.Selection
  constructor: ->

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
    game.input.onDown.add @select, this

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
    @selection = tiles: [], sprites: game.add.group()
    return

  update: ->
    ###
    grp = @dung.nodes[0].group
    if @overlap(@player,grp) and @player.activeTween?
      #console.log @player
      @player.activeTween.stop()
      @player.activeTween = null
    ###

  select: (ptr) ->
    #doesn't need to be sprite, just tiles?
    # maybe createFromTiles?
    tile = @map.getTileWorldXY(ptr.x,ptr.y,tileSize,tileSize,@layer)
    if tile? and tile in @selection.tiles
      @selection.tiles = @selection.tiles.filter (t) -> t isnt tile

    else if tile?
      @selection.tiles.push tile
      sprite = @selection.sprites.create(tile.x*tileSize,tile.y*tileSize,'ground')
      sprite.inputEnabled = true
      sprite.events.onInputOver.add(@deselect, this)
    return null

  deselect: (sprite, ptr) ->
    if ptr.isDown then sprite.kill()