var playState;

playState = {
  preload: function() {
    game.load.image("player", "assets/star.png");
    game.load.image("ground", "assets/ground.png");
    game.load.image("wall", "assets/wall.png");
    game.load.image("water", "assets/water.png");
    game.load.image("lava", "assets/lava.png");
    this.map = game.add.tilemap();
    return game.stage.backgroundColor = "#2d2d2d";
  },
  create: function() {
    var a, ground, h, lava, nodes, options, w, wall, water;
    this.map.addTilesetImage("ground", "ground", 32, 32, null, null, 0);
    this.map.addTilesetImage("wall", "wall", 32, 32, null, null, 1);
    this.map.addTilesetImage("water", "water", 32, 32, null, null, 2);
    this.map.addTilesetImage("lava", "lava", 32, 32, null, null, 3);
    w = game.width / tileSize;
    h = game.height / tileSize;
    a = w * h;
    ground = {
      name: "ground",
      size: 15,
      gid: 0,
      maxRadius: 2,
      fillHoles: true
    };
    wall = {
      name: "wall",
      size: 13,
      gid: 1,
      maxRadius: 2,
      fillHoles: true
    };
    water = {
      name: "water",
      size: 13,
      gid: 2,
      maxRadius: 2,
      fillHoles: true
    };
    lava = {
      name: "lava",
      size: 13,
      gid: 3,
      maxRadius: 2,
      fillHoles: true
    };
    nodes = [ground, wall, water, lava];
    options = {
      width: w,
      height: h,
      tileSize: tileSize,
      map: this.map,
      nodes: nodes
    };
    this.dung = new window.Dungeon(options);
    this.dung.build();
    this.selection = [];
  },
  update: function() {
    var esc, ptr, tile, _i, _len, _ref;
    ptr = game.input.mousePointer;
    esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    if (esc.isDown) {
      _ref = this.selection;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tile = _ref[_i];
        this.map.putTile(tile.index, tile.x, tile.y);
      }
      this.selection = [];
    }
    if (ptr.isDown) {
      return this.map.putTile(0, ptr.x, ptr.y);

      /*
      tile = @map.getTileWorldXY(ptr.x,ptr.y,tileSize,tileSize,@layer)
      if tile? and tile not in @selection
        @selection.push tile
        new_tile = tile
        new_tile.index = 0
        @map.putTile(new_tile,tile.x,tile.y)
        console.log @selection
      if tile? and tile in @selection
        return
         *unselect
       */
    }
  }
};
