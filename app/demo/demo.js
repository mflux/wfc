var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Module } from "../module.js";
import { Grid } from "../grid.js";
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const tilesetPath = 'tilesets/example';
        const modules = [];
        const tilesetJSON = yield loadJSON(`${tilesetPath}/tileset.json`);
        const tiles = tilesetJSON['tiles'];
        for (let key in tiles) {
            const pathToImage = `${tilesetPath}/${key}.png`;
            const tileData = tiles[key];
            const degrees = 0;
            // PossibleRotations.forEach(degrees => {
            modules.push(new Module(key, pathToImage, tileData, degrees));
            // });
        }
        console.log(modules);
        // console.log(modules);
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
            Render(grid, ctx, slotsWidth, slotsHeight, moduleSize);
        }, 150);
        RandomlyReduceEntropy(grid);
        function step() {
            if (Collapse(grid) === false) {
                RandomlyReduceEntropy(grid);
            }
            ;
            Render(grid, ctx, slotsWidth, slotsHeight, moduleSize);
        }
        document.querySelector('#step').addEventListener('click', () => {
            step();
        });
        document.querySelector('#play').addEventListener('click', () => {
            setInterval(() => {
                step();
            }, 10);
        });
        canvas.addEventListener('click', e => {
            const { offsetX, offsetY } = e;
            const slotX = offsetX / moduleSize;
            const slotY = offsetY / moduleSize;
            const index = grid.getSlot(slotX, slotY);
            console.log(index);
        });
    });
}
function Render(grid, ctx, slotsWidth, slotsHeight, moduleSize) {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // ctx.strokeStyle = 'black 1px';
    // ctx.fillStyle = 'none';
    // for (let y = 0; y < slotsHeight; y++){
    //   const ypx = y * moduleSize;
    //   ctx.beginPath();
    //   ctx.moveTo(0, ypx);
    //   ctx.lineTo(canvasWidth, ypx);
    //   ctx.closePath();
    //   ctx.stroke();
    // }
    // for (let x = 0; x < slotsWidth; x++){
    //   const xpx = x * moduleSize;
    //   ctx.beginPath();
    //   ctx.moveTo(xpx, 0);
    //   ctx.lineTo(xpx, canvasHeight);
    //   ctx.closePath();
    //   ctx.stroke();
    // }
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
function RandomlyReduceEntropy(grid) {
    const lowestSlots = FindLowestEntropy(grid.slots);
    if (lowestSlots.length <= 0) {
        return;
    }
    const randomIndex = Math.floor(Math.random() * lowestSlots.length);
    const lowestSlot = lowestSlots[randomIndex];
    lowestSlot.ReduceEntropy();
}
function Collapse(grid) {
    let didCollapse = false;
    for (const index of grid.indices()) {
        if (index.slot.possibleModules.length <= 1) {
            // Paradox.
            continue;
        }
        for (const neighbor of grid.adjacentIndices(index.x, index.y)) {
            const toThisIndexDirection = neighbor.oppositeDirection;
            index.slot.possibleModules = index.slot.possibleModules.filter(module => {
                const moduleName = module.name;
                const neighborTilesMakingThisPossible = neighbor.slot.possibleTiles[toThisIndexDirection];
                if (neighborTilesMakingThisPossible == undefined) {
                    console.log(false);
                    didCollapse = false;
                    return false;
                }
                const keep = Array.from(neighborTilesMakingThisPossible).indexOf(moduleName) >= 0;
                didCollapse = keep && didCollapse;
                return keep;
            });
        }
    }
    return didCollapse;
}
function FindLowestEntropy(slots) {
    let lowestCount = Number.MAX_VALUE;
    let lowestSlots = [];
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
function loadJSON(path) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                }
                else {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVtby5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbImRlbW8vZGVtby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFxQixxQkFBa0I7QUFDdEQsT0FBTyxFQUFFLElBQUksRUFBRSxtQkFBZ0I7QUFJL0IsU0FBZSxJQUFJOztRQUNqQixNQUFNLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQztRQUV2QyxNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7UUFFN0IsTUFBTSxXQUFXLEdBQUcsTUFBTSxRQUFRLENBQUMsR0FBRyxXQUFXLGVBQWUsQ0FBQyxDQUFDO1FBRWxFLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQWtDLENBQUM7UUFDcEUsS0FBSyxJQUFJLEdBQUcsSUFBSSxLQUFLLEVBQUU7WUFDckIsTUFBTSxXQUFXLEdBQUcsR0FBRyxXQUFXLElBQUksR0FBRyxNQUFNLENBQUM7WUFDaEQsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVCLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQztZQUNsQix5Q0FBeUM7WUFDdkMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLE1BQU07U0FDUDtRQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFckIsd0JBQXdCO1FBRXhCLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUN0QixNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDdEIsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFbEMsTUFBTSxDQUFDLEtBQUssR0FBRyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUN6QyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFFL0IsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQyxHQUFHLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDO1FBR2xDLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDeEQsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNkLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUE7UUFDeEQsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRVIscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFNUIsU0FBUyxJQUFJO1lBQ1gsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxFQUFFO2dCQUM1QixxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM3QjtZQUFBLENBQUM7WUFDRixNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFFRCxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDN0QsSUFBSSxFQUFFLENBQUM7UUFDVCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUM3RCxXQUFXLENBQUMsR0FBRyxFQUFFO2dCQUNmLElBQUksRUFBRSxDQUFDO1lBQ1QsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFO1lBQ25DLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLE1BQU0sS0FBSyxHQUFHLE9BQU8sR0FBRyxVQUFVLENBQUM7WUFDbkMsTUFBTSxLQUFLLEdBQUcsT0FBTyxHQUFHLFVBQVUsQ0FBQztZQUNuQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBRUQsU0FBUyxNQUFNLENBQUMsSUFBVSxFQUFFLEdBQTZCLEVBQUUsVUFBa0IsRUFBRSxXQUFtQixFQUFFLFVBQWtCO0lBQ3BILE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ3JDLE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBRXZDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFFL0MsaUNBQWlDO0lBQ2pDLDBCQUEwQjtJQUMxQix5Q0FBeUM7SUFDekMsZ0NBQWdDO0lBQ2hDLHFCQUFxQjtJQUNyQix3QkFBd0I7SUFDeEIsa0NBQWtDO0lBQ2xDLHFCQUFxQjtJQUNyQixrQkFBa0I7SUFDbEIsSUFBSTtJQUNKLHdDQUF3QztJQUN4QyxnQ0FBZ0M7SUFDaEMscUJBQXFCO0lBQ3JCLHdCQUF3QjtJQUN4QixtQ0FBbUM7SUFDbkMscUJBQXFCO0lBQ3JCLGtCQUFrQjtJQUNsQixJQUFJO0lBRUosS0FBSyxNQUFNLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUU7UUFDbEMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUM7UUFDdkIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQztRQUNwRCxHQUFHLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUV4QixLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDMUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ25DLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNwQyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO0tBQ0o7QUFDSCxDQUFDO0FBRUQsU0FBUyxxQkFBcUIsQ0FBQyxJQUFTO0lBQ3RDLE1BQU0sV0FBVyxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsRCxJQUFJLFdBQVcsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1FBQzNCLE9BQU87S0FDUjtJQUNELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuRSxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDNUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQzdCLENBQUM7QUFFRCxTQUFTLFFBQVEsQ0FBQyxJQUFVO0lBQzFCLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQztJQUV4QixLQUFLLE1BQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTtRQUNsQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDMUMsV0FBVztZQUNYLFNBQVM7U0FDVjtRQUNELEtBQUssTUFBTSxRQUFRLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM3RCxNQUFNLG9CQUFvQixHQUFHLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQztZQUV4RCxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3RFLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQy9CLE1BQU0sK0JBQStCLEdBQWdCLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLENBQUM7Z0JBRXZHLElBQUksK0JBQStCLElBQUksU0FBUyxFQUFFO29CQUNoRCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNuQixXQUFXLEdBQUcsS0FBSyxDQUFDO29CQUNwQixPQUFPLEtBQUssQ0FBQztpQkFDZDtnQkFDRCxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEYsV0FBVyxHQUFHLElBQUksSUFBSSxXQUFXLENBQUM7Z0JBQ2xDLE9BQU8sSUFBSSxDQUFDO1lBQ2QsQ0FBQyxDQUFDLENBQUM7U0FDSjtLQUNGO0lBRUQsT0FBTyxXQUFXLENBQUM7QUFDckIsQ0FBQztBQUVELFNBQVMsaUJBQWlCLENBQUMsS0FBYTtJQUN0QyxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ25DLElBQUksV0FBVyxHQUFXLEVBQUUsQ0FBQztJQUU3QixLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ25CLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQ3BDLE9BQU87U0FDUjtRQUVELElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsV0FBVyxFQUFFO1lBQzdDLFdBQVcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQztZQUMxQyxXQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0QjthQUNJLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLElBQUksV0FBVyxFQUFFO1lBQ25ELFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDeEI7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sV0FBVyxDQUFDO0FBQ3JCLENBQUM7QUFFRCxTQUFTLFFBQVEsQ0FBQyxJQUFZO0lBQzVCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDckMsTUFBTSxHQUFHLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUNqQyxHQUFHLENBQUMsa0JBQWtCLEdBQUc7WUFFdkIsSUFBSSxHQUFHLENBQUMsVUFBVSxLQUFLLGNBQWMsQ0FBQyxJQUFJLEVBQUU7Z0JBQzFDLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUU7b0JBQ3RCLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2lCQUN2QztxQkFBTTtvQkFDTCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2I7YUFDRjtRQUNILENBQUMsQ0FBQztRQUNGLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1QixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDYixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO0lBQ2pELElBQUksRUFBRSxDQUFDO0FBQ1QsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2R1bGUsIFBvc3NpYmxlUm90YXRpb25zIH0gZnJvbSAnLi4vbW9kdWxlJztcclxuaW1wb3J0IHsgR3JpZCB9IGZyb20gJy4uL2dyaWQnO1xyXG5pbXBvcnQgeyBTbG90IH0gZnJvbSAnLi4vc2xvdCc7XHJcbmltcG9ydCB7IFRpbGVEYXRhIH0gZnJvbSAnLi4vdGlsZSc7XHJcblxyXG5hc3luYyBmdW5jdGlvbiBtYWluKCkge1xyXG4gIGNvbnN0IHRpbGVzZXRQYXRoID0gJ3RpbGVzZXRzL2V4YW1wbGUnO1xyXG5cclxuICBjb25zdCBtb2R1bGVzOiBNb2R1bGVbXSA9IFtdO1xyXG5cclxuICBjb25zdCB0aWxlc2V0SlNPTiA9IGF3YWl0IGxvYWRKU09OKGAke3RpbGVzZXRQYXRofS90aWxlc2V0Lmpzb25gKTtcclxuXHJcbiAgY29uc3QgdGlsZXMgPSB0aWxlc2V0SlNPTlsndGlsZXMnXSBhcyB7IFtpbmRleDogc3RyaW5nXTogVGlsZURhdGEgfTtcclxuICBmb3IgKGxldCBrZXkgaW4gdGlsZXMpIHtcclxuICAgIGNvbnN0IHBhdGhUb0ltYWdlID0gYCR7dGlsZXNldFBhdGh9LyR7a2V5fS5wbmdgO1xyXG4gICAgY29uc3QgdGlsZURhdGEgPSB0aWxlc1trZXldO1xyXG4gICAgY29uc3QgZGVncmVlcyA9IDA7XHJcbiAgICAvLyBQb3NzaWJsZVJvdGF0aW9ucy5mb3JFYWNoKGRlZ3JlZXMgPT4ge1xyXG4gICAgICBtb2R1bGVzLnB1c2gobmV3IE1vZHVsZShrZXksIHBhdGhUb0ltYWdlLCB0aWxlRGF0YSwgZGVncmVlcykpO1xyXG4gICAgLy8gfSk7XHJcbiAgfVxyXG5cclxuICBjb25zb2xlLmxvZyhtb2R1bGVzKTtcclxuXHJcbiAgLy8gY29uc29sZS5sb2cobW9kdWxlcyk7XHJcblxyXG4gIGNvbnN0IG1vZHVsZVNpemUgPSAxNjtcclxuICBjb25zdCBzbG90c1dpZHRoID0gMTY7XHJcbiAgY29uc3Qgc2xvdHNIZWlnaHQgPSAxNjtcclxuICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XHJcblxyXG4gIGNhbnZhcy53aWR0aCA9IHNsb3RzV2lkdGggKiBtb2R1bGVTaXplO1xyXG4gIGNhbnZhcy5oZWlnaHQgPSBzbG90c0hlaWdodCAqIG1vZHVsZVNpemU7XHJcbiAgY2FudmFzLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cclxuICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICBjdHguaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XHJcblxyXG5cclxuICBjb25zdCBncmlkID0gbmV3IEdyaWQobW9kdWxlcywgc2xvdHNXaWR0aCwgc2xvdHNIZWlnaHQpO1xyXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgUmVuZGVyKGdyaWQsIGN0eCwgc2xvdHNXaWR0aCwgc2xvdHNIZWlnaHQsIG1vZHVsZVNpemUpXHJcbiAgfSwgMTUwKTtcclxuXHJcbiAgUmFuZG9tbHlSZWR1Y2VFbnRyb3B5KGdyaWQpO1xyXG5cclxuICBmdW5jdGlvbiBzdGVwKCkge1xyXG4gICAgaWYgKENvbGxhcHNlKGdyaWQpID09PSBmYWxzZSkge1xyXG4gICAgICBSYW5kb21seVJlZHVjZUVudHJvcHkoZ3JpZCk7XHJcbiAgICB9O1xyXG4gICAgUmVuZGVyKGdyaWQsIGN0eCwgc2xvdHNXaWR0aCwgc2xvdHNIZWlnaHQsIG1vZHVsZVNpemUpO1xyXG4gIH1cclxuXHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N0ZXAnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgIHN0ZXAoKTtcclxuICB9KTtcclxuXHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BsYXknKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgc3RlcCgpO1xyXG4gICAgfSwgMTApO1xyXG4gIH0pO1xyXG5cclxuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgIGNvbnN0IHsgb2Zmc2V0WCwgb2Zmc2V0WSB9ID0gZTtcclxuICAgIGNvbnN0IHNsb3RYID0gb2Zmc2V0WCAvIG1vZHVsZVNpemU7XHJcbiAgICBjb25zdCBzbG90WSA9IG9mZnNldFkgLyBtb2R1bGVTaXplO1xyXG4gICAgY29uc3QgaW5kZXggPSBncmlkLmdldFNsb3Qoc2xvdFgsIHNsb3RZKTtcclxuICAgIGNvbnNvbGUubG9nKGluZGV4KTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gUmVuZGVyKGdyaWQ6IEdyaWQsIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBzbG90c1dpZHRoOiBudW1iZXIsIHNsb3RzSGVpZ2h0OiBudW1iZXIsIG1vZHVsZVNpemU6IG51bWJlcikge1xyXG4gIGNvbnN0IGNhbnZhc1dpZHRoID0gY3R4LmNhbnZhcy53aWR0aDtcclxuICBjb25zdCBjYW52YXNIZWlnaHQgPSBjdHguY2FudmFzLmhlaWdodDtcclxuXHJcbiAgY3R4Lmdsb2JhbEFscGhhID0gMTtcclxuICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpO1xyXG5cclxuICAvLyBjdHguc3Ryb2tlU3R5bGUgPSAnYmxhY2sgMXB4JztcclxuICAvLyBjdHguZmlsbFN0eWxlID0gJ25vbmUnO1xyXG4gIC8vIGZvciAobGV0IHkgPSAwOyB5IDwgc2xvdHNIZWlnaHQ7IHkrKyl7XHJcbiAgLy8gICBjb25zdCB5cHggPSB5ICogbW9kdWxlU2l6ZTtcclxuICAvLyAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAvLyAgIGN0eC5tb3ZlVG8oMCwgeXB4KTtcclxuICAvLyAgIGN0eC5saW5lVG8oY2FudmFzV2lkdGgsIHlweCk7XHJcbiAgLy8gICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgLy8gICBjdHguc3Ryb2tlKCk7XHJcbiAgLy8gfVxyXG4gIC8vIGZvciAobGV0IHggPSAwOyB4IDwgc2xvdHNXaWR0aDsgeCsrKXtcclxuICAvLyAgIGNvbnN0IHhweCA9IHggKiBtb2R1bGVTaXplO1xyXG4gIC8vICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gIC8vICAgY3R4Lm1vdmVUbyh4cHgsIDApO1xyXG4gIC8vICAgY3R4LmxpbmVUbyh4cHgsIGNhbnZhc0hlaWdodCk7XHJcbiAgLy8gICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgLy8gICBjdHguc3Ryb2tlKCk7XHJcbiAgLy8gfVxyXG5cclxuICBmb3IgKGNvbnN0IGluZGV4IG9mIGdyaWQuaW5kaWNlcygpKSB7XHJcbiAgICBjb25zdCB7IHgsIHkgfSA9IGluZGV4O1xyXG4gICAgY29uc3QgYWxwaGEgPSAxIC8gaW5kZXguc2xvdC5wb3NzaWJsZU1vZHVsZXMubGVuZ3RoO1xyXG4gICAgY3R4Lmdsb2JhbEFscGhhID0gYWxwaGE7XHJcblxyXG4gICAgaW5kZXguc2xvdC5wb3NzaWJsZU1vZHVsZXMuZm9yRWFjaChtb2R1bGUgPT4ge1xyXG4gICAgICBjb25zdCBpeCA9IHggKiBtb2R1bGUuY2FudmFzLndpZHRoO1xyXG4gICAgICBjb25zdCBpeSA9IHkgKiBtb2R1bGUuY2FudmFzLmhlaWdodDtcclxuICAgICAgY3R4LmRyYXdJbWFnZShtb2R1bGUuY2FudmFzLCBpeCwgaXkpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBSYW5kb21seVJlZHVjZUVudHJvcHkoZ3JpZDpHcmlkKSB7XHJcbiAgY29uc3QgbG93ZXN0U2xvdHMgPSBGaW5kTG93ZXN0RW50cm9weShncmlkLnNsb3RzKTtcclxuICBpZiAobG93ZXN0U2xvdHMubGVuZ3RoIDw9IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBsb3dlc3RTbG90cy5sZW5ndGgpO1xyXG4gIGNvbnN0IGxvd2VzdFNsb3QgPSBsb3dlc3RTbG90c1tyYW5kb21JbmRleF07XHJcbiAgbG93ZXN0U2xvdC5SZWR1Y2VFbnRyb3B5KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIENvbGxhcHNlKGdyaWQ6IEdyaWQpIHtcclxuICBsZXQgZGlkQ29sbGFwc2UgPSBmYWxzZTtcclxuXHJcbiAgZm9yIChjb25zdCBpbmRleCBvZiBncmlkLmluZGljZXMoKSkge1xyXG4gICAgaWYgKGluZGV4LnNsb3QucG9zc2libGVNb2R1bGVzLmxlbmd0aCA8PSAxKSB7XHJcbiAgICAgIC8vIFBhcmFkb3guXHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG4gICAgZm9yIChjb25zdCBuZWlnaGJvciBvZiBncmlkLmFkamFjZW50SW5kaWNlcyhpbmRleC54LCBpbmRleC55KSkge1xyXG4gICAgICBjb25zdCB0b1RoaXNJbmRleERpcmVjdGlvbiA9IG5laWdoYm9yLm9wcG9zaXRlRGlyZWN0aW9uO1xyXG5cclxuICAgICAgaW5kZXguc2xvdC5wb3NzaWJsZU1vZHVsZXMgPSBpbmRleC5zbG90LnBvc3NpYmxlTW9kdWxlcy5maWx0ZXIobW9kdWxlID0+IHtcclxuICAgICAgICBjb25zdCBtb2R1bGVOYW1lID0gbW9kdWxlLm5hbWU7XHJcbiAgICAgICAgY29uc3QgbmVpZ2hib3JUaWxlc01ha2luZ1RoaXNQb3NzaWJsZTogU2V0PHN0cmluZz4gPSBuZWlnaGJvci5zbG90LnBvc3NpYmxlVGlsZXNbdG9UaGlzSW5kZXhEaXJlY3Rpb25dO1xyXG5cclxuICAgICAgICBpZiAobmVpZ2hib3JUaWxlc01ha2luZ1RoaXNQb3NzaWJsZSA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGZhbHNlKTtcclxuICAgICAgICAgIGRpZENvbGxhcHNlID0gZmFsc2U7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGtlZXAgPSBBcnJheS5mcm9tKG5laWdoYm9yVGlsZXNNYWtpbmdUaGlzUG9zc2libGUpLmluZGV4T2YobW9kdWxlTmFtZSkgPj0gMDtcclxuICAgICAgICBkaWRDb2xsYXBzZSA9IGtlZXAgJiYgZGlkQ29sbGFwc2U7XHJcbiAgICAgICAgcmV0dXJuIGtlZXA7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRpZENvbGxhcHNlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBGaW5kTG93ZXN0RW50cm9weShzbG90czogU2xvdFtdKSB7XHJcbiAgbGV0IGxvd2VzdENvdW50ID0gTnVtYmVyLk1BWF9WQUxVRTtcclxuICBsZXQgbG93ZXN0U2xvdHM6IFNsb3RbXSA9IFtdO1xyXG5cclxuICBzbG90cy5mb3JFYWNoKHNsb3QgPT4ge1xyXG4gICAgaWYgKHNsb3QucG9zc2libGVNb2R1bGVzLmxlbmd0aCA8PSAxKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2xvdC5wb3NzaWJsZU1vZHVsZXMubGVuZ3RoIDwgbG93ZXN0Q291bnQpIHtcclxuICAgICAgbG93ZXN0Q291bnQgPSBzbG90LnBvc3NpYmxlTW9kdWxlcy5sZW5ndGg7XHJcbiAgICAgIGxvd2VzdFNsb3RzID0gW3Nsb3RdO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoc2xvdC5wb3NzaWJsZU1vZHVsZXMubGVuZ3RoID09IGxvd2VzdENvdW50KSB7XHJcbiAgICAgIGxvd2VzdFNsb3RzLnB1c2goc2xvdCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBsb3dlc3RTbG90cztcclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZEpTT04ocGF0aDogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKClcclxuICAgIHtcclxuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSBYTUxIdHRwUmVxdWVzdC5ET05FKSB7XHJcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVqZWN0KHhocik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgeGhyLm9wZW4oXCJHRVRcIiwgcGF0aCwgdHJ1ZSk7XHJcbiAgICB4aHIuc2VuZCgpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gIG1haW4oKTtcclxufSk7Il19