/** @type {Config} */
export const config = {
    range: 3,
    probability: 33
}

/** @type {string} */
export const commandsPath = "../commands";

/** @type {import("./libs/commandHandler").CommandSetting} */
export const commandSetting = {
    prefix: "grow",
    id: ""
};

/** @type {import("./libs/commandHandler").Commands} */
export const commands = [
    {
        name: "setting",
        description: "成長範囲などの設定をします",
        tags: ["op"]
    }
];