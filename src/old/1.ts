import { writeFileSync, readFileSync } from 'fs';

const indent = (str: string, indentation = '\t'): string => str.replace(/^/gm, indentation);

function removeDuplicates(arr: unknown[]): unknown[] {
	const set = new Set();

	for(const elem of arr){
		set.add(elem);
	}

	return Array.from(set);
}

function TSify(thing: unknown): string{
	if(typeof thing !== 'object') return typeof thing;
	if(thing === null) return 'null';

	if(Array.isArray(thing)){
		if(thing.length === 0) return '[]';

		const arr = removeDuplicates(thing.map(TSify));
		if(arr.length === 1 || arr.length <= thing.length / 2){
			return `Array<${arr.join(' | ')}>`;
		}

		return `[\n${
			indent(thing.map(TSify).join(',\n'))
		}\n]`;
	}

	let str = '';
	const keys = Object.keys(thing);
	for(const key of keys){
		const end = key === keys[keys.length - 1] ? '' : '\n';

		if((/\./).exec(key)){
			str += `'${key}': ${TSify(thing[key])};${end}`;
		}else{
			str += `${key}: ${TSify(thing[key])};${end}`;
		}
	}

	return '{\n' + indent(str) + '\n}';
}

TSify.toFile = (file: string, thing: unknown) => {
	const str = 'export default interface Data ' + TSify(thing);
	writeFileSync(file, str);
};

TSify.toFile('raw.ts', JSON.parse(
	readFileSync('./raw.json').toString()
));