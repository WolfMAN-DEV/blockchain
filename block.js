const { GENESIS_DATA, MINE_RATE } = require("./config");
const cryptoHash = require("./crypto-hash");

class Block {
  static genesis() {
    return new this(GENESIS_DATA);
  }

  static adjustDifficulty({ block: { difficulty, ...block }, timestamp }) {
    if (timestamp - block.timestamp > MINE_RATE) return difficulty - 1;

    return difficulty + 1;
  }

  static mineBlock({ lastBlock: { difficulty, ...lastBlock }, data }) {
    let hash, timestamp;

    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      hash = cryptoHash(timestamp, lastBlock.hash, data, nonce, difficulty);
    } while (!/^0*$/.test(hash.substring(0, difficulty)));

    return new this({
      timestamp,
      lastHash: lastBlock.hash,
      hash,
      data,
      difficulty,
      nonce,
    });
  }

  constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }
}

module.exports = Block;
