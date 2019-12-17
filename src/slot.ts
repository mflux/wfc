import { Module } from './module';

export class Slot {
  possibleModules: Module[];

  possibleTiles = {
    up: new Set<string>(),
    right: new Set<string>(),
    down: new Set<string>(),
    left: new Set<string>(),
  };

  constructor(allModules: Module[], public x:number, public y:number) {
    this.possibleModules = allModules.slice();
    this.UpdatePossibleTiles();
  }

  ReduceEntropy() {
    const index = Math.floor(Math.random() * this.possibleModules.length);
    this.possibleModules.splice(index, 1);
    this.UpdatePossibleTiles();
  }

  UpdatePossibleTiles() {
    this.possibleTiles = {
      up: new Set<string>(),
      right: new Set<string>(),
      down: new Set<string>(),
      left: new Set<string>(),
    };
    this.possibleModules.forEach(module => {
      if (module.tileData.up) {
        module.tileData.up.forEach((s)=>this.possibleTiles.up.add(s));
      }
      if (module.tileData.right) {
        module.tileData.right.forEach((s)=>this.possibleTiles.right.add(s));
      }
      if (module.tileData.down) {
        module.tileData.down.forEach((s)=>this.possibleTiles.down.add(s));
      }
      if (module.tileData.left) {
        module.tileData.left.forEach((s)=>this.possibleTiles.left.add(s));
      }
    });
  }
}