import _ from 'lodash';

import { Node, NodeMatrix } from './node';
import { PathNode } from './path-node';
import { Grid } from './grid';
import { Heap } from './heap';

/**
 * @class
 * @classdesc
 * The Pathfinding class is used to find a path between 2 points in a grid
 * @param {module:PhaserPathfinding.Grid} grid
 * @memberof module:PhaserPathfinding
 */
export class Pathfinding {
  private readonly matrixClone: NodeMatrix = [];

  constructor(private readonly grid: Grid) {
    this.matrixClone = grid.cloneMatrix();
  }

  /**
   * The 2 vectors must point to the position in tile unit not in px
   * @param {Phaser.Math.Vector2} start The start position in tile unit
   * @param {Phaser.Math.Vector2} target The target position in tile unit
   * @param {boolean} [simplify=false] If true the path will return only the nodes that change direction
   * @return {module:PhaserPathfinding.PathNode[]} An array of nodes that represent the path, empty if no path was found
   */
  public findPathBetweenTl(
    start: Phaser.Math.Vector2,
    target: Phaser.Math.Vector2,
    simplify: boolean = false
  ): PathNode[] {
    const pathMatrix = _.cloneDeep(this.matrixClone);
    const startNode = this.grid.getNode(start.x, start.y, pathMatrix);
    const targetNode = this.grid.getNode(target.x, target.y, pathMatrix);

    if (!startNode || startNode.walkable === false) {
      return [];
    }

    if (!targetNode || targetNode.walkable === false) {
      return [];
    }

    const openSet = new Heap<Node>();
    const closedSet: Record<string, true> = {};

    openSet.add(startNode);

    while (openSet.length > 0) {
      const currentNode = openSet.removeFirst();
      closedSet[currentNode.name.toString()] = true;

      if (currentNode.equals(targetNode)) {
        return this.retracePath(startNode, currentNode, simplify);
      }

      for (const neighbor of this.grid.getNeighbors(currentNode, pathMatrix)) {
        if (
          neighbor.walkable === false ||
          closedSet[neighbor.name.toString()]
        ) {
          continue;
        }

        const newMoveCost =
          currentNode.gCost + this.getChebyshevDistance(currentNode, neighbor);

        if (newMoveCost < neighbor.gCost || !openSet.contains(neighbor)) {
          neighbor.gCost = newMoveCost;
          neighbor.hCost = this.getChebyshevDistance(neighbor, targetNode);
          neighbor.parent = currentNode;

          if (!openSet.contains(neighbor)) {
            openSet.add(neighbor);
          } else {
            openSet.updateItem(neighbor);
          }
        }
      }
    }

    return [];
  }

  /**
   * The 2 vectors must point to the position in pixels
   * @param {Phaser.Math.Vector2} start The start position in pixels
   * @param {Phaser.Math.Vector2} target The target position in tile unit
   * @param {boolean} [simplify=false] If true the path will return only the nodes that change direction
   * @return {module:PhaserPathfinding.PathNode[]} An array of nodes that represent the path, empty if no path was found
   */
  public findPathBetweenPx(
    start: Phaser.Math.Vector2,
    target: Phaser.Math.Vector2,
    simplify: boolean = false
  ): PathNode[] {
    if (!start || !target) {
      return [];
    }

    const startPosition = this.grid.getTilePositionInWorld(start);
    const targetPosition = this.grid.getTilePositionInWorld(target);

    if (!startPosition || !targetPosition) {
      return [];
    }

    return this.findPathBetweenTl(startPosition, targetPosition, simplify);
  }

  // Method not currently used but could be useful in the future
  private getDistance(first: Node, second: Node) {
    const disX = Math.abs(first.x - second.x);
    const disY = Math.abs(first.y - second.y);

    if (disX > disY) {
      return 14 * disY + 10 * (disX - disY);
    }

    return 14 * disX + 10 * (disY - disX);
  }

  private getChebyshevDistance(first: Node, second: Node) {
    const disX = Math.abs(first.x - second.x);
    const disY = Math.abs(first.y - second.y);

    return 10 * Math.max(disX, disY);
  }

  private retracePath(
    start: Node,
    target: Node,
    simplify: boolean
  ): PathNode[] {
    const path: Node[] = [];
    let currentNode = target;

    while (!currentNode.equals(start)) {
      if (!currentNode.parent) {
        throw new Error('PANIC No parent found');
      }

      const pos = this.grid.getWorldPositionFromNode(currentNode);
      currentNode.worldX = pos?.x;
      currentNode.worldY = pos?.y;

      const nodeToPush = currentNode;
      currentNode = currentNode.parent;

      path.push(nodeToPush);
    }

    return this.normalizePath(path, simplify).reverse();
  }

  private normalizePath(path: Node[], simplify: boolean): PathNode[] {
    if (!simplify) {
      return path.map(
        (node) =>
          new PathNode(
            node.x,
            node.y,
            node.worldX!,
            node.worldY!,
            node.width,
            node.height
          )
      );
    }

    const normalizedPath: PathNode[] = [];
    let oldPosition = new Phaser.Math.Vector2();

    for (let i = 1; i < path.length; i++) {
      const newPosition = new Phaser.Math.Vector2(
        path[i - 1].x - path[parseInt(i.toString())].x,
        path[i - 1].y - path[parseInt(i.toString())].y
      );

      if (!oldPosition.equals(newPosition)) {
        const node = path[i - 1];
        normalizedPath.push(
          new PathNode(
            node.x,
            node.y,
            node.worldX!,
            node.worldY!,
            node.width,
            node.height
          )
        );
      }

      oldPosition = newPosition;
    }

    return normalizedPath;
  }
}
