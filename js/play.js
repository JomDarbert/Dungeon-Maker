var playState;

playState = {
  preload: function() {
    game.load.image("player", "assets/star.png");
    game.load.image("ground", "assets/ground.png");
    game.load.image("wall", "assets/wall.png");
    this.map = game.add.tilemap();
    this.tileSize = 32;
    this.gameW = Math.floor(game.width / this.tileSize);
    this.gameH = Math.floor(game.height / this.tileSize);
    this.gameA = this.gameW * this.gameH;
    return this.dungeon = this.createDungeonArray(this.gameW, this.gameH);
  },
  create: function() {
    var groundObj, toBuild, wallObj;
    game.stage.backgroundColor = "#3498db";

    /*
    game.physics.startSystem Phaser.Physics.ARCADE
    
    @player = game.add.sprite(game.world.centerX, game.world.centerY, 'player')
    @player.anchor.setTo 0.5, 0.5
    
    game.physics.arcade.enable @player
    game.input.onDown.add @moveSprite, this
     */
    this.map.addTilesetImage("ground", "ground", 32, 32, null, null, 0);
    this.map.addTilesetImage("wall", "wall", 32, 32, null, null, 1);
    toBuild = [];
    groundObj = {
      name: "ground",
      num: 5,
      gid: 0
    };
    wallObj = {
      name: "ground",
      num: 5,
      gid: 1
    };
    toBuild.push(groundObj);
    toBuild.push(wallObj);
    this.placeBlocks(toBuild);
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
  placeBlocks: function(obj) {
    var a, availTiles, blob, block, count, current, fix, last, layer, next, o, start, _i, _len, _results;
    layer = this.map.create("dungeon", this.gameW, this.gameH, this.tileSize, this.tileSize);
    layer.resizeWorld();
    _results = [];
    for (_i = 0, _len = obj.length; _i < _len; _i++) {
      o = obj[_i];
      start = this.randTile(this.dungeon, layer);
      count = 0;
      blob = [];
      if (this.gameA < o.gid) {
        throw new Error("Requested blob size bigger than game size");
      }
      _results.push((function() {
        var _j, _len1, _results1;
        _results1 = [];
        while (true) {
          if (typeof current === "undefined" || current === null) {
            current = this.map.getTile(start.x, start.y, layer, true);
          }
          last = null;
          availTiles = this.getAvail(current);
          this.map.putTile(o.gid, current.x, current.y, layer);
          if (availTiles.length > 0) {
            next = this.randElem(availTiles);
            blob.push(current);
            last = current;
            current = next;
            count++;
          } else {
            console.log("crap");
            fix = [];
            for (_j = 0, _len1 = blob.length; _j < _len1; _j++) {
              block = blob[_j];
              a = this.getAvail(block);
              if (a.length > 0) {
                fix.push(block);
              }
            }
            if (fix.length > 0) {
              current = this.randElem(fix);
              blob = fix;
            } else {
              console.log("double crap");
              current = this.randTile(this.dungeon, layer);
            }
          }
          if (!(count < o.num)) {
            break;
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      }).call(this));
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
