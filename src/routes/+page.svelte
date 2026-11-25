<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchProducts, type RiceProduct } from '$lib/api/client';
	import Navbar from '$lib/components/Navbar.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import MarqueeTicker from '$lib/components/MarqueeTicker.svelte';
	import ProductCatalog from '$lib/components/ProductCatalog.svelte';
	import ProductModal from '$lib/components/ProductModal.svelte';
	import HarvestStory from '$lib/components/HarvestStory.svelte';
	import CookingCalculator from '$lib/components/CookingCalculator.svelte';
	import TestimonialsBento from '$lib/components/TestimonialsBento.svelte';
	import CartDrawer from '$lib/components/CartDrawer.svelte';
	import CheckoutModal from '$lib/components/CheckoutModal.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let products = $state<RiceProduct[]>([]);
	let isLoading = $state(true);
	let loadError = $state<string | null>(null);
	let inspectedProduct = $state<RiceProduct | null>(null);
	let calculatorProductId = $state('pandan-wangi-cianjur');

	async function loadCatalog() {
		try {
			const data = await fetchProducts();
			products = data;
			if (data.length > 0 && !data.some((p) => p.id === calculatorProductId)) {
				calculatorProductId = data[0].id;
			}
			loadError = null;
		} catch (err) {
			loadError = err instanceof Error ? err.message : 'Gagal memuat katalog beras';
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		void loadCatalog();
	});

	function scrollToCalculator(productId: string) {
		calculatorProductId = productId;
		document.getElementById('kalkulator-masak')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<Navbar activeRoute="store" />

<main>
	<Hero />
	<MarqueeTicker />

	{#if isLoading}
		<section class="py-24 px-4 sm:px-6 mx-auto max-w-6xl">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				{#each Array(3) as _}
					<div class="h-96 rounded-3xl border border-stone-900/10 bg-white animate-pulse"></div>
				{/each}
			</div>
		</section>
	{:else if loadError}
		<section class="py-20 px-4 text-center space-y-3">
			<p class="font-serif text-2xl text-rose-700">Koneksi ke API PadiNusa terganggu</p>
			<p class="text-sm text-[#5C665E]">{loadError}</p>
			<button
				type="button"
				onclick={() => void loadCatalog()}
				class="rounded-full bg-[#141815] px-5 py-2 text-xs font-semibold text-white cursor-pointer"
			>
				Muat Ulang Katalog
			</button>
		</section>
	{:else}
		<ProductCatalog {products} onInspect={(p) => (inspectedProduct = p)} />
	{/if}

	<HarvestStory />

	{#if products.length > 0}
		<CookingCalculator
			{products}
			selectedProductId={calculatorProductId}
			onSelectProduct={(id) => (calculatorProductId = id)}
		/>
	{/if}

	<TestimonialsBento />
</main>

<Footer />

<ProductModal
	product={inspectedProduct}
	onClose={() => (inspectedProduct = null)}
	onOpenCalculator={scrollToCalculator}
/>

<CartDrawer />
<CheckoutModal onOrderPlaced={() => void loadCatalog()} />
