const { Pathfinding, Grid } = require('@raresail/phaser-pathfinding');
const Phaser = require('phaser');

class Example extends Phaser.Scene {
  pathfinding = undefined;
  source = undefined;
  grid = undefined;
  map = undefined;

  preload() {
    this.load.image('map', 'map.png');
    this.input.on(
      'pointerup',
      (pointer) => {
        if (!this.map || !this.source) {
          return;
        }

        const tilePosition = this.grid.getTilePositionInWorld(
          new Phaser.Math.Vector2(pointer.worldX, pointer.worldY)
        );

        if (!tilePosition) {
          return;
        }

        this.moveToTile(tilePosition);
      },
      this
    );
  }

  create() {
    const tileSize = 24;
    const walkableData = [
      [
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2
      ],
      [
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2
      ],
      [
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2
      ],
      [
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2
      ],
      [
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2
      ],
      [
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2
      ],
      [
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2
      ],
      [
        2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2
      ],
      [
        2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2
      ],
      [
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2
      ],
      [
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2
      ],
      [
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2
      ],
      [
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0
      ],
      [
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2
      ],
      [
        2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2
      ],
      [
        2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2
      ],
      [
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2
      ],
      [
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2
      ]
    ];

    const obstacles = [];

    this.map = this.make.tilemap({
      data: walkableData.map((row, y) =>
        row.map((tile, x) => {
          if (tile === 0) {
            obstacles.push({ x, y });
            return -1;
          }

          return tile;
        })
      ),
      tileWidth: tileSize,
      tileHeight: tileSize
    });

    this.map.addTilesetImage('map', 'map', tileSize, tileSize);
    this.map.createLayer(0, 'map', 0, 0);

    const obstaclesLayer = this.map.createBlankLayer('obs', 'map');
    obstacles.forEach(({ x, y }) => {
      obstaclesLayer
        .putTileAt(0, x, y)
        .setCollision(true, true, true, true, true);
    });
    obstaclesLayer.setCollisionByProperty({ collides: true });

    this.grid = Grid.createFromMap(this.map, [obstaclesLayer]);
    this.pathfinding = new Pathfinding(this.grid);

    console.log(this.pathfinding);

    this.source = this.add.rectangle(24, 24, 24, 24, 0xf1c40f);
  }

  async moveToTile(tilePosition) {
    const sourceCurrentTile = this.grid.getTilePositionInWorld(
      new Phaser.Math.Vector2(this.source.x, this.source.y)
    );

    if (!sourceCurrentTile) {
      return;
    }

    console.log('findPathBetweenTl', tilePosition);
    const path = await this.pathfinding.findPathBetweenTl(
      sourceCurrentTile,
      tilePosition
    );
    console.log(path);
  }
}

const gameConfig = {
  title: '@raresail/phaser-pathfinding',

  type: Phaser.AUTO,
  scale: {
    width: 800,
    height: 480,
    mode: Phaser.Scale.NONE,
    zoom: 1
  },

  render: {
    antialias: false,
    pixelArt: true
  },

  physics: {
    default: 'arcade',
    arcade: {
      debug: process.env.NODE_ENV !== 'production'
    }
  },

  parent: 'content',
  backgroundColor: '#F2F1F0',

  scene: Example
};

export const game = new Phaser.Game(gameConfig);
