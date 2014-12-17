var playState;

playState = {
  preload: function() {
    game.load.image("player", "assets/star.png");
    game.load.image("ground", "assets/ground.png");
    game.load.image("wall", "assets/wall.png");
    game.load.image("water", "assets/water.png");
    game.load.image("lava", "assets/lava.png");
    return this.map = game.add.tilemap();
  },
  create: function() {
    var a, dung, ground, h, lava, nodes, options, t, w, wall, water;
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
    this.map.addTilesetImage("water", "water", 32, 32, null, null, 2);
    this.map.addTilesetImage("lava", "lava", 32, 32, null, null, 3);
    t = 32;
    w = game.width / t;
    h = game.height / t;
    a = w * h;
    ground = {
      name: "ground",
      size: 5,
      gid: 0,
      maxDist: 7
    };
    wall = {
      name: "ground",
      size: 5,
      gid: 1,
      maxDist: 7
    };
    water = {
      name: "water",
      size: 5,
      gid: 2,
      maxDist: 7
    };
    lava = {
      name: "lava",
      size: 5,
      gid: 3,
      maxDist: 7
    };
    nodes = [ground, wall, water, lava];
    options = {
      width: w,
      height: h,
      tileSize: t,
      map: this.map,
      nodes: nodes
    };
    dung = new window.Dungeon(options);
    dung.build();
  },
  update: function() {},
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
