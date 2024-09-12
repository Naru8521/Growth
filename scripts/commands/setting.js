import { Player } from "@minecraft/server";
import SettingForm from "../forms/setting";

/**
 * @param {Player} player 
 * @param {string[]} args 
 */
export async function run(player, args) {
    await SettingForm(player);
}