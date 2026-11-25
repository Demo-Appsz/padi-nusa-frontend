<script lang="ts">
	import { Search, SlidersHorizontal, Sparkles } from 'lucide-svelte';
	import type { RiceGrade, RiceProduct } from '$lib/api/client';
	import { cartStore } from '$lib/stores/cart.svelte';
	import { reveal } from '$lib/actions/motion';
	import ProductCard from './ProductCard.svelte';

	interface Props {
		products: RiceProduct[];
		onInspect: (product: RiceProduct) => void;
	}

	let { products, onInspect }: Props = $props();

	let selectedGrade = $state<RiceGrade | 'all'>('all');
	let searchQuery = $state('');

	const filters: { id: RiceGrade | 'all'; label: string }[] = [
		{ id: 'all', label: 'Semua Varietas' },
		{ id: 'artisanal', label: 'Artisanal Wangi' },
		{ id: 'organik', label: 'Organik & MPASI' },
		{ id: 'heritage', label: 'Pusaka & Hitam' },
		{ id: 'premium', label: 'Harian Keluarga' }
	];

	let filteredProducts = $derived(
		products.filter((p) => {
			const matchGrade = selectedGrade === 'all' || p.grade === selectedGrade;
			const q = searchQuery.trim().toLowerCase();
			const matchQuery =
				!q ||
				p.name.toLowerCase().includes(q) ||
				p.origin_region.toLowerCase().includes(q) ||
				p.tagline.toLowerCase().includes(q);
			return matchGrade && matchQuery;
		})
	);
</script>

<section id="katalog" class="relative py-24 px-4 sm:px-6 bg-[#FAF9F6]">
	<div class="mx-auto max-w-6xl space-y-10">
		<!-- Section Header -->
		<div use:reveal class="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
			<div class="space-y-3 max-w-2xl">
				<span class="font-mono text-xs uppercase tracking-[0.2em] text-[#8E6216]">
					01 · Kurasi Panen Segar
				</span>
				<h2 class="font-serif text-4xl sm:text-5xl text-[#141815] leading-tight">
					Pilih Varietas Sesuai
					<span class="text-[#B6842D]">Selera Dapur</span> Anda
				</h2>
				<p class="text-sm sm:text-base text-[#545E56]">
					Bandingkan profil kepulenan, aroma, dan pilih ukuran karung 2 kg hingga 25 kg dengan diskon grosir otomatis.
				</p>
			</div>

			<!-- Subscription Mode Switch -->
			<button
				type="button"
				onclick={() => {
					cartStore.isSubscription = !cartStore.isSubscription;
					void cartStore.refreshQuote();
				}}
				class="self-start lg:self-auto inline-flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all cursor-pointer shadow-xs {cartStore.isSubscription
					? 'border-[#B6842D]/55 bg-[#B6842D]/10'
					: 'border-stone-900/10 bg-white hover:border-[#B6842D]/35'}"
			>
				<span
					class="flex h-8 w-8 items-center justify-center rounded-xl {cartStore.isSubscription
						? 'bg-[#B6842D] text-white'
						: 'bg-[#F3EFE6] text-[#8E6216]'}"
				>
					<Sparkles class="h-4 w-4" />
				</span>
				<div>
					<p class="text-xs font-semibold text-[#141815]">
						Mode Langganan Bulanan {cartStore.isSubscription ? 'Aktif' : ''}
					</p>
					<p class="text-[11px] text-[#5C665E]">
						Hemat ekstra <span class="text-[#8E6216] font-mono font-semibold">10%</span> di semua varietas
					</p>
				</div>
			</button>
		</div>

		<!-- Filter & Search Controls -->
		<div
			use:reveal={{ delay: 80 }}
			class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-stone-900/10 bg-white/90 p-3 backdrop-blur-md shadow-xs"
		>
			<div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
				<SlidersHorizontal class="h-4 w-4 text-[#657067] mx-2 shrink-0" />
				{#each filters as f (f.id)}
					<button
						type="button"
						onclick={() => (selectedGrade = f.id)}
						class="shrink-0 rounded-xl px-3.5 py-2 text-xs font-medium transition-all cursor-pointer {selectedGrade === f.id
							? 'bg-[#141815] text-white font-semibold shadow-xs'
							: 'text-[#545E56] hover:bg-stone-900/5 hover:text-[#141815]'}"
					>
						{f.label}
					</button>
				{/each}
			</div>

			<div class="relative min-w-[240px]">
				<Search class="h-4 w-4 text-[#657067] absolute left-3.5 top-1/2 -translate-y-1/2" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Cari Pandan Wangi, Cianjur, Organik..."
					class="w-full rounded-xl border border-stone-900/12 bg-[#F6F4EE] pl-10 pr-4 py-2 text-xs sm:text-sm text-[#141815] placeholder-[#7C857D] focus:border-[#B6842D] focus:bg-white focus:outline-none"
				/>
			</div>
		</div>

		<!-- Product Grid -->
		{#if filteredProducts.length === 0}
			<div class="rounded-3xl border border-stone-900/10 bg-white p-12 text-center space-y-3 shadow-xs">
				<p class="font-serif text-2xl text-[#141815]">Varietas tidak ditemukan</p>
				<p class="text-sm text-[#5C665E]">Coba ubah kata kunci pencarian atau pilih kategori lain.</p>
				<button
					type="button"
					onclick={() => {
						selectedGrade = 'all';
						searchQuery = '';
					}}
					class="rounded-full border border-[#B6842D]/50 px-5 py-2 text-xs font-medium text-[#8E6216] hover:bg-[#B6842D]/10 cursor-pointer"
				>
					Reset Filter
				</button>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each filteredProducts as product (product.id)}
					<ProductCard {product} {onInspect} />
				{/each}
			</div>
		{/if}
	</div>
</section>
