<script lang="ts">
	import { Quote, Star } from 'lucide-svelte';
	import { reveal, tilt3d } from '$lib/actions/motion';

	const reviews = [
		{
			name: 'Nadia Kusuma',
			role: 'Ibu Rumah Tangga · Jakarta Selatan',
			rice: 'Pandan Wangi Cianjur 10kg',
			text: 'Begitu rice cooker dibuka, aroma pandan alaminya langsung memenuhi dapur. Anak-anak jadi lahap makan nasi hangat bahkan hanya dengan telur dadar.'
		},
		{
			name: 'Chef Raka Pratama',
			role: 'Owner Kedai Nusantara · Kemang',
			rice: 'Rojolele Delanggu 25kg',
			text: 'Konsistensi kadar airnya luar biasa. Nasi tidak cepat menguning sampai malam dan teksturnya pas untuk hidangan gulai maupun bakar-bakaran.'
		},
		{
			name: 'dr. Sinta Maheswari',
			role: 'Nutrisionis · Bandung',
			rice: 'Beras Merah Cempo & Hitam Wulung',
			text: 'Dengan panduan rendam dari PadiNusa, beras merah Cempo jadi empuk dan ramah di lambung pasien. Kemasan vakumnya juga bersih sekali.'
		}
	];
</script>

<section class="py-20 px-4 sm:px-6 border-t border-stone-900/10 bg-[#F4F1EA]">
	<div class="mx-auto max-w-6xl space-y-10">
		<div use:reveal class="flex flex-col md:flex-row md:items-end justify-between gap-4">
			<div class="space-y-2">
				<span class="font-mono text-xs uppercase tracking-[0.2em] text-[#8E6216]">
					04 · Kepercayaan Dapur Indonesia
				</span>
				<h2 class="font-serif text-4xl text-[#141815]">
					Dari Dapur Keluarga hingga <span class="text-[#B6842D]">Chef Profesional</span>
				</h2>
			</div>
			<div class="inline-flex items-center gap-2 rounded-full border border-stone-900/10 bg-white px-4 py-2 text-xs shadow-xs">
				<div class="flex text-[#D4A043]">
					{#each Array(5) as _}
						<Star class="h-3.5 w-3.5 fill-current" />
					{/each}
				</div>
				<span class="font-mono font-semibold text-[#141815]">4.9 / 5.0</span>
				<span class="text-[#657067]">(1.840+ ulasan)</span>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			{#each reviews as rev, idx (rev.name)}
				<div
					use:tilt3d={{ maxTilt: 4, scale: 1.01 }}
					use:reveal={{ delay: idx * 90 }}
					class="spotlight-card rounded-3xl p-6 flex flex-col justify-between gap-6"
				>
					<div class="space-y-4">
						<Quote class="h-6 w-6 text-[#D4A043]" />
						<p class="text-sm leading-relaxed text-[#3D463F]">"{rev.text}"</p>
					</div>
					<div class="pt-4 border-t border-stone-900/10">
						<p class="font-semibold text-sm text-[#141815]">{rev.name}</p>
						<p class="text-xs text-[#657067]">{rev.role}</p>
						<span
							class="inline-block mt-2 rounded-full bg-[#B6842D]/12 border border-[#B6842D]/25 px-2.5 py-0.5 font-mono text-[10px] font-medium text-[#8E6216]"
						>
							{rev.rice}
						</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
