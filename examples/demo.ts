import { createBot, generateWorldTileAt } from "..";

const traveler = createBot();

traveler.on.update = msg => {
    console.log("I<", msg);
    console.log("Standing on: ", { tile: generateWorldTileAt(msg.x, msg.y) });
    traveler.send({ action: "setDir", dir: "nw", autowalk: false });
};
traveler.on.updateImmediate = msg => {};
traveler.on.evalJS = js => {};

traveler
    .login("ACCOUNT T= COOKIE VALUE", "CAPTCHA TOKEN")
    .then(startingData => console.log("Ready!", startingData));

process.on("unhandledRejection", (reason, p) => {
    console.log("Unhandled Rejection at:", p, "reason:", reason);
});
