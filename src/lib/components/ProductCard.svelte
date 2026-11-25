<script lang="ts">
	import { Eye, MapPin, Plus, Sparkles } from 'lucide-svelte';
	import { formatIdr, type RiceProduct } from '$lib/api/client';
	import { cartStore } from '$lib/stores/cart.svelte';
	import { magnetic, tilt3d } from '$lib/actions/motion';

	interface Props {
		product: RiceProduct;
		onInspect: (product: RiceProduct) => void;
	}

	let { product, onInspect }: Props = $props();

	let selectedPackOverride = $state<number | null>(null);
	let selectedPackKg = $derived(
		selectedPackOverride ??
			product.pack_options[1]?.weight_kg ??
			product.pack_options[0]?.weight_kg ??
			5
	);

	let activeOption = $derived(
		product.pack_options.find((o) => o.weight_kg === selectedPackKg) ?? product.pack_options[0]
	);

	let displayPrice = $derived(
		activeOption
			? cartStore.isSubscription
				? Math.round(activeOption.unit_price_idr * 0.9)
				: activeOption.unit_price_idr
			: product.base_price_per_kg_idr * selectedPackKg
	);

	const gradeLabel: Record<string, string> = {
		artisanal: 'Artisanal',
		organik: 'Organik',
		heritage: 'Heritage',
		premium: 'Premium'
	};
</script>

<article
	use:tilt3d={{ maxTilt: 5, scale: 1.01 }}
	class="spotlight-card group rounded-3xl p-4 flex flex-col justify-between gap-4"
>
	<div>
		<!-- Image Frame -->
		<div class="relative overflow-hidden rounded-2xl aspect-[16/11] bg-[#141815]">
			<img
				src={product.image_url}
				alt={product.name}
				class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
			/>
			<div class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/15"></div>

			<div class="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
				<span
					class="rounded-full border border-white/40 bg-white/92 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[#141815] backdrop-blur-md shadow-xs"
				>
					{gradeLabel[product.grade] ?? product.grade}
				</span>

				{#if product.badge}
					<span
						class="inline-flex items-center gap-1 rounded-full bg-[#D4A043] px-2.5 py-1 text-[10px] font-semibold text-white shadow-xs"
					>
						<Sparkles class="h-2.5 w-2.5" />
						{product.badge}
					</span>
				{/if}
			</div>

			<div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/95">
				<span class="inline-flex items-center gap-1 drop-shadow-xs">
					<MapPin class="h-3 w-3 text-[#F2CA7A]" />
					{product.origin_region}
				</span>
				<span class="rounded-full bg-black/55 px-2 py-0.5 font-mono text-[10px] text-emerald-300 backdrop-blur-xs">
					Stok {product.stock_kg} kg
				</span>
			</div>
		</div>

		<!-- Title & Tagline -->
		<div class="mt-4 space-y-1.5">
			<div class="flex items-start justify-between gap-2">
				<h3 class="font-serif text-2xl leading-tight text-[#141815] group-hover:text-[#8E6216] transition-colors">
					{product.name}
				</h3>
				<button
					type="button"
					onclick={() => onInspect(product)}
					class="shrink-0 rounded-full border border-stone-900/12 bg-[#F5F2EB] p-2 text-[#4E5850] hover:border-[#B6842D]/50 hover:text-[#141815] transition-colors cursor-pointer"
					title="Lihat detail profil bulir & rasa"
					aria-label="Detail {product.name}"
				>
					<Eye class="h-3.5 w-3.5" />
				</button>
			</div>
			<p class="text-xs sm:text-sm text-[#5C665E] line-clamp-2">{product.tagline}</p>
		</div>

		<!-- Texture Bars -->
		<div class="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-stone-900/8 bg-[#F4F1EA] p-3">
			<div>
				<div class="flex justify-between text-[11px] text-[#5C665E] mb-1">
					<span>Kepulenan</span>
					<span class="font-mono font-medium text-[#141815]">{product.pulen_score}/10</span>
				</div>
				<div class="h-1.5 rounded-full bg-stone-900/10 overflow-hidden">
					<div
						class="h-full rounded-full bg-gradient-to-r from-[#1B5E3E] to-[#40916C]"
						style="width: {product.pulen_score * 10}%"
					></div>
				</div>
			</div>
			<div>
				<div class="flex justify-between text-[11px] text-[#5C665E] mb-1">
					<span>Aroma</span>
					<span class="font-mono font-medium text-[#141815]">{product.aroma_score}/10</span>
				</div>
				<div class="h-1.5 rounded-full bg-stone-900/10 overflow-hidden">
					<div
						class="h-full rounded-full bg-gradient-to-r from-[#A6741D] to-[#D4A043]"
						style="width: {product.aroma_score * 10}%"
					></div>
				</div>
			</div>
		</div>

		<!-- Interactive Pack Size Selector -->
		<div class="mt-4">
			<div class="flex items-center justify-between text-[11px] text-[#5C665E] mb-2">
				<span>Pilih Kemasan</span>
				{#if activeOption && activeOption.discount_percent > 0}
					<span class="font-mono font-medium text-[#1B5E3E]">Hemat {activeOption.discount_percent}% karung besar</span>
				{/if}
			</div>
			<div class="grid grid-cols-4 gap-1.5">
				{#each product.pack_options as pack (pack.weight_kg)}
					<button
						type="button"
						onclick={() => (selectedPackOverride = pack.weight_kg)}
						class="rounded-xl border py-1.5 text-xs font-mono transition-all cursor-pointer {selectedPackKg === pack.weight_kg
							? 'border-[#B6842D] bg-[#B6842D]/12 text-[#8E6216] font-semibold shadow-xs'
							: 'border-stone-900/10 bg-[#F7F5EF] text-[#545E56] hover:border-stone-900/25 hover:text-[#141815]'}"
					>
						{pack.weight_kg}kg
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- Footer Price + Add CTA -->
	<div class="pt-3 border-t border-stone-900/10 flex items-center justify-between gap-3">
		<div>
			<div class="flex items-baseline gap-1.5">
				<span class="font-mono text-lg font-semibold text-[#141815]">
					{formatIdr(displayPrice)}
				</span>
			</div>
			<p class="text-[11px] text-[#657067]">
				per {selectedPackKg} kg · {formatIdr(Math.round(displayPrice / selectedPackKg))}/kg
			</p>
		</div>

		<button
			type="button"
			use:magnetic={0.2}
			disabled={product.stock_kg < selectedPackKg}
			onclick={() => cartStore.addItem(product, selectedPackKg, 1)}
			class="inline-flex items-center gap-1.5 rounded-full bg-[#141815] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#B6842D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
		>
			<Plus class="h-3.5 w-3.5" />
			Tambah
		</button>
	</div>
</article>
