import { Slot } from './slot';
import { Module } from './module';

const adjacentOffsets = [
  { x: -1, y: 0, direction: 'left' },
  { x: 1, y: 0, direction: 'right' },
  { x: 0, y: -1, direction: 'up' },
  { x: 0, y: 1, direction: 'down' },
];

const oppositeDirection: { [index: string]: string } = {
  'left': 'right',
  'right': 'left',
  'up': 'down',
  'down': 'up',
};

export class Grid {
  slots: Slot[] = [];
  constructor(modules: Module[], public width: number, public height: number) {
    const length = width * height;
    for (let y = 0; y < height; y++){
      for (let x = 0; x < width; x++){
        this.slots.push(new Slot(modules, x, y));
      }
    }
  }

  * indices() {
    for (let y = 0; y < this.height; y++){
      for (let x = 0; x < this.width; x++){
        const index = x + this.width * y;
        yield {
          x,
          y,
          index,
          slot: this.slots[index],
        };
      }
    }
  }

  * adjacentIndices(x: number, y: number) {
    for (const offset of adjacentOffsets) {
      const ox = offset.x + x;
      if (ox < 0 || ox >= this.width) {
        continue;
      }

      const oy = offset.y + y;
      if (oy < 0 || oy >= this.height) {
        continue;
      }

      const index = ox + this.width * oy;
      yield {
        x: ox,
        y: oy,
        index,
        slot: this.slots[index],
        direction: offset.direction,
        oppositeDirection: oppositeDirection[offset.direction],
      };
    }
  }

  getSlot(x: number, y: number) {
    x = Math.floor(x);
    y = Math.floor(y);
    const index = x + this.width * y;
    return this.slots[index];
  }
}