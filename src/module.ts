import { TileData, RotateClockwise, RotateCounterClockwise } from './tile';

export class Module {

  canvas: HTMLCanvasElement;

  constructor(public name: string, path: string, public tileData:TileData, degrees: number = 0) {
    this.canvas = document.createElement('canvas');

    const radians = degrees * Math.PI / 180;

    const image = document.createElement('img') as HTMLImageElement;
    image.addEventListener('load', () => {
      this.canvas.width = image.width;
      this.canvas.height = image.height;
      const ctx = this.canvas.getContext('2d');

      // rotate from center pivot
      ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      ctx.rotate(radians);
      ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
      ctx.drawImage(image, 0, 0);
    });

    image.setAttribute('src', path);

    switch (degrees) {
      case 90:
        this.tileData = RotateClockwise(this.tileData);
        break;
      case 180:
        this.tileData = RotateClockwise(this.tileData);
        this.tileData = RotateClockwise(this.tileData);
        break;
      case 270:
          this.tileData = RotateCounterClockwise(this.tileData);
        break;
      case 0:
      default:
        break;
    }

    this.name = generateId(name, degrees);

    console.log(this.name, this.tileData);
  }
}

function generateId(name: string, degrees: number) {
  return `${name}_${degrees.toString()}`;
}

export const PossibleRotations = [0, 90, 180, 270];