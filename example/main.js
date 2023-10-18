const {
  Pathfinding,
  Grid,
  DistanceMethod
} = require('@raresail/phaser-pathfinding');
const Phaser = require('phaser');

class Example extends Phaser.Scene {
  pathfinding = undefined;
  source = undefined;
  grid = undefined;
  map = undefined;

  simplify = false;
  method = DistanceMethod.Octile;

  methodText = undefined;
  timeText = undefined;
  simText = undefined;

  init() {
    this.input.keyboard?.on(
      `${Phaser.Input.Keyboard.Events.KEY_DOWN}M`,
      () => {
        if (!this.methodText) {
          return;
        }

        if (this.method === DistanceMethod.Octile) {
          this.method = DistanceMethod.Manhattan;
          this.methodText.text = '| Method: Manhattan (Press M)';
        } else if (this.method === DistanceMethod.Manhattan) {
          this.method = DistanceMethod.Chebyshev;
          this.methodText.text = '| Method: Chebyshev (Press M)';
        } else {
          this.method = DistanceMethod.Octile;
          this.methodText.text = '| Method: Octile (Press M)';
        }
      },
      this
    );

    this.input.keyboard?.on(
      `${Phaser.Input.Keyboard.Events.KEY_DOWN}S`,
      () => {
        if (!this.simText) {
          return;
        }

        this.simplify = !this.simplify;
        this.simText.text = `| Simplify: ${this.simplify} (Press S)`;
      },
      this
    );
  }

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
    this.timeText = this.make
      .text({
        x: 10,
        y: 448,
        text: 'Time: -',
        style: {
          color: '#000000'
        }
      })
      .setDepth(1000);
    this.simText = this.make
      .text({
        x: 128,
        y: 448,
        text: '| Simplify: false (Press S)',
        style: {
          color: '#000000'
        }
      })
      .setDepth(1000);

    this.methodText = this.make
      .text({
        x: 395,
        y: 448,
        text: '| Method: Octile (Press M)',
        style: {
          color: '#000000'
        }
      })
      .setDepth(1000);

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

    this.source = this.add.rectangle(24, 24, 24, 24, 0xf1c40f);
  }

  moveToTile(tilePosition) {
    const sourceCurrentTile = this.grid.getTilePositionInWorld(
      new Phaser.Math.Vector2(this.source.x, this.source.y)
    );

    if (!sourceCurrentTile) {
      return;
    }

    this.map.replaceByIndex(
      1,
      2,
      undefined,
      undefined,
      undefined,
      undefined,
      0
    );

    const start = Date.now();
    const path = this.pathfinding.findPathBetweenTl(
      sourceCurrentTile,
      tilePosition,
      this.simplify,
      this.method
    );
    const time = Date.now() - start;
    this.timeText?.setText(`Time: ${time}ms`);

    path.forEach(({ tileX, tileY }) => {
      const t = this.map.getTileAt(tileX, tileY, false, 0);
      if (!t) {
        return;
      }

      t.index = 1;
    });
  }
}

const gameConfig = {
  title: '@raresail/phaser-pathfinding',

  type: Phaser.AUTO,
  scale: {
    width: 744,
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
