<script lang="ts">
	import { Calculator, Calendar, MapPin, Plus, X } from 'lucide-svelte';
	import { formatIdr, type RiceProduct } from '$lib/api/client';
	import { cartStore } from '$lib/stores/cart.svelte';

	interface Props {
		product: RiceProduct | null;
		onClose: () => void;
		onOpenCalculator: (productId: string) => void;
	}

	let { product, onClose, onOpenCalculator }: Props = $props();
	let selectedPackKg = $state(5);

	$effect(() => {
		if (product) {
			selectedPackKg = product.pack_options[1]?.weight_kg ?? product.pack_options[0]?.weight_kg ?? 5;
		}
	});

	let activeOption = $derived(
		product?.pack_options.find((p) => p.weight_kg === selectedPackKg) ?? product?.pack_options[0]
	);
</script>

{#if product}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 p-4 backdrop-blur-md"
		onclick={(e) => {
			if (e.target === e.currentTarget) onClose();
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') onClose();
		}}
		tabindex="-1"
		role="dialog"
		aria-modal="true"
		aria-label="Detail {product.name}"
	>
		<div
			class="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-stone-900/12 bg-[#FCFBF8] shadow-2xl grid grid-cols-1 md:grid-cols-12"
		>
			<button
				type="button"
				onclick={onClose}
				class="absolute top-4 right-4 z-10 rounded-full border border-stone-900/12 bg-white/90 p-2 text-[#141815] hover:bg-stone-100 cursor-pointer shadow-xs"
				aria-label="Tutup detail"
			>
				<X class="h-4 w-4" />
			</button>

			<div class="md:col-span-5 relative min-h-[240px] bg-[#141815]">
				<img src={product.image_url} alt={product.name} class="h-full w-full object-cover" />
				<div class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
				<div class="absolute bottom-4 left-4 right-4 space-y-1">
					<p class="font-mono text-[11px] text-[#F2CA7A]">{product.harvest_batch}</p>
					<p class="text-xs text-white inline-flex items-center gap-1">
						<MapPin class="h-3.5 w-3.5 text-[#F2CA7A]" />
						{product.origin_region}
					</p>
				</div>
			</div>

			<div class="md:col-span-7 p-6 sm:p-7 space-y-5">
				<div>
					<span class="font-mono text-[11px] uppercase tracking-widest text-[#1B5E3E]">
						{product.glycemic_label} · Digiling {product.milled_date}
					</span>
					<h3 class="font-serif text-3xl text-[#141815] mt-1">{product.name}</h3>
					<p class="text-sm text-[#4E5850] mt-2 leading-relaxed">{product.description}</p>
				</div>

				<div class="flex flex-wrap gap-2">
					{#each product.tasting_notes as note}
						<span
							class="rounded-full border border-[#B6842D]/35 bg-[#B6842D]/10 px-3 py-1 text-xs font-medium text-[#8E6216]"
						>
							{note}
						</span>
					{/each}
				</div>

				<div class="grid grid-cols-3 gap-2 rounded-2xl border border-stone-900/10 bg-[#F4F1EA] p-3 text-center">
					<div>
						<p class="text-[11px] text-[#5C665E]">Rasio Air</p>
						<p class="font-mono text-sm font-semibold text-[#141815]">1 : {Number(product.water_ratio.toFixed(2))}</p>
					</div>
					<div>
						<p class="text-[11px] text-[#5C665E]">Rendam</p>
						<p class="font-mono text-sm font-semibold text-[#141815]">{product.soak_minutes} mnt</p>
					</div>
					<div>
						<p class="text-[11px] text-[#5C665E]">Masak</p>
						<p class="font-mono text-sm font-semibold text-[#141815]">{product.cook_minutes} mnt</p>
					</div>
				</div>

				<div class="space-y-2">
					<p class="text-xs text-[#5C665E]">Pilih Berat Kemasan</p>
					<div class="grid grid-cols-4 gap-2">
						{#each product.pack_options as opt}
							<button
								type="button"
								onclick={() => (selectedPackKg = opt.weight_kg)}
								class="rounded-xl border py-2 text-center font-mono text-xs cursor-pointer {selectedPackKg === opt.weight_kg
									? 'border-[#B6842D] bg-[#B6842D]/12 text-[#8E6216] font-semibold'
									: 'border-stone-900/10 bg-[#F6F4EE] text-[#545E56]'}"
							>
								{opt.weight_kg} kg
							</button>
						{/each}
					</div>
				</div>

				<div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-900/10">
					<div>
						<p class="font-mono text-2xl font-semibold text-[#141815]">
							{formatIdr(activeOption?.unit_price_idr ?? 0)}
						</p>
						<p class="text-xs text-[#657067] inline-flex items-center gap-1">
							<Calendar class="h-3 w-3" />
							Tersedia {product.stock_kg} kg di gudang
						</p>
					</div>

					<div class="flex items-center gap-2">
						<button
							type="button"
							onclick={() => {
								onOpenCalculator(product.id);
								onClose();
							}}
							class="inline-flex items-center gap-1.5 rounded-full border border-stone-900/15 bg-white px-4 py-2.5 text-xs font-medium text-[#141815] hover:bg-stone-100 cursor-pointer"
						>
							<Calculator class="h-3.5 w-3.5 text-[#B6842D]" />
							Takaran
						</button>
						<button
							type="button"
							onclick={() => {
								cartStore.addItem(product, selectedPackKg, 1);
								onClose();
							}}
							class="inline-flex items-center gap-1.5 rounded-full bg-[#141815] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#B6842D] cursor-pointer"
						>
							<Plus class="h-3.5 w-3.5" />
							Masuk Keranjang
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
