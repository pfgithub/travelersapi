"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worldgen_js_1 = require("./worldgen.js");
exports.generateWorldTileAt = worldgen_js_1.generateWorldTileAt;
// jsdom setup
const jsdom_1 = require("jsdom");
function createBot() {
    let bot = {
        on: {},
        send: () => {
            throw new Error("Not started yet");
        },
        login: (token) => login(bot, token),
    };
    return bot;
}
exports.createBot = createBot;
async function login(bot, accountToken) {
    if (global.window)
        throw new Error("Login cannot be run while another bot is initializing. Wait to call this until the previous bot has finished initializing");
    const cookieJar = new jsdom_1.CookieJar();
    cookieJar.setCookie("T=" + accountToken, "https://thetravelers.online/", err => {
        if (err)
            throw err;
    });
    let jd = new jsdom_1.JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`, {
        url: "https://thetravelers.online/",
        cookieJar,
    });
    global.window = jd.window;
    console.log("COOKIE IS:", jd.window.document.cookie);
    Object.assign(global.window, {
        JSON,
        encodeURIComponent,
        decodeURIComponent,
    });
    const jQuery = await Promise.resolve().then(() => require("jquery"));
    global.window.jQuery = jQuery;
    global.window.$ = jQuery;
    // @ts-ignore
    await Promise.resolve().then(() => require("signalr"));
    // @ts-ignore
    await Promise.resolve().then(() => require("./hubs.js"));
    // @ts-ignore
    let request = new window.XMLHttpRequest();
    request.open("POST", "/default.aspx/GetAutoLog", true);
    request.withCredentials = true;
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify({}));
    var autologData = await new Promise((success, error) => {
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.statusText === "OK") {
                success(JSON.parse(request.responseText).d);
            }
            else if (request.readyState === 4 && request.status === 200) {
                success(JSON.parse(request.responseText).d);
            }
            else if (request.readyState === 4) {
                error(new Error("Login Error (make sure your token is correct): " +
                    request.responseText));
            }
        };
    });
    const $ = global.window.$;
    let conn = $.connection.logHub;
    let hub = $.connection.hub;
    global.window = undefined;
    conn.client.getGameObject = (data) => bot.on.update && bot.on.update(data);
    conn.client.getGameObjectNoCountdown = (json) => bot.on.updateImmediate && bot.on.updateImmediate(json);
    conn.client.raw = (exe) => bot.on.evalJS && bot.on.evalJS(exe);
    bot.send = (msg) => {
        conn.server.fromClient(msg);
    };
    await new Promise(r => hub.start().done(r));
    return JSON.parse(autologData);
}
