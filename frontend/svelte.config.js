import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

const config = {
	preprocess: preprocess({ typescript: true, scss: true }),

	kit: {
		adapter: adapter()
	}
};

export default config;
