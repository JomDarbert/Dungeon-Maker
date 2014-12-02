###
Need a fix for spidering resources
Clear dungeon
Button for testing
resize game?
camera follow mouse?

Create nodes for each resource type
Node - own class
  max distance from center it is allowed to spider out to
###
class window.Blob
  constructor: (@center,@maxDist,@size,@gid,@map) ->
    @center      = null    unless @center?
    @maxDist     = 20      unless @maxDist?
    @current     = @center unless @current?
    @size        = 20      unless @size?
    @gid         = 0       unless @gid?
    @map         = null    unless @map?

  distFromStart: ->
    x1 = @center.x
    y1 = @center.y
    x2 = @current.x
    y2 = @current.y
    return Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 )

  getAvailable: (tile) ->
    tile = @current unless tile?
    adj = 
      up: @map.getTileAbove(@map.getLayer(),tile.x,tile.y) 
      right: @map.getTileRight(@map.getLayer(),tile.x,tile.y) 
      down: @map.getTileBelow(@map.getLayer(),tile.x,tile.y) 
      left: @map.getTileLeft(@map.getLayer(),tile.x,tile.y)
    available = []
    for dir,tile of adj when tile isnt null and tile.index is -1
      available.push {tile: tile, dir: dir}
    return available

class window.Dungeon
  constructor: (@width,@height,@tileSize,@game,@map,@blobs,@randomness) ->
    @width      = 20    unless @width?
    @height     = 20    unless @width?
    @tileSize   = 32    unless @tileSize?
    @map        = null  unless @map?
    @blobs      = null  unless @blobs?
    @randomness = 5     unless @randomness?
    @numTiles   = @width*@height unless not @width? or not @height?

  build: ->
    layer = @map.create("dungeon", @width, @height, @tileSize, @tileSize)
    layer.resizeWorld()

    for b in @blobs
      blob = new Blob(@randOpenTile(layer),b.maxDist,b.size,b.gid,@map)
      console.log blob
      @map.putTile(blob.gid,blob.center.x,blob.center.y,layer)
      available = blob.getAvailable()
      console.log available

  randOpenTile: (layer) ->
    open = layer.layer.data.filter (y) -> return 1 for x in y when x.index is -1
    if open.length <= 0 then return false
    return @randElem(@randElem(open))

  randElem: (arr) -> return arr[Math.floor(Math.random()*arr.length)]



  countDirs: (log,numRecent) ->
    counts = 
      total:  {up: 0, right: 0, down: 0, left: 0}
      recent: {up: 0, right: 0, down: 0, left: 0}
      last:   null
      sortedRecent: []
      sortedTotal: []

    counts.last = log[log.length-1]
    for entry,key in log when entry? and entry.dir?
      counts.total[entry.dir]++
      if key <= numRecent then counts.recent[entry.dir]++

    st = []
    sr = []
    for x of counts.recent
      sr.push [x,counts.recent[x]]

    for y of counts.total
      st.push [y,counts.total[y]]

    counts.sortedRecent = sr.sort (a,b) -> b[1] - a[1]
    counts.sortedTotal  = st.sort (a,b) -> b[1] - a[1]
    return counts

  placeBlocks: (types) ->
    layer = @map.create("dungeon", @width, @height, @tileSize, @tileSize)
    layer.resizeWorld()
    dung = this

    for o in types
      count = 0
      log = []
      current = null
      center = @randOpenTile(layer)

      blob = new Blob(center,10)

      ###
      # Loop for size of objects, placing tiles where they will fit
      loop
        if not current? then current = {tile: @randOpenTile(layer), dir: null}
        @map.putTile(o.gid,current.tile.x,current.tile.y,layer)

        available = @getAvail(current.tile)

        # If more than one direction available, apply randomness checker
        if available.length > 1
          dirs = @countDirs(log,5)
          recent = dirs.sortedRecent
          last = dirs.last
          priority = []

          # Don't go in the same direction twice
          if last?
            available = available.filter (x) ->
              if x.dir isnt last.dir then return 1

          # Prioritize least traveled directions
          for tile in available 
            console.log tile.dir
            if tile.dir is recent[3][0] or tile.dir is recent[2][0]
              if last? and tile.dir isnt last.dir
                priority.push tile

          log.push current
          if last? then console.log "last: "+last.dir

          if priority.length > 0 then current = @randElem(priority)
          else current = @randElem(available)
          console.log "current: "+current.dir
          console.log "-----"
          count++

        # Otherwise, go in the only available direction
        if available.length > 0
          log.push current
          current = @randElem(available)
          count++

        # Otherwise no current paths are available to travel, so pick another spot to check in log
        else
          log = log.filter (b) -> if dung.getAvail(b.tile).length > 0 then return 1
          if log.length > 0 then current = @randElem(log)
          else current = {tile: @randOpenTile(layer), dir: null}
        break if count >= o.num or current.tile is false
      ###