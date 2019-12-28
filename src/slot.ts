import { Module } from './module';
import { TileData } from './tile';

export class Slot {
  possibleModules: Module[];

  constructor(allModules: Module[], public x:number, public y:number) {
    this.possibleModules = allModules.slice();
  }

  ReduceEntropy() {
    const index = Math.floor(Math.random() * this.possibleModules.length);
    this.possibleModules.splice(index, 1);
  }
}