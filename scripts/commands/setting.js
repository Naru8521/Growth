import { Player } from "@minecraft/server";
import { config } from "../config";
import SettingForm from "../forms/setting";
import commandManager from "../modules/CommandManager";

export function loadSettingCommand() {
    const settingCommand = commandManager.register({
        prefixes: config.commands.prefixes,
        ids: config.commands.ids,
        tags: ["op"],
        name: "setting",
        description: "設定を開きます。"
    });

    console.log("load setting command.");

    settingCommand.onCommand((args, player) => {
        SettingForm(player);
    });

    settingCommand.onScriptCommand((args, initiator, sourceEntity, sourceBlock) => {
        if (initiator instanceof Player) {
            SettingForm(initiator);
        } else if (sourceEntity instanceof Player) {
            SettingForm(sourceEntity);
        }
    });
}