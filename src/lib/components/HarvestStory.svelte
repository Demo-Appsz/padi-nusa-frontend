<script lang="ts">
	import { CheckCircle2, Droplets, FlameKindling, ScanSearch, Sprout } from 'lucide-svelte';
	import { reveal, tilt3d } from '$lib/actions/motion';

	interface Stage {
		id: string;
		step: string;
		title: string;
		subtitle: string;
		detail: string;
		metricLabel: string;
		metricValue: string;
		image: string;
	}

	const stages: Stage[] = [
		{
			id: 'panen',
			step: '01',
			title: 'Panen Selektif Petani Mitra',
			subtitle: 'Kadar air gabah dijaga tepat di 14%',
			detail:
				'Kami bermitra langsung dengan 420+ petani di Cianjur, Delanggu, Magelang, dan Sleman. Padi dipanen saat bulir menguning 90% agar aroma alami mencapai puncak.',
			metricLabel: 'Wilayah Sumber',
			metricValue: '6 Sentra Jawa & DIY',
			image: '/images/sawah-harvest.jpg'
		},
		{
			id: 'giling',
			step: '02',
			title: 'Penggilingan Presisi Suhu Rendah',
			subtitle: 'Digiling < 7 hari sebelum pengiriman',
			detail:
				'Berbeda dengan beras gudang yang disimpan berbulan-bulan, gabah kami digiling dalam batch kecil bersuhu rendah agar minyak esensial dan nutrisi kulit ari tetap terjaga.',
			metricLabel: 'Suhu Giling',
			metricValue: '< 38°C Cold-Milled',
			image: '/images/rojolele-delanggu.jpg'
		},
		{
			id: 'sorter',
			step: '03',
			title: 'Color Sorter Optik 3 Tahap',
			subtitle: '98% bulir utuh tanpa pemutih',
			detail:
				'Sensor optik memisahkan gabah, menir, dan bulir kusam secara otomatis sehingga beras putih bersih alami tanpa klorin, pelicin, atau pewangi kimia.',
			metricLabel: 'Kemurnian Bulir',
			metricValue: '98.4% Kepala Utuh',
			image: '/images/heritage-rice.jpg'
		},
		{
			id: 'vakum',
			step: '04',
			title: 'Segel Vakum & Kirim Cepat',
			subtitle: 'Tahan segar hingga 6 bulan tanpa kutu',
			detail:
				'Setiap kemasan food-grade disegel kedap udara untuk mengunci wangi pandan dan mencegah kutu, lalu dikirim langsung dari hub giling ke meja makan Anda.',
			metricLabel: 'Estimasi Tiba',
			metricValue: '1 Hari Jabodetabek',
			image: '/images/mentik-susu.jpg'
		}
	];

	let activeIndex = $state(0);
	let activeStage = $derived(stages[activeIndex]);
</script>

<section id="kisah-sawah" class="relative py-24 px-4 sm:px-6 border-t border-stone-900/10 bg-[#F4F1EA]">
	<div class="mx-auto max-w-6xl space-y-12">
		<div use:reveal class="max-w-2xl space-y-3">
			<span class="font-mono text-xs uppercase tracking-[0.2em] text-[#8E6216]">
				02 · Transparansi Penggilingan
			</span>
			<h2 class="font-serif text-4xl sm:text-5xl text-[#141815]">
				Perjalanan Dari <span class="text-[#1B5E3E]">Teras Sawah</span> ke Piring Hangat
			</h2>
			<p class="text-sm sm:text-base text-[#545E56]">
				Klik setiap tahapan proses untuk melihat standar kualitas di balik setiap karung PadiNusa.
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
			<!-- Interactive Stage Selector -->
			<div class="lg:col-span-6 space-y-3">
				{#each stages as stage, idx (stage.id)}
					<button
						type="button"
						onclick={() => (activeIndex = idx)}
						class="w-full text-left rounded-2xl border p-5 transition-all duration-300 cursor-pointer {activeIndex === idx
							? 'border-[#B6842D]/55 bg-white shadow-[0_16px_36px_-16px_rgba(20,24,21,0.16)]'
							: 'border-stone-900/8 bg-white/60 hover:bg-white hover:border-stone-900/20'}"
					>
						<div class="flex items-start gap-4">
							<span
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-semibold transition-colors {activeIndex === idx
									? 'bg-[#141815] text-[#D4A043]'
									: 'bg-[#ECE7DC] text-[#5C665E]'}"
							>
								{stage.step}
							</span>
							<div class="space-y-1 flex-1">
								<div class="flex items-center justify-between gap-2">
									<h3 class="font-serif text-xl sm:text-2xl text-[#141815]">{stage.title}</h3>
									{#if activeIndex === idx}
										<CheckCircle2 class="h-4 w-4 text-[#B6842D] shrink-0" />
									{/if}
								</div>
								<p class="text-xs font-mono text-[#1B5E3E]">{stage.subtitle}</p>
								{#if activeIndex === idx}
									<p class="text-sm text-[#4E5850] pt-2 leading-relaxed">
										{stage.detail}
									</p>
								{/if}
							</div>
						</div>
					</button>
				{/each}
			</div>

			<!-- Right Interactive Visual Frame -->
			<div class="lg:col-span-6">
				<div use:tilt3d={{ maxTilt: 5, scale: 1.01 }} class="spotlight-card rounded-3xl p-4 bg-white">
					<div class="relative overflow-hidden rounded-2xl aspect-[4/3.6] bg-[#141815]">
						<img
							src={activeStage.image}
							alt={activeStage.title}
							class="h-full w-full object-cover transition-all duration-700"
						/>
						<div
							class="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent"
						></div>

						<!-- Topographic Terraced Sawah SVG Accent -->
						<svg
							viewBox="0 0 400 120"
							class="absolute top-0 left-0 right-0 w-full opacity-35 pointer-events-none"
							fill="none"
						>
							<path d="M0 30 Q100 10 200 35 T400 25" stroke="#F2CA7A" stroke-width="1" />
							<path d="M0 55 Q120 35 240 60 T400 50" stroke="#74C69D" stroke-width="1" />
						</svg>

						<div class="absolute bottom-5 left-5 right-5 grid grid-cols-2 gap-3">
							<div class="rounded-2xl border border-white/50 bg-white/92 p-4 backdrop-blur-xl shadow-lg">
								<p class="text-[11px] font-mono uppercase tracking-wider text-[#657067]">
									Tahap {activeStage.step}
								</p>
								<p class="font-serif text-lg text-[#141815] mt-0.5">{activeStage.title}</p>
							</div>
							<div class="rounded-2xl border border-[#B6842D]/40 bg-white/92 p-4 backdrop-blur-xl shadow-lg">
								<p class="text-[11px] font-mono uppercase tracking-wider text-[#8E6216]">
									{activeStage.metricLabel}
								</p>
								<p class="font-mono text-base sm:text-lg font-semibold text-[#141815] mt-0.5">
									{activeStage.metricValue}
								</p>
							</div>
						</div>
					</div>

					<!-- Bottom craft highlights -->
					<div class="grid grid-cols-4 gap-2 pt-4 text-center text-[11px] text-[#4E5850]">
						<div class="rounded-xl bg-[#F4F1EA] py-2 px-1 flex flex-col items-center gap-1">
							<Sprout class="h-3.5 w-3.5 text-[#1B5E3E]" />
							<span>Bibit Unggul</span>
						</div>
						<div class="rounded-xl bg-[#F4F1EA] py-2 px-1 flex flex-col items-center gap-1">
							<FlameKindling class="h-3.5 w-3.5 text-[#B6842D]" />
							<span>Suhu Rendah</span>
						</div>
						<div class="rounded-xl bg-[#F4F1EA] py-2 px-1 flex flex-col items-center gap-1">
							<ScanSearch class="h-3.5 w-3.5 text-[#1B5E3E]" />
							<span>Optik Sortir</span>
						</div>
						<div class="rounded-xl bg-[#F4F1EA] py-2 px-1 flex flex-col items-center gap-1">
							<Droplets class="h-3.5 w-3.5 text-[#B6842D]" />
							<span>Kadar Air 14%</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
