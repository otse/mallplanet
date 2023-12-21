namespace renderer {
	const ad_hoc = 0

	export function boot() {
		console.log('THREE')//, THREE);
		
	}

	export function ready(word: string) {
		console.log(' making renderer ready ');

		if (THREE)
			console.log('THREE is imported');
	}

}

export default renderer;