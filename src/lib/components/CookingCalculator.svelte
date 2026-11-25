<script lang="ts">
	import { Calculator, Clock, Droplets, Flame, Sparkles, Utensils } from 'lucide-svelte';
	import {
		fetchCookingGuide,
		type CookingGuide,
		type RiceProduct
	} from '$lib/api/client';
	import { reveal, tilt3d } from '$lib/actions/motion';

	interface Props {
		products: RiceProduct[];
		selectedProductId: string;
		onSelectProduct: (id: string) => void;
	}

	let { products, selectedProductId, onSelectProduct }: Props = $props();

	let portions = $state(4);
	let apiGuide = $state<CookingGuide | null>(null);
	let isLoading = $state(false);

	let activeProduct = $derived(
		products.find((p) => p.id === selectedProductId) ?? products[0]
	);

	let localGuide = $derived.by<CookingGuide | null>(() => {
		if (!activeProduct) return null;
		const riceGrams = portions * 75;
		const riceCups = Math.round((riceGrams / 180) * 10) / 10;
		const waterCups = Math.round(riceCups * activeProduct.water_ratio * 10) / 10;
		const waterMl = Math.round((riceGrams / 180) * activeProduct.water_ratio * 240);
		return {
			portions,
			rice_grams: riceGrams,
			water_ml: waterMl,
			rice_cups: riceCups,
			water_cups: waterCups,
			soak_minutes: activeProduct.soak_minutes,
			cook_minutes: activeProduct.cook_minutes,
			rest_minutes: 10,
			chef_tip:
				activeProduct.soak_minutes >= 25
					? `Rendam ${activeProduct.soak_minutes} menit sebelum dimasak agar kulit ari melunak dan nutrisi terjaga optimal.`
					: 'Setelah matang, diamkan 10 menit dalam mode warm sebelum diaduk perlahan dengan centong kayu.'
		};
	});

	let guide = $derived(apiGuide ?? localGuide);

	$effect(() => {
		const id = activeProduct?.id;
		const p = portions;
		if (!id) return;

		let cancelled = false;
		isLoading = true;
		fetchCookingGuide(id, p)
			.then((res) => {
				if (!cancelled) apiGuide = res;
			})
			.catch(() => {
				if (!cancelled) apiGuide = null;
			})
			.finally(() => {
				if (!cancelled) isLoading = false;
			});

		return () => {
			cancelled = true;
		};
	});

	let waterFillPct = $derived(
		guide ? Math.min(88, Math.max(24, Math.round((guide.water_ml / 2600) * 100))) : 45
	);
</script>

<section id="kalkulator-masak" class="relative py-24 px-4 sm:px-6 overflow-hidden bg-[#FAF9F6]">
	<div
		class="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[540px] w-[540px] rounded-full bg-[#D4A043]/10 blur-[150px]"
	></div>

	<div class="relative mx-auto max-w-6xl space-y-10">
		<div use:reveal class="flex flex-col md:flex-row md:items-end justify-between gap-4">
			<div class="space-y-3 max-w-2xl">
				<span class="font-mono text-xs uppercase tracking-[0.2em] text-[#8E6216]">
					03 · Lab Takaran Presisi
				</span>
				<h2 class="font-serif text-4xl sm:text-5xl text-[#141815]">
					Kalkulator <span class="text-[#B6842D]">Air &amp; Porsi</span> Masak
				</h2>
				<p class="text-sm sm:text-base text-[#545E56]">
					Setiap varietas memiliki daya serap air berbeda. Sesuaikan jumlah porsi untuk mendapatkan nasi pulen sempurna.
				</p>
			</div>
			<span class="inline-flex items-center gap-1.5 rounded-full border border-stone-900/10 bg-white px-3.5 py-1.5 font-mono text-[11px] text-[#4E5850] shadow-xs">
				<Calculator class="h-3.5 w-3.5 text-[#B6842D]" />
				Terhubung ke Rust Domain Calculator
			</span>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
			<!-- Controls Panel -->
			<div class="lg:col-span-7 spotlight-card rounded-3xl p-6 sm:p-8 space-y-7">
				<div class="space-y-3">
					<p class="text-xs font-mono uppercase tracking-wider text-[#5C665E]">
						1. Pilih Varietas Beras
					</p>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
						{#each products as prod (prod.id)}
							<button
								type="button"
								onclick={() => onSelectProduct(prod.id)}
								class="rounded-2xl border p-3.5 text-left transition-all cursor-pointer {activeProduct?.id === prod.id
									? 'border-[#B6842D] bg-[#B6842D]/10 shadow-xs'
									: 'border-stone-900/10 bg-[#F6F4EE] hover:bg-white hover:border-stone-900/25'}"
							>
								<div class="flex items-center justify-between gap-2">
									<span class="font-medium text-sm text-[#141815]">{prod.name}</span>
									<span class="font-mono text-[11px] font-semibold text-[#8E6216]">1:{Number(prod.water_ratio.toFixed(2))}</span>
								</div>
								<p class="text-[11px] text-[#657067] mt-1">{prod.glycemic_label}</p>
							</button>
						{/each}
					</div>
				</div>

				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<label for="portion-range" class="text-xs font-mono uppercase tracking-wider text-[#5C665E]">
							2. Jumlah Porsi Makan
						</label>
						<span class="rounded-full bg-[#B6842D]/12 border border-[#B6842D]/35 px-3 py-1 font-mono text-sm font-semibold text-[#8E6216]">
							{portions} Porsi
						</span>
					</div>

					<input
						id="portion-range"
						type="range"
						min="1"
						max="20"
						bind:value={portions}
						class="w-full accent-[#B6842D] cursor-pointer"
					/>

					<div class="flex flex-wrap gap-2">
						{#each [2, 4, 6, 10, 15] as preset}
							<button
								type="button"
								onclick={() => (portions = preset)}
								class="rounded-full border px-3.5 py-1 text-xs font-mono cursor-pointer transition-colors {portions === preset
									? 'border-[#141815] bg-[#141815] text-white font-semibold'
									: 'border-stone-900/12 bg-[#F6F4EE] text-[#4E5850] hover:border-stone-900/25'}"
							>
								{preset} Porsi
							</button>
						{/each}
					</div>
				</div>

				{#if guide}
					<div class="rounded-2xl border border-[#1B5E3E]/20 bg-[#ECF5F0] p-4 flex items-start gap-3">
						<Sparkles class="h-4 w-4 text-[#1B5E3E] shrink-0 mt-0.5" />
						<div class="space-y-1">
							<p class="text-xs font-semibold text-[#1B5E3E]">Tips Chef PadiNusa</p>
							<p class="text-xs sm:text-sm text-[#2E3B33] leading-relaxed">{guide.chef_tip}</p>
						</div>
					</div>
				{/if}
			</div>

			<!-- Animated Live Vessel Output -->
			<div use:tilt3d={{ maxTilt: 4, scale: 1.01 }} class="lg:col-span-5 spotlight-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-xs font-mono uppercase tracking-wider text-[#8E6216]">
							Hasil Kalibrasi
						</p>
						<h3 class="font-serif text-2xl text-[#141815] mt-0.5">{activeProduct?.name}</h3>
					</div>
					{#if isLoading}
						<span class="text-[11px] font-mono text-[#657067] animate-pulse">Menghitung...</span>
					{/if}
				</div>

				<!-- Glass Measuring Vessel Visualization -->
				{#if guide}
					<div class="relative mx-auto w-full max-w-[260px] h-52 rounded-b-3xl rounded-t-xl border-2 border-stone-900/15 bg-[#F6F4EE] overflow-hidden flex flex-col justify-end p-4 shadow-inner">
						<!-- Rice layer -->
						<div
							class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#E6DFCE] to-[#F7F3E8] border-t border-[#D4CBB5] transition-all duration-500"
							style="height: {Math.max(18, Math.round(waterFillPct * 0.45))}%"
						></div>
						<!-- Water layer -->
						<div
							class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-sky-500/20 via-sky-300/15 to-sky-200/20 border-t border-sky-400/50 transition-all duration-700"
							style="height: {waterFillPct}%"
						></div>

						<div class="relative z-10 grid grid-cols-2 gap-3 text-center">
							<div class="rounded-xl bg-white/92 p-2.5 backdrop-blur-md border border-stone-900/10 shadow-xs">
								<Utensils class="h-3.5 w-3.5 text-[#B6842D] mx-auto mb-1" />
								<p class="font-mono text-lg font-semibold text-[#141815]">{guide.rice_grams}g</p>
								<p class="text-[10px] text-[#5C665E]">{guide.rice_cups.toFixed(1)} cup beras</p>
							</div>
							<div class="rounded-xl bg-white/92 p-2.5 backdrop-blur-md border border-stone-900/10 shadow-xs">
								<Droplets class="h-3.5 w-3.5 text-sky-600 mx-auto mb-1" />
								<p class="font-mono text-lg font-semibold text-[#141815]">{guide.water_ml}ml</p>
								<p class="text-[10px] text-[#5C665E]">{guide.water_cups.toFixed(1)} cup air</p>
							</div>
						</div>
					</div>

					<div class="grid grid-cols-3 gap-2.5 pt-2 border-t border-stone-900/10 text-center">
						<div class="rounded-2xl bg-[#F4F1EA] p-3">
							<Clock class="h-3.5 w-3.5 text-[#8E6216] mx-auto mb-1" />
							<p class="font-mono text-sm font-semibold text-[#141815]">{guide.soak_minutes} mnt</p>
							<p class="text-[10px] text-[#657067]">Rendam</p>
						</div>
						<div class="rounded-2xl bg-[#F4F1EA] p-3">
							<Flame class="h-3.5 w-3.5 text-amber-600 mx-auto mb-1" />
							<p class="font-mono text-sm font-semibold text-[#141815]">{guide.cook_minutes} mnt</p>
							<p class="text-[10px] text-[#657067]">Masak</p>
						</div>
						<div class="rounded-2xl bg-[#F4F1EA] p-3">
							<Sparkles class="h-3.5 w-3.5 text-[#1B5E3E] mx-auto mb-1" />
							<p class="font-mono text-sm font-semibold text-[#141815]">{guide.rest_minutes} mnt</p>
							<p class="text-[10px] text-[#657067]">Diamkan</p>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
