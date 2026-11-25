<script lang="ts">
	import '../app.css';
	import { CheckCircle2 } from 'lucide-svelte';
	import { cartStore } from '$lib/stores/cart.svelte';

	let { children } = $props();
</script>

<div class="noise-overlay" aria-hidden="true"></div>

{@render children()}

{#if cartStore.toastMessage}
	<div
		class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 inline-flex items-center gap-2 rounded-full border border-[#B6842D]/35 bg-white/95 px-5 py-2.5 text-xs font-medium text-[#141815] shadow-[0_16px_40px_-10px_rgba(20,24,21,0.2)] backdrop-blur-xl"
	>
		<CheckCircle2 class="h-4 w-4 text-[#1B5E3E] shrink-0" />
		<span>{cartStore.toastMessage}</span>
	</div>
{/if}
