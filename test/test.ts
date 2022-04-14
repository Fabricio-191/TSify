/* eslint-disable */
// @ts-nocheck
import TSify, { toFile } from '../src';

import { readFileSync } from 'fs';
toFile('raw.d.ts', JSON.parse(
	readFileSync(__dirname + '/raw.json').toString()
));