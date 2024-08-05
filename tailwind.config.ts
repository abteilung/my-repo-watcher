import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		container: {
			screens: {
				'3xl': '1500px',
				'2xl': '1400px'
			},
			center: true,
			padding: '1rem'
		},
		extend: {}
	},

	plugins: [require('@tailwindcss/typography')]
} as Config;
