import Phaser from 'phaser';
import _ from 'lodash';

import { Node, NodeMatrix } from './node';

/**
 * @class
 * @classdesc
 * The grid class is used to create a grid that the pathfinding algorithm can use
 * @param {number} sizeX The width of the grid in tile units
 * @param {number} sizeY The height of the grid in tile units
 * @param {number} walkableLayerIndex
 * @memberof module:PhaserPathfinding
 */
export class Grid {
  private readonly grid: NodeMatrix = [];
  private map?: Phaser.Tilemaps.Tilemap;

  constructor(
    private readonly sizeX: number,
    private readonly sizeY: number,
    private readonly walkableLayerIndex: number
  ) {}

  /**
   * Gets a node from the grid at a specific position in tile units or undefined if the position is not in the grid
   * @param {number} x The x position in tile units
   * @param {number} y The y position in tile units
   * @return {module:PhaserPathfinding.Node?} The node at the position or undefined if the position is not in the grid
   */
  public getNode(x: number, y: number): Node | undefined {
    return _.cloneDeep(
      this.grid[parseInt(x.toString())]?.[parseInt(y.toString())]
    );
  }

  /**
   * This method is used internally by the pathfinding algorithm
   * @ignore
   */
  public getNeighbors(node: Node): Node[] {
    const neighbors: Node[] = [];

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (x === 0 && y === 0) {
          continue;
        }

        const posCheck = new Phaser.Math.Vector2(node.x + x, node.y + y);

        if (
          posCheck.x >= 0 &&
          posCheck.x < this.sizeX &&
          posCheck.y >= 0 &&
          posCheck.y < this.sizeY
        ) {
          const neighbor = this.getNode(posCheck.x, posCheck.y);
          if (neighbor) {
            neighbors.push(neighbor);
          }
        }
      }
    }

    return neighbors;
  }

  /**
   * Gets the position in tile units from the position in pixels or undefined if the position is not in the walkable grid
   * @param {Phaser.Math.Vector2} position The position in pixels
   * @return {Phaser.Math.Vector2?} The position in tile unit or undefined if the position is not in the walkable grid
   */
  public getTilePositionInWorld(
    position: Phaser.Math.Vector2
  ): Phaser.Math.Vector2 | undefined {
    const tile = this.map?.getTileAtWorldXY(
      position.x,
      position.y,
      false,
      undefined,
      this.walkableLayerIndex
    );
    if (!tile) {
      return;
    }

    return new Phaser.Math.Vector2(tile.x, tile.y);
  }

  /**
   * Gets the position in pixels for a specific node
   * @param {module:PhaserPathfinding.Node} node The node to get the position from
   * @return {Phaser.Math.Vector2?} The position in the grid in pixels
   */
  public getWorldPositionFromNode(node: Node): Phaser.Math.Vector2 | undefined {
    const tile = this.map?.getTileAt(
      node.x,
      node.y,
      false,
      this.walkableLayerIndex
    );

    if (!tile) {
      return;
    }

    return new Phaser.Math.Vector2(tile.pixelX, tile.pixelY);
  }

  /**
   * Creates a new grid from a tilemap
   * @param {Phaser.Tilemaps.Tilemap} map The tilemap to create the grid from
   * @param {Phaser.Tilemaps.TilemapLayer[]} obstacles An array of tilemap layers that are considered as obstacles
   * @param {number} [walkableLayerIndex=0] - The layer index that is considered as walkable Default: 0
   * @return {module:PhaserPathfinding.Grid} The created grid
   */
  public static createFromMap(
    map: Phaser.Tilemaps.Tilemap,
    obstacles: Phaser.Tilemaps.TilemapLayer[],
    walkableLayerIndex: number = 0
  ): Grid {
    const base = map.getLayer(walkableLayerIndex);
    if (!base) {
      throw new Error('No base layer found');
    }

    const grid = new Grid(base.width, base.height, walkableLayerIndex).setMap(
      map
    );

    obstacles.forEach(({ layer: { data } }) => {
      data.forEach((row) => {
        row.forEach((tile) => {
          if (tile.index === -1) {
            return;
          }

          grid.addNode(tile.x, tile.y, false, tile.width, tile.height);
        });
      });
    });

    base.data.forEach((row) => {
      row.forEach((tile) => {
        if (tile.index === -1) {
          return;
        }

        grid.addNode(tile.x, tile.y, true, tile.width, tile.height);
      });
    });

    return grid;
  }

  private setMap(map: Phaser.Tilemaps.Tilemap): this {
    this.map = map;
    return this;
  }

  private addNode(
    x: number,
    y: number,
    walkable: boolean,
    width: number,
    height: number
  ): void {
    if (this.getNode(x, y)) {
      return;
    }

    this.grid[parseInt(y.toString())] = this.grid[parseInt(y.toString())] ?? [];
    this.grid[parseInt(y.toString())][parseInt(x.toString())] = new Node(
      walkable,
      x,
      y,
      width,
      height
    );
  }
}
