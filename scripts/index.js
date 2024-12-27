import { world, system, BlockPermutation, Dimension, Block } from "@minecraft/server";
import { commands, commandSetting, commandsPath, config } from "./config";
import CommandHandler from "./libs/commandHandler";
import playerMoveAfterEvent, { PlayerInputKeys } from "./libs/playerMoveAfterEvent";
import DyProp from "./libs/dyProp";

const commandHandler = new CommandHandler(commandsPath, commandSetting, commands, true);
const dyProp = new DyProp(world);

system.run(() => {
    // configを初期化
    if (!dyProp.get("config")) dyProp.set("config", config);
});

world.beforeEvents.chatSend.subscribe((ev) => {
    commandHandler.handleCommand(ev);
});

playerMoveAfterEvent.subscribe(ev => {
    const { player, keys, firstKeys } = ev;
    const dimension = player.dimension;

    if (firstKeys.includes(PlayerInputKeys.SHIFT)) {
        /** @type {GrowConfig} */
        const growConfig = dyProp.get("config");
        const location = player.location;

        growSeed(growConfig, dimension, location);
    }
});

world.afterEvents.playerBreakBlock.subscribe(ev => {
    const { player, block, brokenBlockPermutation } = ev;

    const matchTypes = [
        { vegetable: "minecraft:wheat", seed: "minecraft:wheat_seeds" },
        { vegetable: "minecraft:beetroot", seed: "minecraft:beetroot_seeds" },
        { vegetable: "minecraft:pumpkin_stem", seed: "minecraft:pumpkin_seeds" },
        { vegetable: "minecraft:melon_stem", seed: "minecraft:melon_seeds" },
        { vegetable: "minecraft:carrots", seed: "minecraft:carrot" },
        { vegetable: "minecraft:potatoes", seed: "minecraft:potato" }
    ];
    const matchIndex = matchTypes.findIndex(v => v.vegetable === brokenBlockPermutation.type.id);
    
    if (matchIndex !== -1) {
        const container = player.getComponent("inventory").container;
        const matchType = matchTypes[matchIndex];
    
        for (let i = 0; i < container.size; i++) {
            const item = container.getItem(i);
    
            if (item && item.typeId === matchType.seed && item.amount > 0) {
                const amount = item.amount;
                const dimension = player.dimension;
                const newBlock = dimension.getBlock(block.location);

                amount - 1 > 0 ? item.amount -= 1 : item.amount;
                container.setItem(i, amount - 1 > 0 ? item : null);
                newBlock.setType(matchType.vegetable);
                break;
            }
        }
    }    
});

/**
 * @param {GrowConfig} growConfig
 * @param {Dimension} dimension 
 * @param {import("@minecraft/server").Vector3} location 
 */
function growSeed(growConfig, dimension, location) {
    const seedConfig = growConfig.seed;
    const { x, y, z } = location;

    for (const [dx, dy, dz] of generateCoords(seedConfig.range)) {
        if (Math.random() * 100 < seedConfig.probability) {
            const blockPos = { x: Math.floor(x) + dx, y: Math.floor(y) + dy, z: Math.floor(z) + dz };
            const block = dimension.getBlock(blockPos);

            if (!block) continue;

            const states = block.permutation.getAllStates();

            if (states.growth === undefined || states.growth === 7) continue;

            const newGrowth = states.growth + 1;
            const newPermutation = BlockPermutation.resolve(block.typeId, { growth: newGrowth });

            block.setPermutation(newPermutation);
            dimension.spawnParticle("minecraft:crop_growth_emitter", block.center());
        }
    }
}

/**
 * @param {number} range 
 * @returns {import("@minecraft/server").Vector3}
 */
function generateCoords(range) {
    const coords = [];

    for (let dx = -range; dx <= range; dx++) {
        for (let dy of [0, 1]) {
            for (let dz = -range; dz <= range; dz++) {
                if (dx === 0 && dy === 0 && dz === 0) continue;

                coords.push([dx, dy, dz]);
            }
        }
    }

    return coords;
}