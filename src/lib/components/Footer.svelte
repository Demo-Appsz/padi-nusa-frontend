<script lang="ts">
	import { Wheat } from 'lucide-svelte';
</script>

<footer class="border-t border-stone-900/10 bg-white py-14 px-4 sm:px-6">
	<div class="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
		<div class="md:col-span-5 space-y-3">
			<div class="flex items-center gap-2.5">
				<span
					class="flex h-8 w-8 items-center justify-center rounded-full bg-[#141815] text-[#D4A043]"
				>
					<Wheat class="h-4 w-4" />
				</span>
				<span class="font-serif text-2xl text-[#141815]">PadiNusa</span>
			</div>
			<p class="text-sm text-[#5C665E] max-w-sm leading-relaxed">
				Kurasi beras single-origin langsung dari lumbung petani mitra di Jawa Barat, Jawa Tengah, dan Yogyakarta.
			</p>
		</div>

		<div class="md:col-span-3 space-y-2 text-xs text-[#545E56]">
			<p class="font-mono uppercase tracking-wider text-[#8E6216]">Kode Promo Aktif</p>
			<p><span class="font-mono font-semibold text-[#141815]">PANENBARU</span> — Diskon 10%</p>
			<p><span class="font-mono font-semibold text-[#141815]">LANGGANAN15</span> — Diskon 15%</p>
			<p><span class="font-mono font-semibold text-[#141815]">ONGKIRGRATIS</span> — Bebas Ongkir</p>
		</div>

		<div class="md:col-span-4 space-y-2 text-xs text-[#545E56]">
			<p class="font-mono uppercase tracking-wider text-[#8E6216]">Navigasi</p>
			<div class="flex flex-col gap-1.5">
				<a href="#katalog" class="hover:text-[#141815]">Katalog Varietas Beras</a>
				<a href="#kisah-sawah" class="hover:text-[#141815]">Proses Penggilingan</a>
				<a href="#kalkulator-masak" class="hover:text-[#141815]">Kalkulator Takaran Air</a>
				<a href="/admin" class="text-[#8E6216] font-medium hover:underline">Panel Pengelola Toko (/admin)</a>
			</div>
		</div>
	</div>
	<div class="mx-auto max-w-6xl mt-10 pt-6 border-t border-stone-900/10 flex flex-col sm:flex-row justify-between gap-2 text-[11px] text-[#6E766D]">
		<p>© 2026 PadiNusa Artisanal Rice. Dibangun dengan SvelteKit &amp; Rust Hexagonal Architecture.</p>
		<p class="font-mono">Single-Origin · Cold-Milled · Vacuum-Sealed</p>
	</div>
</footer>
