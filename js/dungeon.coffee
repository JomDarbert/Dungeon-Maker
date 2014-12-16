###
Need a fix for spidering resources
Clear dungeon
Button for testing
resize game?
camera follow mouse?

Node
  Minimum distance between nodes

Fill empty space with different types of rock
###
window.randElem = (arr) -> return arr[Math.floor(Math.random()*arr.length)]

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
    @center      = @dungeon.randOpenTile()
    @cur         = @center
    @placedTiles = []

  distFromCenter: (tile) ->
    tile = @cur unless tile?
    return Math.abs(tile.x-@center.x) + Math.abs(tile.y-@center.y)

  getAvailable: (tile) ->
    # Calculate @filled and @remaining from @size
    # Handle running into walls?
    tile = @cur unless tile?
    adj = 
      up: @map.getTileAbove(@index,tile.x,tile.y) 
      right: @map.getTileRight(@index,tile.x,tile.y) 
      down: @map.getTileBelow(@index,tile.x,tile.y) 
      left: @map.getTileLeft(@index,tile.x,tile.y)
    available = []
    for dir,tile of adj when tile isnt null and tile.index is -1 and @distFromCenter(tile) <= @maxDist
      available.push {tile: tile, dir: dir}
    return available unless available.length is 0
    return null

  findBranch: ->
    hasOpenPath = []
    for tile in @placedTiles when @getAvailable(tile)?
      hasOpenPath.push tile

    if hasOpenPath.length > 0
      @cur = randElem hasOpenPath
      return @cur

    else return null

  fillHoles: ->
    return null

  grow: (tile) ->
    if not tile?
      @map.putTile(@gid,@cur.x,@cur.y,@layer)
      @placedTiles.push @cur
      return null

    @cur = tile
    @map.putTile(@gid,@cur.x,@cur.y,@layer)
    @placedTiles.push @cur
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
      
  randOpenTile: ->
    arr = @layer.layer.data
    open = []
    for row in arr
      for tile in row when tile.index is -1
        open.push tile

    if open.length <= 0 then return null
    return randElem(open)

  build: ->
    for n in @nodes
      options = dungeon: this, gid: n.gid, maxDist: n.maxDist, size: n.size, name: n.name
      node = new Node(options)
      node.grow()
      i = 0
      loop
        break if not @randOpenTile()? or i >= 19

        if node.findBranch()?
          dirs = node.getAvailable()
          goTo = randElem dirs
          node.grow goTo.tile
          i++
        else
          node.maxDist = Math.max @width, @height
          node.grow @randOpenTile()
          i++

    return null