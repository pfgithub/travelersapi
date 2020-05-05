import { generateWorldTileAt } from "./worldgen.js";
export { generateWorldTileAt };

declare global {
    namespace NodeJS {
        interface Global {
            window:
                | (DOMWindow & {
                      jQuery?: JQueryStatic;
                      $?: JQueryStatic;
                  })
                | undefined;
        }
    }
}

// jsdom setup
import { JSDOM, CookieJar, DOMWindow } from "jsdom";

import * as t from "./types";

type TravelersBot = {
    on: {
        update?: (data: t.GameData) => void;
        updateImmediate?: (data: Partial<t.GameData>) => void;
        evalJS?: (data: string) => void;
    };
    send: (message: t.SendMsg) => void;
    login: (accountToken: string) => Promise<t.GameData>;
};

export function createBot(): TravelersBot {
    let bot: TravelersBot = {
        on: {},
        send: () => {
            throw new Error("Not started yet");
        },
        login: (token: string) => login(bot, token),
    };
    return bot;
}

async function login(bot: TravelersBot, accountToken: string) {
    if (global.window)
        throw new Error(
            "Login cannot be run while another bot is initializing. Wait to call this until the previous bot has finished initializing",
        );

    const cookieJar = new CookieJar();

    cookieJar.setCookie(
        "T=" + accountToken,
        "https://thetravelers.online/",
        err => {
            if (err) throw err;
        },
    );

    let jd = new JSDOM(
        `<!DOCTYPE html><html><head></head><body></body></html>`,
        {
            url: "https://thetravelers.online/",
            cookieJar,
        },
    );
    global.window = jd.window;
    console.log("COOKIE IS:", jd.window.document.cookie);
    Object.assign(global.window, {
        JSON,
        encodeURIComponent,
        decodeURIComponent,
    });

    const jQuery = await import("jquery");
    global.window.jQuery = jQuery;
    global.window.$ = jQuery;
    // @ts-ignore
    await import("signalr");
    // @ts-ignore
    await import("./hubs.js");

    // @ts-ignore
    let request = new window.XMLHttpRequest();
    request.open("POST", "/default.aspx/GetAutoLog", true);
    request.withCredentials = true;
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify({}));

    var autologData = await new Promise<string>((success, error) => {
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.statusText === "OK") {
                success(JSON.parse(request.responseText).d);
            } else if (request.readyState === 4 && request.status === 200) {
                success(JSON.parse(request.responseText).d);
            } else if (request.readyState === 4) {
                error(
                    new Error(
                        "Login Error (make sure your token is correct): " +
                            request.responseText,
                    ),
                );
            }
        };
    });

    const $ = global.window.$ as any;
    let conn = $.connection.logHub;
    let hub = $.connection.hub;

    global.window = undefined;

    conn.client.getGameObject = (data: t.GameData) =>
        bot.on.update && bot.on.update(data);
    conn.client.getGameObjectNoCountdown = (json: Partial<t.GameData>) =>
        bot.on.updateImmediate && bot.on.updateImmediate(json);
    conn.client.raw = (exe: string) => bot.on.evalJS && bot.on.evalJS(exe);

    bot.send = (msg: t.SendMsg) => {
        conn.server.fromClient(msg);
    };

    await new Promise(r => hub.start().done(r));
    return JSON.parse(autologData);
}
