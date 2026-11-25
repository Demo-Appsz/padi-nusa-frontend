<script lang="ts">
	const items = [
		'100% BEBAS PEMUTIH & KLORIN',
		'DIGILING SEGAR < 7 HARI',
		'KEMITRAAN 420+ PETANI JAWA & DIY',
		'KEMASAN VAKUM ANTI KUTU',
		'PROMO: PANENBARU (DISKON 10%)',
		'GRATIS ONGKIR JABODETABEK MIN. RP 150RB',
		'BULIR UTUH 98% COLOR-SORTED'
	];
</script>

<div class="border-y border-stone-900/10 bg-[#F2EFE8] py-3.5 overflow-hidden select-none">
	<div class="animate-marquee flex items-center gap-8 whitespace-nowrap">
		{#each [...items, ...items] as text, idx (idx)}
			<span class="inline-flex items-center gap-8 font-mono text-xs tracking-[0.2em] text-[#4E5850]">
				<span>{text}</span>
				<span class="h-1.5 w-1.5 rounded-full bg-[#B6842D]"></span>
			</span>
		{/each}
	</div>
</div>
