/* eslint-disable */
// @ts-nocheck
import { readFileSync } from 'fs';
import TSify, { toFile } from '../src';

const obj1 = { a: 1 };
const obj2 = { t: obj1, d: obj1 };

console.log(TSify({
	a1: obj2,
	a2: obj2,
	a3: obj2,
}))

/*
toFile(__dirname + '/raw.d.ts', JSON.parse(
	readFileSync(__dirname + '/raw2.json').toString()
));
*/