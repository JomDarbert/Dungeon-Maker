###
Need a fix for spidering resources
Clear dungeon
Button for testing
resize game?
###

class window.Dungeon
  constructor: (@width,@height,@tileSize,@game,@map) ->
    @width = 20 unless @width?
    @height = 20 unless @width?
    @numTiles = @width*@height unless not @width? or not @height?
    @map = null unless @map

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

  placeBlocks: (area) ->
    layer = @map.create("dungeon", @width, @height, @tileSize, @tileSize)
    layer.resizeWorld()
    dung = this

    for o in area
      count = 0
      log = []

      # Loop for size of objects, placing tiles where they will fit
      loop
        if not current? then current = {tile: @randOpenTile(layer), dir: null}
        @map.putTile(o.gid,current.tile.x,current.tile.y,layer)

        # If some direction is available, pick a random one and increase count
        available = @getAvail(current.tile)
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