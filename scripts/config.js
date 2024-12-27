/** @type {GrowConfig} */
export const config = {
    seed: {
        range: 3,
        probability: 30
    },
    auto_planting: true
}

/** @type {string} */
export const commandsPath = "../commands";

/** @type {import("./libs/commandHandler").CommandSetting} */
export const commandSetting = {
    prefixs: ["grow"],
    ids: ["g:w"]
};

/** @type {import("./libs/commandHandler").Commands} */
export const commands = [
    {
        name: "setting",
        tags: ["op"]
    }
];