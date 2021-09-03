#!/usr/bin/env node

const generateArt = require('.');

// Generate a random hash
let __hash = '';
for (let x = 0; x < 40; x++) {
  __hash += Math.floor(Math.random() * 16).toString(16);
}
console.log(`0x${__hash}`);

const { art, bitsConsumed, bits } = generateArt(__hash);
console.log(`Consumed ${bitsConsumed} of ${bits} bits`);
console.log();
console.log(art);
console.log();
