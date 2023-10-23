# @raresail/phaser-pathfinding

A phaser pathfinding algorithm using heap data structure

[Documentation](https://raresail.github.io/phaser-pathfinding/)
[Type Definitions](https://raresail.github.io/phaser-pathfinding/module-PhaserPathfinding.html)

## Documentation

For a complete documentation on how to change the distance method used in calculating the path or simplification of the path, check the above link, supported distance methods at this moment:

| Method    | Description                                                                                                                                                                                                                            |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Octile    | (Recommended) Is a variant of Chebyshev distance used when movement is allowed along diagonals in addition to horizontal and vertical directions, but diagonal movement has a cost of √2 times that of horizontal or vertical movement |
| Chebyshev | It is a distance metric defined on a vector space where the distance between two vectors is the greatest of their differences along any coordinate dimension                                                                           |
| Manhattan | It is a distance metric between two points in an N-dimensional vector space. _**When set to this method, and if the diagonal is disabled, the path won't include zig zag moves**_                                                      |
|           |                                                                                                                                                                                                                                        |

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

// The px method is used for pixels and the `findPathBetweenTl` method is used to find the path based on tile units
const startPos = new Phaser.Math.Vector2(0, 0);
const path = pathfinding.findPathBetweenPx(
  startPos,
  new Phaser.Math.Vector2(200, 200)
);

// Get the first node to move to and remove it from the path
let targetNode = path.shift();

const movingSpeed = 250; // 250 px per second
let tween = undefined;

// Method to call when you want to stop follow
const stopFollowingPath = () => {
    targetNode = undefined;
    path = undefined;
    tween?.stop();
    tween = undefined;
}

// The path variable will be an array of nodes that can be used to move the "enemy" let's say towards the target
// The props worldX and worldY contains the position in pixels for that specific node
// This method will recursively move each node until the path is reached
const moveOneNode = () => {
  moveOneNode() {
    if (!targetNode) {
      stopFollowingPath();
      return;
    }

    let speed = movingSpeed;
    if (
      startPos.x !== targetNode.worldX &&
      startPos.y !== targetNode.worldY
    ) {
      // On diagonal, the movement is faster so to normalize it we need to divide by sqrt 2
      speed /= Math.sqrt(2);
    }

    tween = scene.tweens.add({
      targets: THE_ELEMENT_THAT_MOVES,
      x: targetNode.worldX,
      y: targetNode.worldY,
      ease: 'Linear',
      yoyo: false,
      repeat: 0,
      duration: speed,
      onComplete: () => {
        if (path?.length) {
          targetNode = path.shift();
          moveOneNode();
        }
      }
    });
  }
}


moveOneNode();
```
