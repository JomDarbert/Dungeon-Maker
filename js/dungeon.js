
/*
Need a fix for spidering resources
Clear dungeon
Button for testing
resize game?
camera follow mouse?

Create nodes for each resource type
Node - own class
  max distance from center it is allowed to spider out to
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
    this.center = this.dungeon.randOpenTile(this.layer);
    this.cur = this.center;
  }

  Node.prototype.distFromCenter = function() {
    return Math.abs(this.cur.x - this.center.x) + Math.abs(this.cur.y - this.center.y);
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
      if (tile !== null && tile.index === -1) {
        available.push({
          tile: tile,
          dir: dir
        });
      }
    }
    return available;
  };

  Node.prototype.isAvailable = function(dir) {
    var tile;
    if (dir !== "up" && dir !== "right" && dir !== "down" && dir !== "left") {
      throw new Error("" + dir + " is not a valid direction");
    }
    switch (dir) {
      case "up":
        tile = this.map.getTileAbove(this.index, this.cur.x, this.cur.y);
        break;
      case "right":
        tile = this.map.getTileRight(this.index, this.cur.x, this.cur.y);
        break;
      case "down":
        tile = this.map.getTileBelow(this.index, this.cur.x, this.cur.y);
        break;
      case "left":
        tile = this.map.getTileLeft(this.index, this.cur.x, this.cur.y);
    }
    if (tile === null) {
      return null;
    }
    if (tile.index !== -1) {
      return null;
    }
    return tile;
  };

  Node.prototype.grow = function(dir) {
    var tile;
    if (dir == null) {
      this.map.putTile(this.gid, this.cur.x, this.cur.y, this.layer);
      return null;
    }
    tile = this.isAvailable(dir);
    if (tile != null) {
      this.cur = tile;
      this.map.putTile(this.gid, this.cur.x, this.cur.y, this.layer);
      return null;
    } else {
      throw new Error("" + this.name + " cannot grow " + dir);
    }
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

  Dungeon.prototype.randOpenTile = function(layer) {
    var arr, open, row, tile, _i, _j, _len, _len1;
    arr = layer.layer.data;
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
    var n, node, options, _i, _len, _ref;
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
      node.grow("up");
      node.grow("right");
      node.grow("right");
      node.grow("down");
    }
    return null;
  };

  return Dungeon;

})();
