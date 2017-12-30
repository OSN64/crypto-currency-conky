#!/usr/bin/env node
'use strict';

const price = require('crypto-price');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const coins = require('./coins.json');

const writeFile = promisify(fs.writeFile);
const filePath = process.env.COINPATH || `${path.resolve(__dirname, 'prices.txt')}`;

/**
 * Requests prices from crypto prices module,
 * formats and overwrites coin file
 * @param  {[Object]} coins    [Symbol: Fullname]
 * @param  {[String]} base     [Fiat currency]
 * @param  {[String]} filePath [Coin file]
 * @return {[null]}
 */

async function saveCoinPrice(coins, base, filePath) {

  const pricePromises = Object.keys(coins).map((coin) => {
    return price.getCryptoPrice(base, coin)
  });

  const strings = (await Promise.all(pricePromises)).filter((x) => {
    return (x !== undefined); // remove empty prices
  }).map((price) => {
    price = {
      base: price.base,
      price: price.price,
      target: price.target,
      volume: parseFloat(price.volume).toFixed(2) || 0,
      change: parseFloat(price.change).toFixed(2) || 0,
    }
    return `${coins[price.base]}: \n Price: $${price.price} ${price.target} \n 24h Volume: $${price.volume}\n 24h Change: ${price.change}% \n`;
  }).join('\n');

  try {
    await writeFile(filePath, strings);
  } catch (e) {
    throw new Error('Unable to write string to file', e);
  }

};

saveCoinPrice(coins, 'AUD', filePath).then().catch(console.error);
