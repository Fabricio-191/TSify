/* eslint-disable */
// @ts-nocheck
import { readFileSync } from 'fs';
import TSify, { toFile } from '../src';

const obj1 = { z: 123 };
const obj2 = { obj1, b: obj1 }

console.log(TSify({ obj2, n: obj2 }))

const data = JSON.parse(
	readFileSync(__dirname + '/raw.json').toString()
);

toFile(__dirname + '/rawVideo.d.ts', data.video);
toFile(__dirname + '/rawPlaylist.d.ts', data.playlist);
toFile(__dirname + '/rawSearch.d.ts', data.search);