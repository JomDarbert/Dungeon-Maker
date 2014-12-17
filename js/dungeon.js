
/*
Need a fix for spidering resources
Clear dungeon
Button for testing
resize game?
camera follow mouse?

Node
  Minimum distance between nodes (place a flag on -1 tiles around nodes that prevents being built on)

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
    this.dungeon = options.dungeon;
    this.name = options.name || void 0;
    this.gid = options.gid || 0;
    this.maxRadius = options.maxRadius || 20;
    this.size = options.size || 20;
    this.layer = this.dungeon.layer;
    this.map = this.dungeon.map;
    this.index = this.map.getLayer();
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
    var adj, available, dir;
    if (tile == null) {
      tile = this.cur;
    }
    adj = this.getAdjacent(tile);
    available = [];
    for (dir in adj) {
      tile = adj[dir];
      if (tile !== null && tile.index === -1 && this.distFromCenter(tile) <= this.maxRadius) {
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
      this.cur = randElem(hasOpenPath);
      return this.cur;
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
    if (tile == null) {
      this.map.putTile(this.gid, this.cur.x, this.cur.y, this.layer);
      this.placedTiles.push(this.cur);
      return null;
    }
    this.cur = tile;
    this.map.putTile(this.gid, this.cur.x, this.cur.y, this.layer);
    this.placedTiles.push(this.cur);
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
    this.nodes = options.nodes || [];
    this.randomness = options.randomness || 5;
    if (!((this.width == null) || (this.height == null))) {
      this.numTiles = this.width * this.height;
    }
    this.layer = this.map.create("dungeon", this.width, this.height, this.tileSize, this.tileSize);
    this.layer.resizeWorld();
  }

  Dungeon.prototype.randOpenTile = function() {
    var arr, open, row, tile, _i, _j, _len, _len1;
    arr = this.layer.layer.data;
    open = [];
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      row = arr[_i];
      for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
        tile = row[_j];
        if (tile.index === -1) {
          open.push(tile);
        }
      }
    }
    if (open.length <= 0) {
      return null;
    }
    return randElem(open);
  };

  Dungeon.prototype.build = function() {
    var getRand, goTo, holes, i, n, node, options, tile, _i, _j, _len, _len1, _ref;
    _ref = this.nodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      n = _ref[_i];
      options = {
        dungeon: this,
        gid: n.gid,
        maxRadius: n.maxRadius,
        size: n.size,
        name: n.name
      };
      node = new Node(options);
      node.grow();
      i = 1;
      while (true) {
        if ((this.randOpenTile() == null) || i >= node.size) {
          break;
        }
        if (node.findBranch() != null) {
          goTo = randElem(node.getAvailable());
          node.grow(goTo.tile);
          i++;
        } else {
          while (true) {
            node.maxRadius++;
            if (node.maxRadius >= this.maxDimen) {
              getRand = true;
            }
            if ((node.findBranch() != null) || getRand === true) {
              break;
            }
          }
          if (getRand === true) {
            node.grow(this.randOpenTile());
            i++;
          }
        }
        holes = node.findHoles();
        if (holes != null) {
          for (_j = 0, _len1 = holes.length; _j < _len1; _j++) {
            tile = holes[_j];
            node.grow(tile);
          }
        }
      }
    }
    return null;
  };

  return Dungeon;

})();
