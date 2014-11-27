
/*
Need a fix for spidering resources
 */
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
    return this.gameA = this.gameW * this.gameH;
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
      num: 30,
      gid: 0
    };
    wallObj = {
      name: "ground",
      num: 30,
      gid: 1
    };
    toBuild.push(groundObj);
    toBuild.push(wallObj);
    this.placeBlocks(toBuild);
  },
  update: function() {},
  randOpenTile: function(layer) {
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
  },
  randElem: function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },
  getAvail: function(tile) {
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
  },
  placeBlocks: function(node) {
    var available, count, current, layer, log, o, _i, _len, _results;
    layer = this.map.create("dungeon", this.gameW, this.gameH, this.tileSize, this.tileSize);
    layer.resizeWorld();
    _results = [];
    for (_i = 0, _len = node.length; _i < _len; _i++) {
      o = node[_i];
      count = 0;
      log = [];
      if (this.gameA < o.gid) {
        throw new Error("Requested node size bigger than game size");
      }
      _results.push((function() {
        var _results1;
        _results1 = [];
        while (true) {
          if (typeof current === "undefined" || current === null) {
            current = {
              tile: this.randOpenTile(layer),
              dir: null
            };
          }
          this.map.putTile(o.gid, current.tile.x, current.tile.y, layer);
          available = this.getAvail(current.tile);
          if (available.length > 0) {
            log.push(current);
            current = this.randElem(available);
            count++;
          } else {
            log = log.filter(function(b) {
              if (playState.getAvail(b.tile).length > 0) {
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
          if (count >= o.num || current === false) {
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
