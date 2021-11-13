const BN = require('bn.js');

class BitReader {
  constructor(hash) {
    if (hash.indexOf('0x') !== -1) {
      this.hash = hash.replace('0x', '');
    } else {
      this.hash = hash;
    }
    this.offset = 0;
    this.bitsConsumed = 0;
    this.binaryString = new BN(this.hash, 16).toString(2);
   // @notice you can disable this for less verbose output
    console.log(this.binaryString, this.hash)
  }

  // get a number in the set [0, (max-1)]
  getNum(max) {
    const bits = Math.ceil(Math.log2(max));
    const exact = 2 ** bits === max;
    const val = this.readBits(bits, exact);
    if (val < max) return val;
    // otherwise we need to take a modulus from another part of the hash
    // take this value based on the current offset as well
    let partialBits = this.binaryString.slice(-this.offset);
    if (partialBits.length < bits) {
      partialBits += this.binaryString.slice(0, bits - partialBits.length);
    }
    return parseInt(partialBits, 2) % max;
  }

  readBits(count, exact = false) {
    let bits = this.binaryString.slice(this.offset, this.offset + count);
    if (bits.length < count) {
      // wrap to the front and get the remaining bits
      bits += this.binaryString.slice(0, count - bits.length);
    }
    const bitsConsumed = count - (exact ? 0 : 1);
    this.bitsConsumed += bitsConsumed;
    this.offset = (this.offset + bitsConsumed) % this.binaryString.length;
    return parseInt(bits, 2);
  }
}

module.exports = BitReader;
