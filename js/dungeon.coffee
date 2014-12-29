###
Clear dungeon
Button for testing
resize game?
camera follow mouse?

collision when creating tile

Fill empty space with different types of rock
###
window.randElem = (arr) -> return arr[Math.floor(Math.random()*arr.length)]

class window.Node
  constructor: (options) ->
    throw new Error "No dungeon provided to Node constructor" unless options.dungeon?
    options.fillHoles = true unless options.fillHoles?
    @dungeon     = options.dungeon
    @name        = options.name or undefined
    @gid         = options.gid or 0
    @maxRadius   = options.maxRadius or 20
    @size        = options.size or 20
    @fillHoles   = options.fillHoles
    @layer       = @dungeon.layer
    @map         = @dungeon.map
    @index       = @map.getLayer()
    @group       = game.add.group()
    @center      = @dungeon.randOpenTile()
    @cur         = @center
    @placedTiles = []

  distFromCenter: (tile) ->
    tile = @cur unless tile?
    return Math.abs(tile.x-@center.x) + Math.abs(tile.y-@center.y)

  getAdjacent: (tile) ->
    tile = @cur unless tile?
    return adj = 
      up: @map.getTileAbove(@index,tile.x,tile.y) 
      right: @map.getTileRight(@index,tile.x,tile.y) 
      down: @map.getTileBelow(@index,tile.x,tile.y) 
      left: @map.getTileLeft(@index,tile.x,tile.y)

  getAvailable: (tile) ->
    tile = @cur unless tile?
    available = []
    for dir,tile of @getAdjacent(tile) when tile? and tile.index is -1 and @distFromCenter(tile) <= @maxRadius
      available.push {tile: tile, dir: dir}

    return available unless available.length is 0
    return null

  findBranch: ->
    hasOpenPath = []
    hasOpenPath.push tile for tile in @placedTiles when @getAvailable(tile)?
    if hasOpenPath.length > 0 then return @cur = randElem hasOpenPath
    else return null

  findHoles: ->
    holes = []
    @map.forEach( (tile) ->
      if tile.index is -1
        fill = true
        adj = @getAdjacent(tile)
        if      adj.up?    and adj.up.index    is -1 then fill = false
        else if adj.right? and adj.right.index is -1 then fill = false
        else if adj.down?  and adj.down.index  is -1 then fill = false
        else if adj.left?  and adj.left.index  is -1 then fill = false
        if fill is true then holes.push tile
    ,this,0,0,@dungeon.width,@dungeon.height,@layer)
    return holes unless holes.length is 0
    return null

  grow: (tile) ->
    @cur = tile unless not tile?
    @map.putTile(@gid,@cur.x,@cur.y,@layer)
    @placedTiles.push @cur

    t = @dungeon.tileSize
    @group.create @cur.x*t,@cur.y*t,@name
    return null



class window.Dungeon
  constructor: (options) ->
    throw new Error "No map provided to Dungeon constructor" unless options.map?
    @map        = options.map
    @width      = options.width or 20
    @height     = options.height or 20
    @maxDimen   = Math.max @width,@height
    @tileSize   = options.tileSize or 32
    @nodeIn     = options.nodes or []
    @nodes      = []
    @numTiles   = @width*@height unless not @width? or not @height?
    @layer      = @map.create("dungeon", @width, @height, @tileSize, @tileSize)
    @layer.debug = true
    @layer.resizeWorld()

  dungeonFull: ->
    open = []
    @map.forEach( (tile) ->
      if tile.index is -1 then open.push tile
    ,this,0,0,@width,@height,@layer)
    if open.length is 0 then return true
    else return null
      
  randOpenTile: () ->
    open = []
    open_seg = []
    segments = @getSegments()

    for seg in segments
      filled = 0
      filled++ for tile in seg when tile.index isnt -1
      if filled <= seg.length * 0.1 then open_seg.push seg

    if open_seg.length > 0
      for seg in open_seg
        open.push tile for tile in seg when tile.index is -1
    else
      for row in @layer.layer.data
        open.push tile for tile in row when tile.index is -1

    if open.length <= 0 then return null
    return randElem(open)

  getSegments: (pct) ->
    pct = 0.5 unless pct?
    segments = []
    seg_width = @width * pct
    seg_height = @height * pct
    cols_cur = 0
    cols_next = seg_width
    rows_cur = 0
    rows_next = seg_height

    loop
      add = []
      for row,j in @layer.layer.data when rows_cur <= j < rows_next
        for col,k in row when cols_cur <= k < cols_next
          add.push col

      segments.push add
      if cols_next < @width
        cols_cur += seg_width
        cols_next += seg_width
      else
        cols_cur = 0
        cols_next = seg_width
        rows_cur = rows_next
        rows_next += seg_height

      break if rows_cur >= @height
    return segments


  build: ->
    for n in @nodeIn
      options = 
        dungeon:   this
        gid:       n.gid
        maxRadius: n.maxRadius
        size:      n.size
        name:      n.name
        fillHoles: n.fillHoles

      node = new Node(options)
      @nodes.push node
      node.grow() unless @dungeonFull()?

      for i in [1..node.size] by 1
        break if @dungeonFull()?

        if node.findBranch()?
          goTo = randElem node.getAvailable()
          node.grow goTo.tile
          i++
        else
          loop
            node.maxRadius++
            break if node.findBranch()? or node.maxRadius >= @maxDimen

          if node.maxRadius >= @maxDimen
            node.grow @randOpenTile()
            i++

        if node.fillHoles is true
          holes = node.findHoles()
          if holes? then node.grow(tile) for tile in holes
            
    return null