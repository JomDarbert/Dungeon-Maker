
/*
Need a fix for spidering resources
Clear dungeon
Button for testing
resize game?
camera follow mouse?

Create nodes for each resource type
Node - own class
  max distance from center it is allowed to spider out to
 */
window.Blob = (function() {
  function Blob(dungeon, gid, maxDist, size) {
    this.dungeon = dungeon;
    this.gid = gid;
    this.maxDist = maxDist;
    this.size = size;
    if (this.dungeon == null) {
      this.dungeon = null;
    }
    if (this.gid == null) {
      this.gid = 0;
    }
    if (this.maxDist == null) {
      this.maxDist = 20;
    }
    if (this.size == null) {
      this.size = 20;
    }
    this.layer = this.dungeon.layer;
    this.map = this.dungeon.map;
    this.center = this.dungeon.randOpenTile(this.layer);
    this.current = this.center;
  }

  Blob.prototype.distFromStart = function() {
    var x1, x2, y1, y2;
    x1 = this.center.x;
    y1 = this.center.y;
    x2 = this.current.x;
    y2 = this.current.y;
    return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
  };

  Blob.prototype.getAvailable = function(tile) {
    var adj, available, dir;
    if (tile == null) {
      tile = this.current;
    }
    adj = {
      up: this.map.getTileAbove(this.map.getLayer(), tile.x, tile.y),
      right: this.map.getTileRight(this.map.getLayer(), tile.x, tile.y),
      down: this.map.getTileBelow(this.map.getLayer(), tile.x, tile.y),
      left: this.map.getTileLeft(this.map.getLayer(), tile.x, tile.y)
    };
    available = [];
    for (dir in adj) {
      tile = adj[dir];
      if (tile !== null && tile.index === -1) {
        available.push({
          tile: tile,
          dir: dir
        });
      }
    }
    return available;
  };

  Blob.prototype.putTile = function(direction) {
    var down, left, right, up;
    switch (direction) {
      case void 0:
        return this.map.putTile(this.gid, this.current.x, this.current.y, this.layer);
      case "up":
        up = this.map.getTileAbove(this.map.getLayer(), this.current.x, this.current.y);
        if (!(up == null)) {
          return this.map.putTile(this.gid, up.x, up.y, this.layer);
        }
        break;
      case "right":
        right = this.map.getTileRight(this.map.getLayer(), this.current.x, this.current.y);
        if (!(right == null)) {
          return this.map.putTile(this.gid, right.x, right.y, this.layer);
        }
        break;
      case "down":
        down = this.map.getTileBelow(this.map.getLayer(), this.current.x, this.current.y);
        if (!(down == null)) {
          return this.map.putTile(this.gid, down.x, down.y, this.layer);
        }
        break;
      case "left":
        left = this.map.getTileLeft(this.map.getLayer(), this.current.x, this.current.y);
        if (!(left == null)) {
          return this.map.putTile(this.gid, left.x, left.y, this.layer);
        }
    }
  };

  return Blob;

})();

window.Dungeon = (function() {
  function Dungeon(width, height, tileSize, game, map, blobs, randomness) {
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;
    this.game = game;
    this.map = map;
    this.blobs = blobs;
    this.randomness = randomness;
    if (this.width == null) {
      this.width = 20;
    }
    if (this.width == null) {
      this.height = 20;
    }
    if (this.tileSize == null) {
      this.tileSize = 32;
    }
    if (this.map == null) {
      this.map = null;
    }
    if (this.blobs == null) {
      this.blobs = null;
    }
    if (this.randomness == null) {
      this.randomness = 5;
    }
    if (!((this.width == null) || (this.height == null))) {
      this.numTiles = this.width * this.height;
    }
    this.layer = this.map.create("dungeon", this.width, this.height, this.tileSize, this.tileSize);
    this.layer.resizeWorld();
  }

  Dungeon.prototype.build = function() {
    var b, blob, _i, _len, _ref, _results;
    _ref = this.blobs;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      b = _ref[_i];
      blob = new Blob(this, b.gid, b.maxDist, b.size);
      blob.putTile();
      _results.push(blob.putTile("up"));
    }
    return _results;
  };

  Dungeon.prototype.randOpenTile = function(layer) {
    var open;
    open = layer.layer.data.filter(function(y) {
      var x, _i, _len;
      for (_i = 0, _len = y.length; _i < _len; _i++) {
        x = y[_i];
        if (x.index === -1) {
          return 1;
        }
      }
    });
    if (open.length <= 0) {
      return false;
    }
    return this.randElem(this.randElem(open));
  };

  Dungeon.prototype.randElem = function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  Dungeon.prototype.countDirs = function(log, numRecent) {
    var counts, entry, key, sr, st, x, y, _i, _len;
    counts = {
      total: {
        up: 0,
        right: 0,
        down: 0,
        left: 0
      },
      recent: {
        up: 0,
        right: 0,
        down: 0,
        left: 0
      },
      last: null,
      sortedRecent: [],
      sortedTotal: []
    };
    counts.last = log[log.length - 1];
    for (key = _i = 0, _len = log.length; _i < _len; key = ++_i) {
      entry = log[key];
      if (!((entry != null) && (entry.dir != null))) {
        continue;
      }
      counts.total[entry.dir]++;
      if (key <= numRecent) {
        counts.recent[entry.dir]++;
      }
    }
    st = [];
    sr = [];
    for (x in counts.recent) {
      sr.push([x, counts.recent[x]]);
    }
    for (y in counts.total) {
      st.push([y, counts.total[y]]);
    }
    counts.sortedRecent = sr.sort(function(a, b) {
      return b[1] - a[1];
    });
    counts.sortedTotal = st.sort(function(a, b) {
      return b[1] - a[1];
    });
    return counts;
  };

  Dungeon.prototype.placeBlocks = function(types) {
    var blob, center, count, current, dung, layer, log, o, _i, _len, _results;
    layer = this.map.create("dungeon", this.width, this.height, this.tileSize, this.tileSize);
    layer.resizeWorld();
    dung = this;
    _results = [];
    for (_i = 0, _len = types.length; _i < _len; _i++) {
      o = types[_i];
      count = 0;
      log = [];
      current = null;
      center = this.randOpenTile(layer);
      _results.push(blob = new Blob(center, 10));

      /*
       * Loop for size of objects, placing tiles where they will fit
      loop
        if not current? then current = {tile: @randOpenTile(layer), dir: null}
        @map.putTile(o.gid,current.tile.x,current.tile.y,layer)
      
        available = @getAvail(current.tile)
      
         * If more than one direction available, apply randomness checker
        if available.length > 1
          dirs = @countDirs(log,5)
          recent = dirs.sortedRecent
          last = dirs.last
          priority = []
      
           * Don't go in the same direction twice
          if last?
            available = available.filter (x) ->
              if x.dir isnt last.dir then return 1
      
           * Prioritize least traveled directions
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
      
         * Otherwise, go in the only available direction
        if available.length > 0
          log.push current
          current = @randElem(available)
          count++
      
         * Otherwise no current paths are available to travel, so pick another spot to check in log
        else
          log = log.filter (b) -> if dung.getAvail(b.tile).length > 0 then return 1
          if log.length > 0 then current = @randElem(log)
          else current = {tile: @randOpenTile(layer), dir: null}
        break if count >= o.num or current.tile is false
       */
    }
    return _results;
  };

  return Dungeon;

})();
