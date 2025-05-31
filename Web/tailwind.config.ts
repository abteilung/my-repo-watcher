import type { Config } from 'tailwindcss';

export default {
	darkMode: 'class', // 'class' ermöglicht einen manuellen Wechsel

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
		extend: {
			gridTemplateColumns: {
				// Simple 16 column grid
				'14': 'repeat(14, minmax(0, 1fr))',
				'21': 'repeat(21, minmax(0, 1fr))',
				'20': 'repeat(20, minmax(0, 1fr))'
			}
		}
	}
} as Config;
