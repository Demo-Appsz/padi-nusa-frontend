<script lang="ts">
	import { ShoppingBag, Sparkles, Wheat, ShieldCheck } from 'lucide-svelte';
	import { cartStore } from '$lib/stores/cart.svelte';
	import { magnetic } from '$lib/actions/motion';

	interface Props {
		activeRoute?: 'store' | 'admin';
	}

	let { activeRoute = 'store' }: Props = $props();
</script>

<header class="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none">
	<nav
		class="mx-auto max-w-6xl pointer-events-auto rounded-full border border-stone-900/10 bg-white/80 px-4 sm:px-6 py-2.5 backdrop-blur-xl shadow-[0_14px_38px_-14px_rgba(20,24,21,0.14)] flex items-center justify-between gap-4"
	>
		<a href="/" class="flex items-center gap-2.5 group">
			<span
				class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A043] to-[#A6741D] text-white shadow-[0_6px_18px_-4px_rgba(182,132,45,0.45)] transition-transform duration-300 group-hover:scale-105"
			>
				<Wheat class="h-4.5 w-4.5" />
			</span>
			<div class="leading-tight">
				<span class="font-serif text-xl tracking-tight text-[#141815]">PadiNusa</span>
				<span class="hidden sm:flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-[#8E6216]">
					<span class="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
					Giling Segar Harian
				</span>
			</div>
		</a>

		{#if activeRoute === 'store'}
			<div class="hidden md:flex items-center gap-1 text-sm text-[#545E56]">
				<a
					href="#katalog"
					class="rounded-full px-3.5 py-1.5 transition-colors hover:bg-stone-900/5 hover:text-[#141815]"
				>
					Katalog Beras
				</a>
				<a
					href="#kisah-sawah"
					class="rounded-full px-3.5 py-1.5 transition-colors hover:bg-stone-900/5 hover:text-[#141815]"
				>
					Dari Sawah
				</a>
				<a
					href="#kalkulator-masak"
					class="rounded-full px-3.5 py-1.5 transition-colors hover:bg-stone-900/5 hover:text-[#141815]"
				>
					Takaran Masak
				</a>
				<a
					href="/admin"
					class="rounded-full px-3.5 py-1.5 transition-colors hover:bg-stone-900/5 hover:text-[#8E6216] flex items-center gap-1.5"
				>
					<ShieldCheck class="h-3.5 w-3.5" />
					Panel Toko
				</a>
			</div>
		{:else}
			<div class="flex items-center gap-2 text-sm">
				<a
					href="/"
					class="rounded-full border border-stone-900/12 bg-stone-900/5 px-4 py-1.5 text-[#141815] hover:border-[#B6842D]/50 transition-colors"
				>
					← Kembali ke Toko Online
				</a>
			</div>
		{/if}

		<div class="flex items-center gap-2.5">
			{#if activeRoute === 'store'}
				<button
					type="button"
					onclick={() => {
						cartStore.isSubscription = !cartStore.isSubscription;
						void cartStore.refreshQuote();
					}}
					class="hidden sm:inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer {cartStore.isSubscription
						? 'border-[#B6842D]/50 bg-[#B6842D]/12 text-[#8E6216]'
						: 'border-stone-900/10 bg-[#F5F2EB] text-[#545E56] hover:text-[#141815]'}"
					title="Aktifkan langganan bulanan untuk hemat 10%"
				>
					<Sparkles class="h-3.5 w-3.5" />
					{cartStore.isSubscription ? 'Langganan -10% Aktif' : 'Langganan -10%'}
				</button>

				<button
					type="button"
					use:magnetic={0.22}
					onclick={() => (cartStore.isOpen = true)}
					class="relative inline-flex items-center gap-2 rounded-full bg-[#141815] px-4 py-2 text-xs sm:text-sm font-semibold text-[#FAF9F6] shadow-[0_10px_24px_-8px_rgba(20,24,21,0.35)] hover:bg-[#B6842D] transition-colors cursor-pointer"
				>
					<ShoppingBag class="h-4 w-4" />
					<span>Keranjang</span>
					{#if cartStore.totalPacks > 0}
						<span
							class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D4A043] px-1.5 font-mono text-[11px] font-semibold text-[#141815]"
						>
							{cartStore.totalPacks}
						</span>
					{/if}
				</button>
			{/if}
		</div>
	</nav>
</header>
