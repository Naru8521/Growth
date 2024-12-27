import * as UI from "@minecraft/server-ui";
import DyProp from "../libs/dyProp";
import { world } from "@minecraft/server";
import { Util } from "../util";
import { config } from "../config";

const dyProp = new DyProp(world);

export default async function SettingForm(player) {
    /** @type {GrowConfig} */
    let growConfig = dyProp.get("config");
    const form = new UI.ModalFormData();

    form.title("設定");
    form.slider("§l種\n§r§f範囲", 0, 10, 1, growConfig.seed.range);
    form.slider("確率", 0, 100, 1, growConfig.seed.probability);
    form.toggle("自動植え", growConfig.auto_planting);
    form.toggle("§c全てリセット", false);

    const { formValues, canceled } = await Util.formBusy(player, form);

    if (canceled) return;

    growConfig.seed.range = formValues[0];
    growConfig.seed.probability = formValues[1];
    growConfig.auto_planting = formValues[2];
    
    if (formValues[6]) growConfig = JSON.parse(JSON.stringify(config));

    dyProp.set("config", growConfig);
}