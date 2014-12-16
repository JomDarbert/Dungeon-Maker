
/*
Need a fix for spidering resources
Clear dungeon
Button for testing
resize game?
camera follow mouse?

Node
  Minimum distance between nodes

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
    this.maxDist = options.maxDist || 20;
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

  Node.prototype.getAvailable = function(tile) {
    var adj, available, dir;
    if (tile == null) {
      tile = this.cur;
    }
    adj = {
      up: this.map.getTileAbove(this.index, tile.x, tile.y),
      right: this.map.getTileRight(this.index, tile.x, tile.y),
      down: this.map.getTileBelow(this.index, tile.x, tile.y),
      left: this.map.getTileLeft(this.index, tile.x, tile.y)
    };
    available = [];
    for (dir in adj) {
      tile = adj[dir];
      if (tile !== null && tile.index === -1 && this.distFromCenter(tile) <= this.maxDist) {
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

  Node.prototype.fillHoles = function() {
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
    var dirs, goTo, i, n, node, options, _i, _len, _ref;
    _ref = this.nodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      n = _ref[_i];
      options = {
        dungeon: this,
        gid: n.gid,
        maxDist: n.maxDist,
        size: n.size,
        name: n.name
      };
      node = new Node(options);
      node.grow();
      i = 0;
      while (true) {
        if ((this.randOpenTile() == null) || i >= 19) {
          break;
        }
        if (node.findBranch() != null) {
          dirs = node.getAvailable();
          goTo = randElem(dirs);
          node.grow(goTo.tile);
          i++;
        } else {
          node.maxDist = Math.max(this.width, this.height);
          node.grow(this.randOpenTile());
          i++;
        }
      }
    }
    return null;
  };

  return Dungeon;

})();
