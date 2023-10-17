import _ from 'lodash';
import { Grid } from './grid';
import { Heap } from './heap';
import { Node } from './node';

/**
 * @class
 * @classdesc
 * The Pathfinding class is used to find a path between 2 points in a grid
 * @param {module:PhaserPathfinding.Grid} grid
 * @memberof module:PhaserPathfinding
 */
export class Pathfinding {
  constructor(private readonly grid: Grid) {}

  /**
   * The 2 vectors must point to the position in tile unit not in px
   * @param {Phaser.Math.Vector2} start The start position in tile unit
   * @param {Phaser.Math.Vector2} target The target position in tile unit
   * @return {module:PhaserPathfinding.Node[]} An array of nodes that represent the path, empty if no path was found
   */
  public findPathBetweenTl(
    start: Phaser.Math.Vector2,
    target: Phaser.Math.Vector2
  ): Node[] {
    const startNode = this.grid.getNode(start.x, start.y);
    const targetNode = this.grid.getNode(target.x, target.y);

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
        return this.retracePath(startNode, currentNode);
      }

      for (const neighbor of this.grid.getNeighbors(currentNode)) {
        if (
          neighbor.walkable === false ||
          closedSet[neighbor.name.toString()]
        ) {
          continue;
        }

        const newMoveCost =
          currentNode.gCost + this.getDistance(currentNode, neighbor);

        if (newMoveCost < neighbor.gCost || !openSet.contains(neighbor)) {
          neighbor.gCost = newMoveCost;
          neighbor.hCost = this.getDistance(neighbor, targetNode);
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
   * @return {module:PhaserPathfinding.Node[]} An array of nodes that represent the path, empty if no path was found
   */
  public findPathBetweenPx(
    start: Phaser.Math.Vector2,
    target: Phaser.Math.Vector2
  ): Node[] {
    if (!start || !target) {
      return [];
    }

    const startPosition = this.grid.getTilePositionInWorld(start);
    const targetPosition = this.grid.getTilePositionInWorld(target);

    if (!startPosition || !targetPosition) {
      return [];
    }

    return this.findPathBetweenTl(startPosition, targetPosition);
  }

  private getDistance(first: Node, second: Node) {
    const disX = Math.abs(first.x - second.x);
    const disY = Math.abs(first.y - second.y);

    if (disX > disY) {
      return 14 * disY + 10 * (disX - disY);
    }

    return 14 * disX + 10 * (disY - disX);
  }

  private retracePath(start: Node, target: Node): Node[] {
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

      delete nodeToPush.parent;
      path.push(_.cloneDeep(nodeToPush));
    }

    return path.reverse();
  }
}
