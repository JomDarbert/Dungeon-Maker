var playState;

playState = {
  preload: function() {
    game.load.image("player", "assets/star.png");
    game.load.image("ground", "assets/ground.png");
    this.map = game.add.tilemap();
    this.tileSize = 32;
    this.gameW = Math.floor(game.width / this.tileSize);
    this.gameH = Math.floor(game.height / this.tileSize);
    this.gameA = this.gameW * this.gameH;
    return this.dungeon = this.createDungeonArray(this.gameW, this.gameH);
  },
  create: function() {
    game.stage.backgroundColor = "#3498db";
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    this.player.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(this.player);
    game.input.onDown.add(this.moveSprite, this);
    this.map.addTilesetImage("ground");
    this.placeBlocks(5, "test1");
    this.placeBlocks(5, "test1");
  },
  update: function() {},
  createDungeonArray: function(cols, rows) {
    var c, dungeon, r, _i, _j, _ref, _ref1;
    dungeon = new Array();
    for (r = _i = 0, _ref = rows - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; r = 0 <= _ref ? ++_i : --_i) {
      dungeon.push([]);
      for (c = _j = 0, _ref1 = cols - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; c = 0 <= _ref1 ? ++_j : --_j) {
        dungeon[r].push(null);
      }
    }
    return dungeon;
  },
  randTile: function(arr, layer) {
    var cols, rows, tile, x, y;
    if ((arr == null) || arr.length === 0 || arr[0].length === 0) {
      throw new Error("Dungeon array is not properly defined");
    }
    while (true) {
      rows = arr.length;
      cols = arr[0].length;
      y = Math.floor(Math.random() * rows);
      x = Math.floor(Math.random() * cols);
      tile = this.map.getTile(x, y, this.layer, true);
      if (tile.index === -1) {
        break;
      }
    }
    return tile;
  },
  randElem: function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },
  getAvail: function(tile) {
    var adj, avail, dir, down, index, left, maxH, maxW, right, up, val;
    index = this.map.getLayer();
    up = this.map.getTileAbove(index, tile.x, tile.y);
    right = this.map.getTileRight(index, tile.x, tile.y);
    down = this.map.getTileBelow(index, tile.x, tile.y);
    left = this.map.getTileLeft(index, tile.x, tile.y);
    adj = {
      up: up,
      right: right,
      down: down,
      left: left
    };
    avail = [];
    maxW = game.width / this.tileSize - 1;
    maxH = game.height / this.tileSize - 1;
    for (dir in adj) {
      val = adj[dir];
      if (val !== null && val.index === -1) {
        avail.push(val);
      }
    }
    return avail;
  },
  placeBlocks: function(size, name) {
    var avail, blob, count, current, last, layer, next, start, type, _results;
    layer = this.map.create("test", this.gameW, this.gameH, this.tileSize, this.tileSize);
    layer.resizeWorld();
    start = this.randTile(this.dungeon, layer);
    count = 0;
    blob = [];
    this.map.putTile(0, start.x, start.y, layer);
    if (this.gameA < size) {
      throw new Error("Requested blob size bigger than game size");
    }
    _results = [];
    while (true) {
      if (typeof current === "undefined" || current === null) {
        current = this.map.getTile(start.x, start.y, layer, true);
      }
      last = null;
      type = 0;
      avail = this.getAvail(current);
      this.map.putTile(type, current.x, current.y, layer);
      if (avail.length > 0) {
        next = this.randElem(avail);
      } else {
        throw new Error("Won't fit!");

        /*
        for block in blob
          a = @getAvail(block)
          console.log a.length
          console.log a.index
         */
      }
      blob.push(current);
      last = current;
      current = next;
      if (!(++count < size)) {
        break;
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  },
  moveSprite: function(ptr) {
    var duration, speed, sprite, tween;
    sprite = this.player;
    speed = 300;
    if (tween && tween.isRunning) {
      tween.stop();
    }
    duration = (game.physics.arcade.distanceToPointer(sprite, ptr) / speed) * 1000;
    tween = game.add.tween(sprite).to({
      x: ptr.x,
      y: ptr.y
    }, duration, Phaser.Easing.Linear.None, true);
  }
};
