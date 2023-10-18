# @raresail/phaser-pathfinding

A phaser pathfinding algorithm using heap data structure

[Documentation](https://raresail.github.io/phaser-pathfinding/)
[Type Definitions](https://raresail.github.io/phaser-pathfinding/module-PhaserPathfinding.html)

## Documentation

For a complete documentation on how to change the distance method used in calculating the path or simplification of the path, check the above link, supported distance methods at this moment:

| Method    | Description                                                                                                                                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Octile    | Is a variant of Chebyshev distance used when movement is allowed along diagonals in addition to horizontal and vertical directions, but diagonal movement has a cost of √2 times that of horizontal or vertical movement |
| Chebyshev | It is a distance metric defined on a vector space where the distance between two vectors is the greatest of their differences along any coordinate dimension                                                             |
| Manhattan | It is a distance metric between two points in an N-dimensional vector space. _**When set to this method, the path won't include diagonal movement**_                                                                     |
|           |                                                                                                                                                                                                                          |

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
