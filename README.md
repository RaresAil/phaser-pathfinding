# @raresail/phaser-pathfinding

A phaser pathfinding algorithm using heap data structure

[Documentation](https://raresail.github.io/phaser-pathfinding/)

## Installation

```bash
yarn add @raresail/phaser-pathfinding
```

## Usage

```ts
// Create a grid from the existing tilemap and specify the layers that are obstacles, in the current case the water layer is not walkable
const grid = Grid.createFromMap(map, [waterLayer]);

// The pathfinding instance is created from the grid and is used to get the path between 2 vectors on the map
const pathfinding = new Pathfinding(grid);

// The tl method is used for tile units and the `findPathBetweenPx` method is used to find the path based on pixels
const path = this.pathfinding.findPathBetweenTl(
  new Phaser.Math.Vector2(0, 0),
  new Phaser.Math.Vector2(10, 10)
);

// The path variable will be an array of nodes that can be used to move the "enemy" let's say towards the target
// The props worldX and worldY contains the position in pixels for that specific node
console.log(path[0].worldX, path[0].worldY);
```
