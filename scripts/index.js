import { world, system, BlockPermutation } from "@minecraft/server";
import { DyProp } from "./libs/dyProp";
import { commands, commandSetting, commandsPath, config } from "./config";
import { CommandHandler } from "./libs/commandHandler";

const commandHandler = new CommandHandler(commandsPath, commandSetting, commands);
const dy = new DyProp(world);

if (!dy.get("config")) {
    dy.set("config", config);
}

system.runInterval(() => {
    /** @type {Config} */
    const config = dy.get("config");

    for (const player of world.getAllPlayers()) {
        if (player.isSneaking) {
            if (player.sneak) continue;

            const { x, y, z } = player.location;
            const dimension = world.getDimension(player.dimension.id);

            for (const [dx, dy, dz] of generateCoords(config.range)) {
                if (Math.random() * 100 < config.probability) {
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

            player.sneak = true;
        } else {
            player.sneak = false;
        }
    }
});

world.beforeEvents.chatSend.subscribe(async (ev) => {
    const isCommand = await commandHandler.check(ev);

    if (isCommand) return;
});

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