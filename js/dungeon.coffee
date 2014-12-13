###
Need a fix for spidering resources
Clear dungeon
Button for testing
resize game?
camera follow mouse?

Create nodes for each resource type
Node - own class
  max distance from center it is allowed to spider out to
  Minimum distance between nodes
  Fill empty space with different types of rock

###
class window.Node
  constructor: (options) ->
    throw new Error "No dungeon provided to Node constructor" unless options.dungeon?
    @dungeon     = options.dungeon
    @name        = options.name or undefined
    @gid         = options.gid or 0
    @maxDist     = options.maxDist or 20
    @size        = options.size or 20
    @layer       = @dungeon.layer
    @map         = @dungeon.map
    @index       = @map.getLayer()
    @center      = @dungeon.randOpenTile(@layer)
    @cur         = @center

  distFromCenter: ->
    return Math.abs(@cur.x-@center.x) + Math.abs(@cur.y-@center.y)

  getAvailable: (tile) ->
    tile = @cur unless tile?
    adj = 
      up: @map.getTileAbove(@index,tile.x,tile.y) 
      right: @map.getTileRight(@index,tile.x,tile.y) 
      down: @map.getTileBelow(@index,tile.x,tile.y) 
      left: @map.getTileLeft(@index,tile.x,tile.y)
    available = []
    for dir,tile of adj when tile isnt null and tile.index is -1
      available.push {tile: tile, dir: dir}
    return available

  isAvailable: (dir) ->
    throw new Error "#{dir} is not a valid direction" unless dir in ["up","right","down","left"]
    switch dir
      when "up"    then tile = @map.getTileAbove(@index,@cur.x,@cur.y)
      when "right" then tile = @map.getTileRight(@index,@cur.x,@cur.y)
      when "down"  then tile = @map.getTileBelow(@index,@cur.x,@cur.y)
      when "left"  then tile = @map.getTileLeft(@index,@cur.x,@cur.y)

    if tile is null then return null
    if tile.index isnt -1 then return null
    return tile

  #check for out of bounds or running into another tile (maybe just check index = -1?)
  #calculate @filled and @remaining from @size
  #check for maxDist
  grow: (dir) ->
    if not dir?
      @map.putTile(@gid,@cur.x,@cur.y,@layer)
      return null

    tile = @isAvailable(dir)
    if tile?
      @cur = tile
      @map.putTile(@gid,@cur.x,@cur.y,@layer)
      return null

    else throw new Error "#{@name} cannot grow #{dir}"
    return null







class window.Dungeon
  constructor: (options) ->
    throw new Error "No map provided to Dungeon constructor" unless options.map?
    @map        = options.map
    @width      = options.width or 20
    @height     = options.height or 20
    @tileSize   = options.tileSize or 32
    @nodes      = options.nodes or []
    @randomness = options.randomness or 5
    @numTiles   = @width*@height unless not @width? or not @height?
    @layer      = @map.create("dungeon", @width, @height, @tileSize, @tileSize)
    @layer.resizeWorld()
      
  randOpenTile: (layer) ->
    arr = layer.layer.data
    open = []
    for row in arr
      for tile in row when tile.index is -1
        open.push tile

    if open.length <= 0 then return false
    return @randElem(open)

  randElem: (arr) -> return arr[Math.floor(Math.random()*arr.length)]

  build: ->
    for n in @nodes

      options = dungeon: this, gid: n.gid, maxDist: n.maxDist, size: n.size, name: n.name
      node = new Node(options)
      node.grow()
      node.grow("up")
      node.grow("right")
      node.grow("right")
      node.grow("down")

    return null