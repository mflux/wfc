export interface TileData {
  up: string[];
  right: string[];
  down: string[];
  left: string[];
}

export function RotateClockwise(tileData:TileData) {
  return {
    up: tileData.left,
    right: tileData.up,
    down: tileData.right,
    left: tileData.down,
  };
}

export function RotateCounterClockwise(tileData: TileData) {
  return {
    up: tileData.right,
    right: tileData.down,
    down: tileData.left,
    left: tileData.down,
  };
}