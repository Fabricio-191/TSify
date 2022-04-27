/* eslint-disable */
// @ts-nocheck
import { readFileSync } from 'fs';
import TSify, { toFile } from '../src';

/*
console.log(
	TSify({
		a: {
			prop1: {
				prop2: 123,
			}
		},
		b: {
			prop1: {
				prop3: 123,
			}
		}
	})
)
*/

const data = JSON.parse(
	readFileSync(__dirname + '/raw.json').toString()
);

toFile(__dirname + '/raw.d.ts', data);
/*
toFile(__dirname + '/rawVideo.d.ts'   , data.video   );
toFile(__dirname + '/rawPlaylist.d.ts', data.playlist);
toFile(__dirname + '/rawSearch.d.ts'  , data.search  );
*/