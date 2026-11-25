<script lang="ts">
	import { ArrowUpRight, Calculator, Leaf, Sparkles, Truck } from 'lucide-svelte';
	import { magnetic, tilt3d } from '$lib/actions/motion';

	let pointerX = $state(50);
	let pointerY = $state(40);

	function handleHeroMove(e: MouseEvent) {
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		pointerX = ((e.clientX - rect.left) / rect.width) * 100;
		pointerY = ((e.clientY - rect.top) / rect.height) * 100;
	}
</script>

<section
	onmousemove={handleHeroMove}
	aria-label="Hero PadiNusa"
	class="relative min-h-[92vh] flex items-center pt-28 pb-16 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-white via-[#FAF9F6] to-[#F5F2EB]"
>
	<!-- Dynamic cursor-reactive warm sunlit aura -->
	<div
		class="pointer-events-none absolute inset-0 transition-opacity duration-700"
		style="background: radial-gradient(680px circle at {pointerX}% {pointerY}%, rgba(212, 160, 67, 0.14), rgba(27, 94, 62, 0.06) 42%, transparent 72%);"
	></div>
	<div
		class="pointer-events-none absolute -top-28 right-[-8%] h-[480px] w-[480px] rounded-full bg-[#D4A043]/15 blur-[130px]"
	></div>
	<div
		class="pointer-events-none absolute -bottom-24 left-[-8%] h-[420px] w-[420px] rounded-full bg-[#2D6A4F]/10 blur-[130px]"
	></div>

	<div class="relative mx-auto max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
		<!-- Left Editorial Copy -->
		<div class="lg:col-span-7 space-y-7">
			<div
				class="inline-flex items-center gap-2 rounded-full border border-[#B6842D]/30 bg-white/90 px-3.5 py-1.5 text-xs font-mono uppercase tracking-[0.16em] text-[#8E6216] shadow-xs"
			>
				<Sparkles class="h-3.5 w-3.5 text-[#B6842D]" />
				Panen Musim Kemarau 2026 · Langsung dari Penggilingan
			</div>

			<h1 class="font-serif text-5xl sm:text-6xl lg:text-[4.5rem] leading-[1.03] tracking-tight text-[#141815]">
				Beras Pulen
				<span class="text-[#B6842D]">Artisanal</span>
				<br />
				dari Sawah Terbaik
				<span class="text-[#1B5E3E]">Nusantara.</span>
			</h1>

			<p class="max-w-xl text-base sm:text-lg leading-relaxed text-[#4E5850]">
				Setiap karung PadiNusa digiling suhu rendah kurang dari 7 hari sebelum dikirim ke dapur Anda.
				Bebas pemutih, tanpa pewangi sintetis, menjaga aroma pandan alami dan kepulenan sejati.
			</p>

			<div class="flex flex-wrap items-center gap-3.5 pt-1">
				<a
					href="#katalog"
					use:magnetic={0.22}
					class="inline-flex items-center gap-2 rounded-full bg-[#141815] px-7 py-3.5 text-sm font-semibold text-[#FAF9F6] shadow-[0_14px_34px_-10px_rgba(20,24,21,0.38)] hover:bg-[#B6842D] transition-all"
				>
					Jelajahi Koleksi Beras
					<ArrowUpRight class="h-4 w-4" />
				</a>

				<a
					href="#kalkulator-masak"
					use:magnetic={0.18}
					class="inline-flex items-center gap-2 rounded-full border border-stone-900/15 bg-white/90 px-6 py-3.5 text-sm font-medium text-[#141815] backdrop-blur-md hover:border-[#B6842D]/50 hover:bg-white transition-all shadow-xs"
				>
					<Calculator class="h-4 w-4 text-[#B6842D]" />
					Hitung Takaran Air
				</a>
			</div>

			<!-- Trust Metrics Row -->
			<div class="grid grid-cols-3 gap-4 pt-5 border-t border-stone-900/10 max-w-lg">
				<div>
					<p class="font-serif text-2xl sm:text-3xl text-[#141815]">6 Varietas</p>
					<p class="text-xs text-[#657067] mt-0.5">Single-origin Jawa &amp; DIY</p>
				</div>
				<div>
					<p class="font-serif text-2xl sm:text-3xl text-[#B6842D]">&lt; 7 Hari</p>
					<p class="text-xs text-[#657067] mt-0.5">Usia giling saat dikirim</p>
				</div>
				<div>
					<p class="font-serif text-2xl sm:text-3xl text-[#1B5E3E]">100% Murni</p>
					<p class="text-xs text-[#657067] mt-0.5">Tanpa pemutih &amp; pengawet</p>
				</div>
			</div>
		</div>

		<!-- Right Interactive 3D Gallery Frame -->
		<div class="lg:col-span-5 relative">
			<div
				use:tilt3d={{ maxTilt: 7, scale: 1.015 }}
				class="spotlight-card rounded-3xl p-3 bg-white shadow-[0_28px_60px_-20px_rgba(20,24,21,0.22)]"
			>
				<div class="relative overflow-hidden rounded-2xl aspect-[4/4.6] bg-[#101311]">
					<img
						src="/images/hero-rice.jpg"
						alt="Bulir beras premium PadiNusa dalam mangkuk keramik obsidian"
						class="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
					/>
					<div
						class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent"
					></div>

					<!-- Top Live Batch Tag -->
					<div class="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
						<span
							class="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/90 px-3 py-1 text-[11px] font-mono text-[#141815] backdrop-blur-md shadow-xs"
						>
							<span class="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
							BATCH #PANEN-26-CJR04
						</span>
						<span
							class="rounded-full bg-[#D4A043] px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs"
						>
							Mulai Rp 17.500/kg
						</span>
					</div>

					<!-- Bottom Frosted White Glass Specs Card -->
					<div
						class="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/60 bg-white/92 p-4 backdrop-blur-xl space-y-2.5 shadow-xl"
					>
						<div class="flex items-center justify-between">
							<div>
								<p class="text-[11px] font-mono uppercase tracking-wider text-[#8E6216]">
									Rekomendasi Minggu Ini
								</p>
								<p class="font-serif text-xl text-[#141815]">Pandan Wangi Cianjur</p>
							</div>
							<div class="text-right">
								<span class="text-xs text-[#657067]">Pulen</span>
								<p class="font-mono text-sm font-semibold text-[#1B5E3E]">9 / 10</p>
							</div>
						</div>
						<div class="flex items-center justify-between text-xs text-[#4E5850] pt-1.5 border-t border-stone-900/10">
							<span class="inline-flex items-center gap-1.5">
								<Leaf class="h-3.5 w-3.5 text-[#1B5E3E]" />
								Aroma pandan alami
							</span>
							<span class="inline-flex items-center gap-1.5">
								<Truck class="h-3.5 w-3.5 text-[#B6842D]" />
								Gratis ongkir Jabodetabek*
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
