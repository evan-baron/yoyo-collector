export default function arraySplitter(arr, subArrSize) {
	const result = [];
	for (let i = 0; i < arr?.length; i += subArrSize) {
		result.push(arr.slice(i, i + subArrSize));
	}
	return result;
}
