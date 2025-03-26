import * as UI from "@minecraft/server-ui";
import { world } from "@minecraft/server";
import DyProp from "../modules/DyProp";
import { Util } from "../utils/util";

const dyProp = new DyProp(world);

export default async function SettingForm(player) {
    const setting = dyProp.get("setting");
    const form = new UI.ModalFormData();

    form.title("設定");
    form.slider("§l種\n§r§f範囲", 0, 10, 1, setting.seed.range);
    form.slider("確率", 0, 100, 1, setting.seed.probability);
    form.toggle("自動植え", setting.auto_planting);
    form.toggle("§c全てリセット", false);

    const { formValues, canceled } = await Util.formBusy(player, form);

    if (canceled) return;

    setting.seed.range = formValues[0];
    setting.seed.probability = formValues[1];
    setting.auto_planting = formValues[2];
    
    if (formValues[6]) setting = JSON.parse(JSON.stringify(config));

    dyProp.set("setting", setting);
}