import { rejects } from 'node:assert';
import { resolve } from 'node:dns';
import * as string_decoder from 'node:string_decoder';
import { CoinInfo } from './interface/CoinInfo';
import { CoinTicker } from './interface/CoinTicker';
import { json } from 'node:stream/consumers';

export function fetchCoins() {
    return fetch('https://api.coinpaprika.com/v1/coins').then((response) => response.json());
}

export function fetchCoinInfo(coinId: string) {
    return fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`).then((res) => res.json());
}

export function fetchCoinTickers(coinId: string) {
    return fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`).then((res) => res.json());
}

export function fetchCoinHistory(coinId: string | undefined) {
    return fetch(`https://ohlcv-api.nomadcoders.workers.dev?coinId=${coinId}`).then((res) => res.json());
}
