var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Module, PossibleRotations } from "../module.js";
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
            Render(grid, ctx, slotsWidth, slotsHeight, moduleSize);
        }, 150);
        RandomlyReduceEntropy(grid);
        function step() {
            const stable = Collapse(grid);
            if (stable) {
                RandomlyReduceEntropy(grid);
            }
        }
        document.querySelector('#step').addEventListener('click', () => {
            step();
            Render(grid, ctx, slotsWidth, slotsHeight, moduleSize);
        });
        function animate() {
            for (let i = 0; i < 6; i++) {
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
    });
}
function Render(grid, ctx, slotsWidth, slotsHeight, moduleSize) {
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
function RandomlyReduceEntropy(grid) {
    const lowestSlots = FindLowestEntropySlots(grid.slots);
    if (lowestSlots.length <= 0) {
        return;
    }
    const randomIndex = Math.floor(Math.random() * lowestSlots.length);
    const lowestSlot = lowestSlots[randomIndex];
    lowestSlot.ReduceEntropy();
}
function Collapse(grid) {
    let stable = true;
    for (const index of grid.indices()) {
        if (index.slot.possibleModules.length <= 1) {
            continue;
        }
        for (const neighbor of grid.adjacentIndices(index.x, index.y)) {
            const neighborSlot = neighbor.slot;
            index.slot.possibleModules = index.slot.possibleModules.filter(module => {
                const outgoing = module.tileData[neighbor.direction];
                const keep = neighborSlot.possibleModules.some(neighborModule => {
                    const incoming = neighborModule.tileData[neighbor.oppositeDirection];
                    return incoming === outgoing;
                });
                stable = keep && stable;
                return keep;
            });
        }
    }
    return stable;
}
function FindLowestEntropySlots(slots) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVtby5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbImRlbW8vZGVtby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLHFCQUFrQjtBQUN0RCxPQUFPLEVBQUUsSUFBSSxFQUFFLG1CQUFnQjtBQUkvQixTQUFlLElBQUk7O1FBQ2pCLE1BQU0sV0FBVyxHQUFHLGtCQUFrQixDQUFDO1FBRXZDLE1BQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQztRQUU3QixNQUFNLFdBQVcsR0FBRyxNQUFNLFFBQVEsQ0FBQyxHQUFHLFdBQVcsZUFBZSxDQUFDLENBQUM7UUFFbEUsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBa0MsQ0FBQztRQUNwRSxLQUFLLElBQUksR0FBRyxJQUFJLEtBQUssRUFBRTtZQUNyQixNQUFNLFdBQVcsR0FBRyxHQUFHLFdBQVcsSUFBSSxHQUFHLE1BQU0sQ0FBQztZQUNoRCxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUIsaUJBQWlCLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNsQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDaEUsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFckIsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUN0QixNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDdkIsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoRCxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFN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VyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDO1lBQzFDLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3RCO2FBQ0ksSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sSUFBSSxXQUFXLEVBQUU7WUFDbkQsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN4QjtJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxXQUFXLENBQUM7QUFDckIsQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLElBQVk7SUFDNUIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNyQyxNQUFNLEdBQUcsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1FBQ2pDLEdBQUcsQ0FBQyxrQkFBa0IsR0FBRztZQUV2QixJQUFJLEdBQUcsQ0FBQyxVQUFVLEtBQUssY0FBYyxDQUFDLElBQUksRUFBRTtnQkFDMUMsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtvQkFDdEIsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7aUJBQ3ZDO3FCQUFNO29CQUNMLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDYjthQUNGO1FBQ0gsQ0FBQyxDQUFDO1FBQ0YsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNiLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDakQsSUFBSSxFQUFFLENBQUM7QUFDVCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZHVsZSwgUG9zc2libGVSb3RhdGlvbnMgfSBmcm9tICcuLi9tb2R1bGUnO1xyXG5pbXBvcnQgeyBHcmlkIH0gZnJvbSAnLi4vZ3JpZCc7XHJcbmltcG9ydCB7IFNsb3QgfSBmcm9tICcuLi9zbG90JztcclxuaW1wb3J0IHsgVGlsZURhdGEgfSBmcm9tICcuLi90aWxlJztcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XHJcbiAgY29uc3QgdGlsZXNldFBhdGggPSAndGlsZXNldHMvZXhhbXBsZSc7XHJcblxyXG4gIGNvbnN0IG1vZHVsZXM6IE1vZHVsZVtdID0gW107XHJcblxyXG4gIGNvbnN0IHRpbGVzZXRKU09OID0gYXdhaXQgbG9hZEpTT04oYCR7dGlsZXNldFBhdGh9L3RpbGVzZXQuanNvbmApO1xyXG5cclxuICBjb25zdCB0aWxlcyA9IHRpbGVzZXRKU09OWyd0aWxlcyddIGFzIHsgW2luZGV4OiBzdHJpbmddOiBUaWxlRGF0YSB9O1xyXG4gIGZvciAobGV0IGtleSBpbiB0aWxlcykge1xyXG4gICAgY29uc3QgcGF0aFRvSW1hZ2UgPSBgJHt0aWxlc2V0UGF0aH0vJHtrZXl9LnBuZ2A7XHJcbiAgICBjb25zdCB0aWxlRGF0YSA9IHRpbGVzW2tleV07XHJcbiAgICBQb3NzaWJsZVJvdGF0aW9ucy5mb3JFYWNoKGRlZ3JlZXMgPT4ge1xyXG4gICAgICBtb2R1bGVzLnB1c2gobmV3IE1vZHVsZShrZXksIHBhdGhUb0ltYWdlLCB0aWxlRGF0YSwgZGVncmVlcykpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjb25zb2xlLmxvZyhtb2R1bGVzKTtcclxuXHJcbiAgY29uc3QgbW9kdWxlU2l6ZSA9IDE2O1xyXG4gIGNvbnN0IHNsb3RzV2lkdGggPSAxNjtcclxuICBjb25zdCBzbG90c0hlaWdodCA9IDE2O1xyXG4gIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcclxuXHJcbiAgY2FudmFzLndpZHRoID0gc2xvdHNXaWR0aCAqIG1vZHVsZVNpemU7XHJcbiAgY2FudmFzLmhlaWdodCA9IHNsb3RzSGVpZ2h0ICogbW9kdWxlU2l6ZTtcclxuICBjYW52YXMuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcblxyXG4gIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gIGN0eC5pbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgY29uc3QgZ3JpZCA9IG5ldyBHcmlkKG1vZHVsZXMsIHNsb3RzV2lkdGgsIHNsb3RzSGVpZ2h0KTtcclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIFJlbmRlcihncmlkLCBjdHgsIHNsb3RzV2lkdGgsIHNsb3RzSGVpZ2h0LCBtb2R1bGVTaXplKVxyXG4gIH0sIDE1MCk7XHJcblxyXG4gIFJhbmRvbWx5UmVkdWNlRW50cm9weShncmlkKTtcclxuXHJcbiAgZnVuY3Rpb24gc3RlcCgpIHtcclxuICAgIGNvbnN0IHN0YWJsZSA9IENvbGxhcHNlKGdyaWQpO1xyXG4gICAgaWYoc3RhYmxlKXtcclxuICAgICAgUmFuZG9tbHlSZWR1Y2VFbnRyb3B5KGdyaWQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N0ZXAnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgIHN0ZXAoKTtcclxuICAgIFJlbmRlcihncmlkLCBjdHgsIHNsb3RzV2lkdGgsIHNsb3RzSGVpZ2h0LCBtb2R1bGVTaXplKTtcclxuICB9KTtcclxuXHJcbiAgZnVuY3Rpb24gYW5pbWF0ZSgpe1xyXG4gICAgZm9yKGxldCBpPTA7IGk8NjsgaSsrKXtcclxuICAgICAgc3RlcCgpO1xyXG4gICAgfVxyXG4gICAgUmVuZGVyKGdyaWQsIGN0eCwgc2xvdHNXaWR0aCwgc2xvdHNIZWlnaHQsIG1vZHVsZVNpemUpO1xyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xyXG4gIH1cclxuXHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BsYXknKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgIGFuaW1hdGUoKTtcclxuICB9KTtcclxuXHJcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICBjb25zdCB7IG9mZnNldFgsIG9mZnNldFkgfSA9IGU7XHJcbiAgICBjb25zdCBzbG90WCA9IG9mZnNldFggLyBtb2R1bGVTaXplO1xyXG4gICAgY29uc3Qgc2xvdFkgPSBvZmZzZXRZIC8gbW9kdWxlU2l6ZTtcclxuICAgIGNvbnN0IGluZGV4ID0gZ3JpZC5nZXRTbG90KHNsb3RYLCBzbG90WSk7XHJcbiAgICBjb25zb2xlLmxvZyhpbmRleCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFJlbmRlcihncmlkOiBHcmlkLCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgc2xvdHNXaWR0aDogbnVtYmVyLCBzbG90c0hlaWdodDogbnVtYmVyLCBtb2R1bGVTaXplOiBudW1iZXIpIHtcclxuICBjb25zdCBjYW52YXNXaWR0aCA9IGN0eC5jYW52YXMud2lkdGg7XHJcbiAgY29uc3QgY2FudmFzSGVpZ2h0ID0gY3R4LmNhbnZhcy5oZWlnaHQ7XHJcblxyXG4gIGN0eC5nbG9iYWxBbHBoYSA9IDE7XHJcbiAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KTtcclxuXHJcbiAgZm9yIChjb25zdCBpbmRleCBvZiBncmlkLmluZGljZXMoKSkge1xyXG4gICAgY29uc3QgeyB4LCB5IH0gPSBpbmRleDtcclxuICAgIGNvbnN0IGFscGhhID0gMSAvIGluZGV4LnNsb3QucG9zc2libGVNb2R1bGVzLmxlbmd0aDtcclxuICAgIGN0eC5nbG9iYWxBbHBoYSA9IGFscGhhO1xyXG5cclxuICAgIGluZGV4LnNsb3QucG9zc2libGVNb2R1bGVzLmZvckVhY2gobW9kdWxlID0+IHtcclxuICAgICAgY29uc3QgaXggPSB4ICogbW9kdWxlLmNhbnZhcy53aWR0aDtcclxuICAgICAgY29uc3QgaXkgPSB5ICogbW9kdWxlLmNhbnZhcy5oZWlnaHQ7XHJcbiAgICAgIGN0eC5kcmF3SW1hZ2UobW9kdWxlLmNhbnZhcywgaXgsIGl5KTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gUmFuZG9tbHlSZWR1Y2VFbnRyb3B5KGdyaWQ6R3JpZCkge1xyXG4gIGNvbnN0IGxvd2VzdFNsb3RzID0gRmluZExvd2VzdEVudHJvcHlTbG90cyhncmlkLnNsb3RzKTtcclxuICBpZiAobG93ZXN0U2xvdHMubGVuZ3RoIDw9IDApIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBsb3dlc3RTbG90cy5sZW5ndGgpO1xyXG4gIGNvbnN0IGxvd2VzdFNsb3QgPSBsb3dlc3RTbG90c1tyYW5kb21JbmRleF07XHJcbiAgbG93ZXN0U2xvdC5SZWR1Y2VFbnRyb3B5KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIENvbGxhcHNlKGdyaWQ6IEdyaWQpIHtcclxuICBsZXQgc3RhYmxlID0gdHJ1ZTtcclxuXHJcbiAgZm9yIChjb25zdCBpbmRleCBvZiBncmlkLmluZGljZXMoKSkge1xyXG4gICAgaWYgKGluZGV4LnNsb3QucG9zc2libGVNb2R1bGVzLmxlbmd0aCA8PSAxKSB7XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG4gICAgZm9yIChjb25zdCBuZWlnaGJvciBvZiBncmlkLmFkamFjZW50SW5kaWNlcyhpbmRleC54LCBpbmRleC55KSkge1xyXG4gICAgICBjb25zdCBuZWlnaGJvclNsb3QgPSBuZWlnaGJvci5zbG90O1xyXG4gICAgICBpbmRleC5zbG90LnBvc3NpYmxlTW9kdWxlcyA9IGluZGV4LnNsb3QucG9zc2libGVNb2R1bGVzLmZpbHRlcihtb2R1bGUgPT4ge1xyXG4gICAgICAgIGNvbnN0IG91dGdvaW5nOiBib29sZWFuID0gbW9kdWxlLnRpbGVEYXRhW25laWdoYm9yLmRpcmVjdGlvbl07XHJcbiAgICAgICAgY29uc3Qga2VlcCA9IG5laWdoYm9yU2xvdC5wb3NzaWJsZU1vZHVsZXMuc29tZShuZWlnaGJvck1vZHVsZSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBpbmNvbWluZzogYm9vbGVhbiA9IG5laWdoYm9yTW9kdWxlLnRpbGVEYXRhW25laWdoYm9yLm9wcG9zaXRlRGlyZWN0aW9uXTtcclxuICAgICAgICAgIHJldHVybiBpbmNvbWluZyA9PT0gb3V0Z29pbmc7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHN0YWJsZSA9IGtlZXAgJiYgc3RhYmxlO1xyXG5cclxuICAgICAgICByZXR1cm4ga2VlcDtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gc3RhYmxlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBGaW5kTG93ZXN0RW50cm9weVNsb3RzKHNsb3RzOiBTbG90W10pIHtcclxuICBsZXQgbG93ZXN0Q291bnQgPSBOdW1iZXIuTUFYX1ZBTFVFO1xyXG4gIGxldCBsb3dlc3RTbG90czogU2xvdFtdID0gW107XHJcblxyXG4gIHNsb3RzLmZvckVhY2goc2xvdCA9PiB7XHJcbiAgICBpZiAoc2xvdC5wb3NzaWJsZU1vZHVsZXMubGVuZ3RoIDw9IDEpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzbG90LnBvc3NpYmxlTW9kdWxlcy5sZW5ndGggPCBsb3dlc3RDb3VudCkge1xyXG4gICAgICBsb3dlc3RDb3VudCA9IHNsb3QucG9zc2libGVNb2R1bGVzLmxlbmd0aDtcclxuICAgICAgbG93ZXN0U2xvdHMgPSBbc2xvdF07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChzbG90LnBvc3NpYmxlTW9kdWxlcy5sZW5ndGggPT0gbG93ZXN0Q291bnQpIHtcclxuICAgICAgbG93ZXN0U2xvdHMucHVzaChzbG90KTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGxvd2VzdFNsb3RzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkSlNPTihwYXRoOiBzdHJpbmcpIHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKVxyXG4gICAge1xyXG4gICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IFhNTEh0dHBSZXF1ZXN0LkRPTkUpIHtcclxuICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZWplY3QoeGhyKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICB4aHIub3BlbihcIkdFVFwiLCBwYXRoLCB0cnVlKTtcclxuICAgIHhoci5zZW5kKCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcbiAgbWFpbigpO1xyXG59KTsiXX0=