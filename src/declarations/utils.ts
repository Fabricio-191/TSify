const { isArray } = Array;
export { compareTwoStrings as stringSimilarity } from 'string-similarity';
// import * as deepStrictEqual from 'fast-deep-equal';

export function sharesOneKey(a: object, b: object): boolean {
	for(const key in a){
		if(key in b) return true;
	}

	return false;
}

export function deepStrictEqual(a: unknown, b: unknown): boolean {
	if(a === b) return true;

	if(a && b && typeof a === 'object' && typeof b === 'object'){
		const keysA = Object.keys(a), keysB = Object.keys(b);

		if(keysA.length !== keysB.length) return false;

		for(const key of keysA){
			if(!keysB.includes(key)) return false;
			if(!deepStrictEqual(a[key], b[key])) return false;
		}
	}
	if(isNaN(a as number) && isNaN(b as number)) return true;

	return true;
}

export function objectSimilarity(a: object, b: object): number {
	if(typeof a !== 'object' || typeof b !== 'object' || isArray(a) !== isArray(b)) return 0;
	if(deepStrictEqual(a, b)) return 1;
	let similarity = 0;

	const keysA = Object.keys(a);
	const keysB = Object.keys(b);
	if(deepStrictEqual(keysA, keysB)){
		similarity += 0.6;
	// eslint-disable-next-line @typescript-eslint/require-array-sort-compare
	}else if(deepStrictEqual(keysA.sort(), keysB.sort())){
		similarity += 0.4;
	}

	const keyValue = 1 / (keysA.length + keysB.length) / 2;
	for(const key of keysA){
		if(key in b){
			if(deepStrictEqual(a[key], b[key])){
				similarity += keyValue * 4;
				continue;
			}

			const typeA = typeof a[key];
			const typeB = typeof b[key];

			if(typeA === typeB){
				if(typeA === 'object'){
					similarity += keyValue * 4 * objectSimilarity(a[key], b[key]);
				}else{
					similarity += keyValue * 2;
				}
			}else{
				similarity += keyValue;
			}
		}else{
			similarity -= keyValue;
		}
	}

	return similarity > 1 ? 1 : similarity;
}