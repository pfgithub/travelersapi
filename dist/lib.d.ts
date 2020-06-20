/// <reference types="jquery" />
import { generateWorldTileAt } from "./worldgen.js";
export { generateWorldTileAt };
declare global {
    namespace NodeJS {
        interface Global {
            window: (DOMWindow & {
                jQuery?: JQueryStatic;
                $?: JQueryStatic;
            }) | undefined;
        }
    }
}
import { DOMWindow } from "jsdom";
import * as t from "./types";
declare type TravelersBot = {
    on: {
        update?: (data: t.GameData) => void;
        updateImmediate?: (data: Partial<t.GameData>) => void;
        evalJS?: (data: string) => void;
    };
    send: (message: t.SendMsg) => void;
    login: (accountToken: string) => Promise<t.GameData>;
};
export declare function createBot(): TravelersBot;
