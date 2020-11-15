helper for connecting to https://thetravelers.online/ from node

# example

```bash
npm i --save travelersapi
```

```ts
const { createBot, generateWorldTileAt } = require("travelersapi");

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
```

> Note: the typescript types provided are incomplete! You may wish to not use them or make your own.

# account token

- go to https://thetravelers.online/ and log in.
- go to the storage tab or your browser's equivalent
- find the cookie `T=cdsajnkcjnlsdcnjalkcjandlsk`
- The part after the = is your token.

# captcha token

- go to thetravelers.online
- complete the captcha (do not press "wake up")
- paste this script into the console:

```js
prompt("Copy the captcha:", SOCKET.captcha);
```

you have to do this every time you log in. tokens expire quickly and you cannot reuse the same token multiple times.

# help

in a web browser logged into https://thetravelers.online/, you can log all messages sent to and from the server by psating this in the console:

```js
window.gsend = SOCKET.send;
SOCKET.send = a => (console.log("i>", a), window.gsend(a));
window.adata = ENGINE.applyData;
ENGINE.applyData = (...a) => (console.log("I<", ...a), window.adata(...a));
```

# getPerlin, containsEvent

`containsEvent(138750, 62680)` ⇒ true

`containsEvent(138750, 62681)` ⇒ false
