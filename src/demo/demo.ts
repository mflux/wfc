import { Module, PossibleRotations } from '../module';
import { Grid } from '../grid';
import { Slot } from '../slot';
import { TileData } from '../tile';

async function main() {
  const tilesetPath = 'tilesets/example';

  const modules: Module[] = [];

  const tilesetJSON = await loadJSON(`${tilesetPath}/tileset.json`);

  const tiles = tilesetJSON['tiles'] as { [index: string]: TileData };
  for (let key in tiles) {
    const pathToImage = `${tilesetPath}/${key}.png`;
    const tileData = tiles[key];
    PossibleRotations.forEach(degrees => {
      modules.push(new Module(key, pathToImage, tileData, degrees));
    });
  }

  console.log(modules);

  const moduleSize = 16;
  const slotsWidth = 16;
  const slotsHeight = 16;
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  canvas.width = slotsWidth * moduleSize;
  canvas.height = slotsHeight * moduleSize;
  canvas.style.display = 'block';

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const grid = new Grid(modules, slotsWidth, slotsHeight);
  setTimeout(() => {
    Render(grid, ctx, slotsWidth, slotsHeight, moduleSize)
  }, 150);

  RandomlyReduceEntropy(grid);

  function step() {
    const stable = Collapse(grid);
    if(stable){
      RandomlyReduceEntropy(grid);
    }
  }

  document.querySelector('#step').addEventListener('click', () => {
    step();
    Render(grid, ctx, slotsWidth, slotsHeight, moduleSize);
  });

  function animate(){
    for(let i=0; i<6; i++){
      step();
    }
    Render(grid, ctx, slotsWidth, slotsHeight, moduleSize);
    requestAnimationFrame(animate);
  }

  document.querySelector('#play').addEventListener('click', () => {
    animate();
  });

  canvas.addEventListener('click', e => {
    const { offsetX, offsetY } = e;
    const slotX = offsetX / moduleSize;
    const slotY = offsetY / moduleSize;
    const index = grid.getSlot(slotX, slotY);
    console.log(index);
  });
}

function Render(grid: Grid, ctx: CanvasRenderingContext2D, slotsWidth: number, slotsHeight: number, moduleSize: number) {
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;

  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  for (const index of grid.indices()) {
    const { x, y } = index;
    const alpha = 1 / index.slot.possibleModules.length;
    ctx.globalAlpha = alpha;

    index.slot.possibleModules.forEach(module => {
      const ix = x * module.canvas.width;
      const iy = y * module.canvas.height;
      ctx.drawImage(module.canvas, ix, iy);
    });
  }
}

function RandomlyReduceEntropy(grid:Grid) {
  const lowestSlots = FindLowestEntropySlots(grid.slots);
  if (lowestSlots.length <= 0) {
    return;
  }
  const randomIndex = Math.floor(Math.random() * lowestSlots.length);
  const lowestSlot = lowestSlots[randomIndex];
  lowestSlot.ReduceEntropy();
}

function Collapse(grid: Grid) {
  let stable = true;

  for (const index of grid.indices()) {
    if (index.slot.possibleModules.length <= 1) {
      continue;
    }
    for (const neighbor of grid.adjacentIndices(index.x, index.y)) {
      const neighborSlot = neighbor.slot;
      index.slot.possibleModules = index.slot.possibleModules.filter(module => {
        const outgoing: boolean = module.tileData[neighbor.direction];
        const keep = neighborSlot.possibleModules.some(neighborModule => {
          const incoming: boolean = neighborModule.tileData[neighbor.oppositeDirection];
          return incoming === outgoing;
        });

        stable = keep && stable;

        return keep;
      });
    }
  }

  return stable;
}

function FindLowestEntropySlots(slots: Slot[]) {
  let lowestCount = Number.MAX_VALUE;
  let lowestSlots: Slot[] = [];

  slots.forEach(slot => {
    if (slot.possibleModules.length <= 1) {
      return;
    }

    if (slot.possibleModules.length < lowestCount) {
      lowestCount = slot.possibleModules.length;
      lowestSlots = [slot];
    }
    else if (slot.possibleModules.length == lowestCount) {
      lowestSlots.push(slot);
    }
  });

  return lowestSlots;
}

function loadJSON(path: string) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(xhr);
        }
      }
    };
    xhr.open("GET", path, true);
    xhr.send();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  main();
});