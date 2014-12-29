
/*
Clear dungeon
Button for testing
resize game?
camera follow mouse?

collision when creating tile

Fill empty space with different types of rock
 */
window.randElem = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

window.Node = (function() {
  function Node(options) {
    if (options.dungeon == null) {
      throw new Error("No dungeon provided to Node constructor");
    }
    if (options.fillHoles == null) {
      options.fillHoles = true;
    }
    this.dungeon = options.dungeon;
    this.name = options.name || void 0;
    this.gid = options.gid || 0;
    this.maxRadius = options.maxRadius || 20;
    this.size = options.size || 20;
    this.fillHoles = options.fillHoles;
    this.layer = this.dungeon.layer;
    this.map = this.dungeon.map;
    this.index = this.map.getLayer();
    this.group = game.add.group();
    this.center = this.dungeon.randOpenTile();
    this.cur = this.center;
    this.placedTiles = [];
  }

  Node.prototype.distFromCenter = function(tile) {
    if (tile == null) {
      tile = this.cur;
    }
    return Math.abs(tile.x - this.center.x) + Math.abs(tile.y - this.center.y);
  };

  Node.prototype.getAdjacent = function(tile) {
    var adj;
    if (tile == null) {
      tile = this.cur;
    }
    return adj = {
      up: this.map.getTileAbove(this.index, tile.x, tile.y),
      right: this.map.getTileRight(this.index, tile.x, tile.y),
      down: this.map.getTileBelow(this.index, tile.x, tile.y),
      left: this.map.getTileLeft(this.index, tile.x, tile.y)
    };
  };

  Node.prototype.getAvailable = function(tile) {
    var available, dir, _ref;
    if (tile == null) {
      tile = this.cur;
    }
    available = [];
    _ref = this.getAdjacent(tile);
    for (dir in _ref) {
      tile = _ref[dir];
      if ((tile != null) && tile.index === -1 && this.distFromCenter(tile) <= this.maxRadius) {
        available.push({
          tile: tile,
          dir: dir
        });
      }
    }
    if (available.length !== 0) {
      return available;
    }
    return null;
  };

  Node.prototype.findBranch = function() {
    var hasOpenPath, tile, _i, _len, _ref;
    hasOpenPath = [];
    _ref = this.placedTiles;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tile = _ref[_i];
      if (this.getAvailable(tile) != null) {
        hasOpenPath.push(tile);
      }
    }
    if (hasOpenPath.length > 0) {
      return this.cur = randElem(hasOpenPath);
    } else {
      return null;
    }
  };

  Node.prototype.findHoles = function() {
    var holes;
    holes = [];
    this.map.forEach(function(tile) {
      var adj, fill;
      if (tile.index === -1) {
        fill = true;
        adj = this.getAdjacent(tile);
        if ((adj.up != null) && adj.up.index === -1) {
          fill = false;
        } else if ((adj.right != null) && adj.right.index === -1) {
          fill = false;
        } else if ((adj.down != null) && adj.down.index === -1) {
          fill = false;
        } else if ((adj.left != null) && adj.left.index === -1) {
          fill = false;
        }
        if (fill === true) {
          return holes.push(tile);
        }
      }
    }, this, 0, 0, this.dungeon.width, this.dungeon.height, this.layer);
    if (holes.length !== 0) {
      return holes;
    }
    return null;
  };

  Node.prototype.grow = function(tile) {
    var t;
    if (!(tile == null)) {
      this.cur = tile;
    }
    this.map.putTile(this.gid, this.cur.x, this.cur.y, this.layer);
    this.placedTiles.push(this.cur);
    t = this.dungeon.tileSize;
    this.group.create(this.cur.x * t, this.cur.y * t, this.name);
    return null;
  };

  return Node;

})();

window.Dungeon = (function() {
  function Dungeon(options) {
    if (options.map == null) {
      throw new Error("No map provided to Dungeon constructor");
    }
    this.map = options.map;
    this.width = options.width || 20;
    this.height = options.height || 20;
    this.maxDimen = Math.max(this.width, this.height);
    this.tileSize = options.tileSize || 32;
    this.nodeIn = options.nodes || [];
    this.nodes = [];
    if (!((this.width == null) || (this.height == null))) {
      this.numTiles = this.width * this.height;
    }
    this.layer = this.map.create("dungeon", this.width, this.height, this.tileSize, this.tileSize);
    this.layer.debug = true;
    this.layer.resizeWorld();
  }

  Dungeon.prototype.dungeonFull = function() {
    var open;
    open = [];
    this.map.forEach(function(tile) {
      if (tile.index === -1) {
        return open.push(tile);
      }
    }, this, 0, 0, this.width, this.height, this.layer);
    if (open.length === 0) {
      return true;
    } else {
      return null;
    }
  };

  Dungeon.prototype.randOpenTile = function() {
    var filled, open, open_seg, row, seg, segments, tile, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref;
    open = [];
    open_seg = [];
    segments = this.getSegments();
    for (_i = 0, _len = segments.length; _i < _len; _i++) {
      seg = segments[_i];
      filled = 0;
      for (_j = 0, _len1 = seg.length; _j < _len1; _j++) {
        tile = seg[_j];
        if (tile.index !== -1) {
          filled++;
        }
      }
      if (filled <= seg.length * 0.1) {
        open_seg.push(seg);
      }
    }
    if (open_seg.length > 0) {
      for (_k = 0, _len2 = open_seg.length; _k < _len2; _k++) {
        seg = open_seg[_k];
        for (_l = 0, _len3 = seg.length; _l < _len3; _l++) {
          tile = seg[_l];
          if (tile.index === -1) {
            open.push(tile);
          }
        }
      }
    } else {
      _ref = this.layer.layer.data;
      for (_m = 0, _len4 = _ref.length; _m < _len4; _m++) {
        row = _ref[_m];
        for (_n = 0, _len5 = row.length; _n < _len5; _n++) {
          tile = row[_n];
          if (tile.index === -1) {
            open.push(tile);
          }
        }
      }
    }
    if (open.length <= 0) {
      return null;
    }
    return randElem(open);
  };

  Dungeon.prototype.getSegments = function(pct) {
    var add, col, cols_cur, cols_next, j, k, row, rows_cur, rows_next, seg_height, seg_width, segments, _i, _j, _len, _len1, _ref;
    if (pct == null) {
      pct = 0.5;
    }
    segments = [];
    seg_width = this.width * pct;
    seg_height = this.height * pct;
    cols_cur = 0;
    cols_next = seg_width;
    rows_cur = 0;
    rows_next = seg_height;
    while (true) {
      add = [];
      _ref = this.layer.layer.data;
      for (j = _i = 0, _len = _ref.length; _i < _len; j = ++_i) {
        row = _ref[j];
        if ((rows_cur <= j && j < rows_next)) {
          for (k = _j = 0, _len1 = row.length; _j < _len1; k = ++_j) {
            col = row[k];
            if ((cols_cur <= k && k < cols_next)) {
              add.push(col);
            }
          }
        }
      }
      segments.push(add);
      if (cols_next < this.width) {
        cols_cur += seg_width;
        cols_next += seg_width;
      } else {
        cols_cur = 0;
        cols_next = seg_width;
        rows_cur = rows_next;
        rows_next += seg_height;
      }
      if (rows_cur >= this.height) {
        break;
      }
    }
    return segments;
  };

  Dungeon.prototype.build = function() {
    var goTo, holes, i, n, node, options, tile, _i, _j, _k, _len, _len1, _ref, _ref1;
    _ref = this.nodeIn;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      n = _ref[_i];
      options = {
        dungeon: this,
        gid: n.gid,
        maxRadius: n.maxRadius,
        size: n.size,
        name: n.name,
        fillHoles: n.fillHoles
      };
      node = new Node(options);
      this.nodes.push(node);
      if (this.dungeonFull() == null) {
        node.grow();
      }
      for (i = _j = 1, _ref1 = node.size; _j <= _ref1; i = _j += 1) {
        if (this.dungeonFull() != null) {
          break;
        }
        if (node.findBranch() != null) {
          goTo = randElem(node.getAvailable());
          node.grow(goTo.tile);
          i++;
        } else {
          while (true) {
            node.maxRadius++;
            if ((node.findBranch() != null) || node.maxRadius >= this.maxDimen) {
              break;
            }
          }
          if (node.maxRadius >= this.maxDimen) {
            node.grow(this.randOpenTile());
            i++;
          }
        }
        if (node.fillHoles === true) {
          holes = node.findHoles();
          if (holes != null) {
            for (_k = 0, _len1 = holes.length; _k < _len1; _k++) {
              tile = holes[_k];
              node.grow(tile);
            }
          }
        }
      }
    }
    return null;
  };

  return Dungeon;

})();
