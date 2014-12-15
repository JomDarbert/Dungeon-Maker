
/*
Need a fix for spidering resources
Clear dungeon
Button for testing
resize game?
camera follow mouse?

Create nodes for each resource type
Node - own class
  Minimum distance between nodes
  Fill empty space with different types of rock
 */
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
    var arr, i;
    i = 0;
    this.map.forEach(function() {
      return console.log(++i);
    }, this, 0, 0, 5, 5, this.layer);
    return arr = this.layer.layer.data;
  };

  Node.prototype.grow = function(tile) {
    if (tile == null) {
      this.map.putTile(this.gid, this.cur.x, this.cur.y, this.layer);
      return null;
    }
    this.cur = tile;
    this.map.putTile(this.gid, this.cur.x, this.cur.y, this.layer);
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
      return false;
    }
    return this.randElem(open);
  };

  Dungeon.prototype.randElem = function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  Dungeon.prototype.build = function() {
    var avail, goTo, i, n, node, options, _i, _len, _ref;
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
      node.findBranch();
      while (true) {
        avail = node.getAvailable();
        if (!(avail == null)) {
          goTo = this.randElem(avail);
        }
        node.grow(goTo.tile);
        i++;
        if (i >= 20 || (avail == null)) {
          break;
        }
      }
    }
    return null;
  };

  return Dungeon;

})();
