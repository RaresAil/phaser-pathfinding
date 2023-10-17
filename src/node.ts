/* eslint-disable no-use-before-define */
import { HeapItem } from './heap';

export type NodeMatrix = Node[][];

/**
 * @class
 * @classdesc
 * The Node class represents a node in the grid
 * @param {boolean} walkable If false the node is an obstacle
 * @param {number} x The x position in tile unit
 * @param {number} y The y position in tile unit
 * @param {number} width The width of the tile in px
 * @param {number} height The height of the tile in px
 *
 * @property {number} x The x position in tile unit
 * @property {number} y The y position in tile unit
 * @property {number} worldX Only exists on the nodes returned by the pathfinding algorithm and represents the x position in pixels
 * @property {number} worldY Only exists on the nodes returned by the pathfinding algorithm and represents the y position in pixels
 * @property {number} width The width of the tile in px
 * @property {number} height The height of the tile in px
 * @property {boolean} walkable If false the node is an obstacle
 * @memberof module:PhaserPathfinding
 */
export class Node extends HeapItem {
  /**
   * This is used internally by the pathfinding algorithm and it will be undefined on the nodes returned by the pathfinding algorithm
   */
  public parent?: Node;

  /**
   * Only exists on the nodes returned by the pathfinding algorithm and represents the x position in pixels
   */
  public worldX?: number;
  /**
   * Only exists on the nodes returned by the pathfinding algorithm and represents the y position in pixels
   */
  public worldY?: number;

  public get name() {
    return `${this.x},${this.y}`;
  }

  constructor(
    /**
     * If true the node is walkable
     */
    public readonly walkable: boolean,
    /**
     * The x position in tile unit
     */
    public readonly x: number,
    /**
     * The y position in tile unit
     */
    public readonly y: number,
    /**
     * The width of the tile in px
     */
    public readonly width: number,
    /**
     * The height of the tile in px
     */
    public readonly height: number
  ) {
    super();
  }

  /**
   *
   * This is used internally by the pathfinding algorithm
   * @param {module:PhaserPathfinding.Node} other Another node to compare the cost
   * @return {number}
   */
  public compare(other: Node): number {
    if (!other) {
      return -1;
    }

    let compare = this.fCost - other.fCost;
    if (compare === 0) {
      compare = this.hCost - other.hCost;
    }

    return -compare;
  }

  /**
   *
   * This is used internally by the pathfinding algorithm
   * @param {module:PhaserPathfinding.Node} other Another node to compare the equality
   * @return {boolean}
   */
  public equals(other: Node): boolean {
    if (!other) {
      return false;
    }

    if (!(other instanceof Node)) {
      return false;
    }

    return this.x === other.x && this.y === other.y;
  }
}
