/* eslint-disable */
// @ts-nocheck
import { readFileSync } from 'fs';
import TSify, { toFile } from '../src';

const obj1 = { z: 123 };
const obj2 = { obj1, b: obj1 }

console.log(TSify({ obj2, n: obj2 }))

/*
toFile(__dirname + '/raw.d.ts', JSON.parse(
	readFileSync(__dirname + '/raw.json').toString()
));
*/