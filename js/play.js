var playState;

playState = {
  preload: function() {
    game.load.image("player", "assets/star.png");
    game.load.image("ground", "assets/ground.png");
    return this.map = game.add.tilemap();
  },
  create: function() {
    game.stage.backgroundColor = "#3498db";
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    this.player.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(this.player);
    game.input.onDown.add(this.moveSprite, this);
    this.createWorld();
  },
  update: function() {
    return game.physics.arcade.collide(this.player, this.layer);
  },
  createDungeonArray: function(rows, cols) {
    var c, dungeon, r, _i, _j;
    dungeon = new Array();
    for (r = _i = 0; 0 <= rows ? _i <= rows : _i >= rows; r = 0 <= rows ? ++_i : --_i) {
      dungeon.push([]);
      for (c = _j = 0; 0 <= cols ? _j <= cols : _j >= cols; c = 0 <= cols ? ++_j : --_j) {
        dungeon[r].push(null);
      }
    }
    return dungeon;
  },
  pickRandTile: function(arr) {
    var cols, rows, x, y;
    if (!arr || arr.length === 0 || arr[0].length === 0) {
      return false;
    }
    rows = arr.length;
    cols = arr[0].length;
    y = Math.floor(Math.random() * rows);
    x = Math.floor(Math.random() * cols);
    return {
      x: x,
      y: y
    };
  },
  createWorld: function() {
    var cols, dungeon, pick, rows;
    this.map.addTilesetImage("ground");
    this.layer = this.map.create("Tile Layer 1", 10, 10, 32, 32);
    rows = game.height / 32;
    cols = game.width / 32;
    dungeon = this.createDungeonArray(rows, cols);
    pick = this.pickRandTile(dungeon);
    return this.layer.resizeWorld();
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
