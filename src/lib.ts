import { generateWorldTileAt, getPerlin, containsEvent } from "./worldgen.js";
export { generateWorldTileAt, getPerlin, containsEvent };

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
import * as vm from "vm";
import * as fs from "fs";

import * as t from "./types";

type TravelersBot = {
    on: {
        update?: (data: t.GameData) => void;
        updateImmediate?: (data: Partial<t.GameData>) => void;
        evalJS?: (data: string) => void;
    };
    send: (message: t.SendMsg) => void;
    login: (accountToken: string, captcha: string) => Promise<t.GameData>;
};

export function createBot(): TravelersBot {
    let bot: TravelersBot = {
        on: {},
        send: () => {
            throw new Error("Not started yet");
        },
        login: (token, captcha) => login(bot, token, captcha),
    };
    return bot;
}

const js = (a: TemplateStringsArray, ..._: never[]) => a[0];
const html = (a: TemplateStringsArray, ..._: never[]) => a[0];

async function login(bot: TravelersBot, accountToken: string, captcha: string) {
    const cookieJar = new CookieJar();

    cookieJar.setCookie(
        "T=" + accountToken,
        "https://thetravelers.online/",
        err => {
            if (err) throw err;
        },
    );

    let jd = new JSDOM(
        html`<!DOCTYPE html><html><head></head><body></body></html>`,
        {
            url: "https://thetravelers.online/",
            cookieJar,
        },
    );
    Object.assign(jd.window, {
        JSON,
        encodeURIComponent,
        decodeURIComponent,
        bot,
        console,
        captcha,
    });
    
    jd.window.requireNoCache = (module: string) => {
        const file = fs.readFileSync(require.resolve(module), "utf-8");
        const script = new vm.Script(file);
        jd.window.module = {exports: {}};
        script.runInContext(jd.window);
        const rv = jd.window.module;
        jd.window.module = undefined;
        return rv.exports;
    };
    jd.window.result = undefined;
    vm.createContext(jd.window);
    
    const script = new vm.Script(js`
    
    const jQuery = requireNoCache("jquery");
    window.jQuery = jQuery;
    window.$ = jQuery;
    const signalr = requireNoCache("signalr");
    const hubs = requireNoCache("./hubs.js");
    
    let request = new window.XMLHttpRequest();
    request.open("POST", "/default.aspx/GetAutoLog", true);
    request.withCredentials = true;
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify({captcha}));

    result = (async () => {
        let autologData = await new Promise((success, error) => {
            request.onreadystatechange = () => {
                if (request.readyState === 4 && request.statusText === "OK") {
                    success(JSON.parse(request.responseText).d);
                } else if (request.readyState === 4 && request.status === 200) {
                    success(JSON.parse(request.responseText).d);
                } else if (request.readyState === 4) {
                    error(new Error(
                        "Login Error (make sure your token is correct): " +
                            request.responseText,
                    ));
                }
            };
        });
        const alData = JSON.parse(autologData);
        
        let conn = $.connection.logHub;
        let hub = $.connection.hub;
        
        conn.client.getGameObject = (data/*: t.GameData*/) =>
            bot.on.update && bot.on.update(data);
        conn.client.getGameObjectNoCountdown = (json/*: Partial<t.GameData>*/) =>
            bot.on.updateImmediate && bot.on.updateImmediate(json);
        conn.client.raw = (exe/*: string*/) => bot.on.evalJS && bot.on.evalJS(exe);
        
        bot.send = (msg/*: t.SendMsg*/) => {
            if(!("action" in msg)) throw new Error("msg missing action");
            const anme = "cl_"+msg.action.split("-").join("_");
            if(!conn.server[anme]) throw new Error("unsupported action <"+msg.action+">. Either this is not an action or the travelers api needs to be updated with a new hub.js");

            conn.server[anme](msg, alData.data.PLAY_AUTH);
        };
        
        await new Promise(r => hub.start().done(r));
        
        return alData;
    })()
    
    `);
    
    script.runInContext(jd.window);
    return await jd.window.result;
}
