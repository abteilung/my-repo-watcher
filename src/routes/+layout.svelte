<script lang="ts">
	import { mode, toggleMode, ModeWatcher } from 'mode-watcher';
	import '../app.css';

	let { children } = $props();
</script>

<div class="flex justify-between p-4">
	<button
		class="rounded bg-gray-800 px-4 py-2 text-white dark:bg-gray-300 dark:text-black"
		on:click={toggleMode}
	>
		{mode === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
	</button>
</div>

{@render children?.()}
<ModeWatcher />
