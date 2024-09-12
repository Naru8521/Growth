import * as UI from "@minecraft/server-ui";
import { DyProp } from "../libs/dyProp";
import { world } from "@minecraft/server";
import { Util } from "../util";

export default async function SettingForm(player) {
    const dy = new DyProp(world);
    /** @type {Config} */
    const config = dy.get("config");
    const form = new UI.ModalFormData();

    form.title("設定");
    form.slider("範囲", 0, 10, 1, config.range);
    form.slider("確率", 0, 100, 1, config.probability);

    const { formValues, canceled } = await Util.formBusy(player, form);

    if (canceled) return;

    const range = formValues[0];
    const probability = formValues[1];

    config.range = range;
    config.probability = probability;
    dy.set("config", config);
}