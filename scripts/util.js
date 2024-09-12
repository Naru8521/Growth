import { Player, system } from "@minecraft/server";
import * as UI from "@minecraft/server-ui";

export class Util {
    /**
     * formを表示するのを待ちます
     * @param {Player} player - フォームを表示するプレイヤー
     * @param {UI.ActionFormData | UI.ModalFormData | UI.MessageFormData} form - フォーム
     * @returns {Promise<UI.ActionFormResponse | UI.ModalFormResponse | UI.MessageFormResponse>} - フォームの返り値
     */
    static formBusy(player, form) {
        return new Promise(res => {
            system.run(async function run() {
                const response = await form.show(player);
                const { canceled, cancelationReason: reason } = response;
                if (canceled && reason === UI.FormCancelationReason.UserBusy) return system.run(run);
                res(response);
            });
        });
    }

    /**
     * UUIDv4を生成します
     * @returns {string} - UUID
     */
    static generateUUIDv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}