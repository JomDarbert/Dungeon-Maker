var playState,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

window.Selection = (function() {
  function Selection() {}

  return Selection;

})();

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
    game.input.onDown.add(this.select, this);
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
    this.selection = {
      tiles: [],
      sprites: game.add.group()
    };
  },
  update: function() {

    /*
    grp = @dung.nodes[0].group
    if @overlap(@player,grp) and @player.activeTween?
       *console.log @player
      @player.activeTween.stop()
      @player.activeTween = null
     */
  },
  select: function(ptr) {
    var sprite, tile;
    tile = this.map.getTileWorldXY(ptr.x, ptr.y, tileSize, tileSize, this.layer);
    if ((tile != null) && __indexOf.call(this.selection.tiles, tile) >= 0) {
      this.selection.tiles = this.selection.tiles.filter(function(t) {
        return t !== tile;
      });
    } else if (tile != null) {
      this.selection.tiles.push(tile);
      sprite = this.selection.sprites.create(tile.x * tileSize, tile.y * tileSize, 'ground');
      sprite.inputEnabled = true;
      sprite.events.onInputOver.add(this.deselect, this);
    }
    return null;
  },
  deselect: function(sprite, ptr) {
    if (ptr.isDown) {
      return sprite.kill();
    }
  }
};
