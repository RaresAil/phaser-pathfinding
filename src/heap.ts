/* eslint-disable no-use-before-define */
export abstract class HeapItem {
  public abstract compare(other: HeapItem): number;
  public abstract equals(other: HeapItem): boolean;
  public abstract parent?: HeapItem;

  public index: number = -1;
  public gCost: number = 0;
  public hCost: number = 0;
  public get fCost() {
    return this.gCost + this.hCost;
  }
}

export class Heap<T extends HeapItem> {
  private items: T[] = [];
  private currentCount = 0;

  public get length() {
    return this.items.length;
  }

  public add(item: T) {
    item.index = this.currentCount;
    this.items[this.currentCount] = item;
    this.sortUp(item);
    this.currentCount++;
  }

  public removeFirst(): T {
    const first = this.items[0];
    this.currentCount--;
    this.items[0] = this.items[this.currentCount];
    this.items[0].index = 0;
    this.sortDown(first);
    return first;
  }

  public contains(item: T): boolean {
    if (item == null) {
      return false;
    }

    const check = this.items[item.index];
    if (!check) {
      return false;
    }

    return check.equals(item);
  }

  public updateItem(item: T) {
    this.sortUp(item);
  }

  private sortUp(item: T) {
    let parentIndex = (item.index - 1) / 2;
    while (true) {
      const parent: T = this.items[parseInt(parentIndex.toString())];
      if (item.compare(parent) <= 0) {
        break;
      }

      this.swap(item, parent);
      parentIndex = (item.index - 1) / 2;
    }
  }

  private sortDown(item: T) {
    while (true) {
      const leftChildIndex = item.index * 2 + 1;
      const rightChildIndex = item.index * 2 + 2;

      if (leftChildIndex < this.currentCount) {
        let swapIndex = leftChildIndex;

        if (rightChildIndex < this.currentCount) {
          if (
            this.items[parseInt(leftChildIndex.toString())].compare(
              this.items[parseInt(rightChildIndex.toString())]
            ) < 0
          ) {
            swapIndex = rightChildIndex;
          }
        }

        const child = this.items[parseInt(swapIndex.toString())];
        if (item.compare(child) < 0) {
          this.swap(item, child);
        } else {
          break;
        }
      } else {
        break;
      }
    }
  }

  private swap(first: T, second: T) {
    this.items[first.index] = second;
    this.items[second.index] = first;
    const itemAIndex = first.index;
    first.index = second.index;
    second.index = itemAIndex;
  }
}
