helper for connecting to https://thetravelers.online/ from node

# example

```bash
npm i --save travelersapi
```

```ts
import { createBot, generateWorldTileAt } from "travelersapi";

const traveler = createBot();

traveler.on.update = msg => {
    console.log("I<", msg);
    console.log("Standing on: ", { tile: generateWorldTileAt(msg.x, msg.y) });
    traveler.send({ action: "setDir", dir: "nw", autowalk: false });
};
traveler.on.updateImmediate = msg => {};
traveler.on.evalJS = js => {};

traveler
    .login("ACCOUNT T= COOKIE VALUE")
    .then(startingData => console.log("Ready!", startingData));
```

> Note: the typescript types provided are incomplete! You may wish to not use them or make your own.

# account token

go to https://thetravelers.online/ and log in. in the network tab of console, find the cookie `T=cdsajnkcjnlsdcnjalkcjandlsk`. The part after the = is your token.

# help

in a web browser logged into https://thetravelers.online/, you can log all messages sent to and from the server by psating this in the console:

```js
window.gsend = SOCKET.send;
SOCKET.send = a => (console.log("i>", a), window.gsend(a));
window.adata = ENGINE.applyData;
ENGINE.applyData = (...a) => (console.log("I<", ...a), window.adata(...a));
```
