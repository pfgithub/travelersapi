tiles = {
    traveler: "&",
    sand: "\u00a0",
    grass: ",",
    tree: "t",
    water: "w",
    swamp: "~",
    mountain: "M",
    forest: "T",
    house: "H",
    city: "C",
    startbox: "u",
    monument: " ",
    island: ".",
    worldedge: "\u2591"
};

const {WORLD} = require("./worldgen_web.js");

WORLD.TILES = tiles;
WORLD.setInvalids();

function generateWorldTileAt(x, y) {
    return WORLD.deriveTile(x, y);
}
function getPerlin(x, y, n) {
    return WORLD.getPerlin(x, y, n);
}
function containsEvent(x, y) {
    const perlRand = getPerlin(x, y, 2.501);
    return Math.floor(perlRand * 3400) == 421 || Math.floor(perlRand * 9000) == 4203;
}

module.exports = { generateWorldTileAt, getPerlin, containsEvent };
