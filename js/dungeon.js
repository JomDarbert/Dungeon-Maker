
/*
Need a fix for spidering resources
Clear dungeon
Button for testing
resize game?
camera follow mouse?
 */
window.Dungeon = (function() {
  function Dungeon(width, height, tileSize, game, map, randomness) {
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;
    this.game = game;
    this.map = map;
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
    if (this.randomness == null) {
      this.randomness = 5;
    }
    if (!((this.width == null) || (this.height == null))) {
      this.numTiles = this.width * this.height;
    }
  }

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

  Dungeon.prototype.getAvail = function(tile) {
    var adj, available, dir;
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
      sortedRecent: [],
      sortedTotal: []
    };
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

  Dungeon.prototype.placeBlocks = function(area) {
    var available, count, current, dung, layer, log, o, priority, recent, tile, _i, _len, _results;
    layer = this.map.create("dungeon", this.width, this.height, this.tileSize, this.tileSize);
    layer.resizeWorld();
    dung = this;
    _results = [];
    for (_i = 0, _len = area.length; _i < _len; _i++) {
      o = area[_i];
      count = 0;
      log = [];
      current = null;
      _results.push((function() {
        var _j, _len1, _results1;
        _results1 = [];
        while (true) {
          if (current == null) {
            current = {
              tile: this.randOpenTile(layer),
              dir: null
            };
          }
          this.map.putTile(o.gid, current.tile.x, current.tile.y, layer);
          available = this.getAvail(current.tile);
          if (available.length > 1) {
            recent = this.countDirs(log, 2).sortedRecent;
            priority = [];
            console.log(recent);
            for (_j = 0, _len1 = available.length; _j < _len1; _j++) {
              tile = available[_j];
              if (tile.dir === recent[3][0] || tile.dir === recent[2][0]) {
                console.log("prioprity found");
                priority.push(tile);
              }
            }
            log.push(current);
            if (priority.length > 0) {
              current = this.randElem(priority);
            } else {
              current = this.randElem(available);
            }
            count++;
          }
          if (available.length > 0) {
            log.push(current);
            current = this.randElem(available);
            count++;
          } else {
            log = log.filter(function(b) {
              if (dung.getAvail(b.tile).length > 0) {
                return 1;
              }
            });
            if (log.length > 0) {
              current = this.randElem(log);
            } else {
              current = {
                tile: this.randOpenTile(layer),
                dir: null
              };
            }
          }
          if (count >= o.num || current.tile === false) {
            break;
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  return Dungeon;

})();
