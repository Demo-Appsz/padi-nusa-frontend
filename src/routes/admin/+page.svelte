<script lang="ts">
	import { onMount } from 'svelte';
	import { Package, Plus, RefreshCw, Truck, Wheat } from 'lucide-svelte';
	import {
		fetchOrdersApi,
		fetchProducts,
		formatIdr,
		restockProductApi,
		updateOrderStatusApi,
		type OrderRecord,
		type OrderStatus,
		type RiceProduct
	} from '$lib/api/client';
	import Navbar from '$lib/components/Navbar.svelte';

	let products = $state<RiceProduct[]>([]);
	let orders = $state<OrderRecord[]>([]);
	let isLoading = $state(true);
	let actionError = $state<string | null>(null);

	const statusLabels: Record<OrderStatus, string> = {
		menunggu_konfirmasi: 'Menunggu Konfirmasi',
		diproses_penggilingan: 'Diproses Penggilingan',
		dikirim: 'Dalam Pengiriman',
		selesai: 'Selesai',
		dibatalkan: 'Dibatalkan'
	};

	const nextStatusMap: Partial<Record<OrderStatus, { next: OrderStatus; label: string }>> = {
		menunggu_konfirmasi: {
			next: 'diproses_penggilingan',
			label: 'Proses Giling'
		},
		diproses_penggilingan: {
			next: 'dikirim',
			label: 'Kirim Kurir'
		},
		dikirim: {
			next: 'selesai',
			label: 'Tandai Selesai'
		}
	};

	async function refreshAll() {
		isLoading = true;
		actionError = null;
		try {
			const [p, o] = await Promise.all([fetchProducts(), fetchOrdersApi()]);
			products = p;
			orders = o;
		} catch (err) {
			actionError = err instanceof Error ? err.message : 'Gagal memuat data panel';
		} finally {
			isLoading = false;
		}
	}

	async function advanceStatus(orderId: string, next: OrderStatus) {
		actionError = null;
		try {
			const updated = await updateOrderStatusApi(orderId, next);
			orders = orders.map((o) => (o.id === orderId ? updated : o));
		} catch (err) {
			actionError = err instanceof Error ? err.message : 'Gagal memperbarui status';
		}
	}

	async function quickRestock(productId: string) {
		actionError = null;
		try {
			const updated = await restockProductApi(productId, 50);
			products = products.map((p) => (p.id === productId ? updated : p));
		} catch (err) {
			actionError = err instanceof Error ? err.message : 'Gagal menambah stok';
		}
	}

	onMount(() => {
		void refreshAll();
	});

	let totalStockKg = $derived(products.reduce((acc, p) => acc + p.stock_kg, 0));
	let totalRevenue = $derived(
		orders.filter((o) => o.status !== 'dibatalkan').reduce((acc, o) => acc + o.total_idr, 0)
	);
</script>

<Navbar activeRoute="admin" />

<main class="min-h-screen pt-28 pb-20 px-4 sm:px-6 mx-auto max-w-6xl space-y-10">
	<div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
		<div>
			<span class="font-mono text-xs uppercase tracking-[0.2em] text-[#8E6216]">
				PadiNusa Operations
			</span>
			<h1 class="font-serif text-4xl text-[#141815] mt-1">Panel Stok &amp; Pesanan</h1>
		</div>
		<button
			type="button"
			onclick={() => void refreshAll()}
			class="inline-flex items-center gap-2 rounded-full border border-stone-900/12 bg-white px-4 py-2 text-xs font-medium text-[#141815] hover:bg-stone-100 cursor-pointer self-start shadow-xs"
		>
			<RefreshCw class="h-3.5 w-3.5 {isLoading ? 'animate-spin' : ''}" />
			Segarkan Data
		</button>
	</div>

	{#if actionError}
		<div class="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-xs text-rose-700">
			{actionError}
		</div>
	{/if}

	<!-- Summary Metrics -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
		<div class="spotlight-card rounded-2xl p-5">
			<p class="text-xs text-[#5C665E] flex items-center gap-1.5">
				<Wheat class="h-3.5 w-3.5 text-[#B6842D]" /> Total Stok Gudang
			</p>
			<p class="font-mono text-2xl font-semibold text-[#141815] mt-1">{totalStockKg} kg</p>
		</div>
		<div class="spotlight-card rounded-2xl p-5">
			<p class="text-xs text-[#5C665E] flex items-center gap-1.5">
				<Package class="h-3.5 w-3.5 text-[#1B5E3E]" /> Total Pesanan Masuk
			</p>
			<p class="font-mono text-2xl font-semibold text-[#141815] mt-1">{orders.length}</p>
		</div>
		<div class="spotlight-card rounded-2xl p-5">
			<p class="text-xs text-[#5C665E] flex items-center gap-1.5">
				<Truck class="h-3.5 w-3.5 text-[#B6842D]" /> Nilai Pesanan Aktif
			</p>
			<p class="font-mono text-2xl font-semibold text-[#8E6216] mt-1">{formatIdr(totalRevenue)}</p>
		</div>
	</div>

	<!-- Orders Table -->
	<section class="space-y-4">
		<h2 class="font-serif text-2xl text-[#141815]">Antrean Pesanan</h2>
		{#if orders.length === 0}
			<div class="rounded-3xl border border-stone-900/10 bg-white p-10 text-center text-sm text-[#5C665E] shadow-xs">
				Belum ada pesanan masuk. Coba lakukan checkout dari halaman toko untuk melihat pesanan muncul secara real-time.
			</div>
		{:else}
			<div class="space-y-3">
				{#each orders as order (order.id)}
					{@const nextStep = nextStatusMap[order.status]}
					<div class="spotlight-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
						<div class="space-y-1">
							<div class="flex items-center gap-2.5 flex-wrap">
								<span class="font-mono text-sm font-semibold text-[#8E6216]">{order.id}</span>
								<span class="rounded-full border border-stone-900/10 bg-[#F4F1EA] px-2.5 py-0.5 font-mono text-[11px] text-[#141815]">
									{statusLabels[order.status]}
								</span>
								{#if order.is_subscription}
									<span class="rounded-full bg-[#ECF5F0] px-2.5 py-0.5 font-mono text-[10px] font-medium text-[#1B5E3E]">
										Langganan
									</span>
								{/if}
							</div>
							<p class="text-sm text-[#141815]">
								{order.customer_name} · <span class="text-[#5C665E]">{order.city}</span>
							</p>
							<p class="text-xs text-[#657067]">
								{order.items.map((i) => `${i.product_name} (${i.pack_kg}kg × ${i.quantity})`).join(', ')}
							</p>
						</div>

						<div class="flex items-center gap-3 self-end md:self-center">
							<span class="font-mono text-base font-semibold text-[#141815]">
								{formatIdr(order.total_idr)}
							</span>
							{#if nextStep}
								<button
									type="button"
									onclick={() => void advanceStatus(order.id, nextStep.next)}
									class="rounded-full bg-[#141815] px-4 py-2 text-xs font-semibold text-white hover:bg-[#B6842D] cursor-pointer transition-colors"
								>
									{nextStep.label}
								</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<!-- Inventory Section -->
	<section class="space-y-4">
		<h2 class="font-serif text-2xl text-[#141815]">Inventaris Gabah &amp; Beras</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each products as product (product.id)}
				<div class="spotlight-card rounded-2xl p-4 flex items-center justify-between gap-3">
					<div class="min-w-0">
						<p class="font-medium text-sm text-[#141815] truncate">{product.name}</p>
						<p class="text-xs font-mono text-[#5C665E] mt-0.5">
							Stok: <span class="font-semibold text-[#1B5E3E]">{product.stock_kg} kg</span>
						</p>
					</div>
					<button
						type="button"
						onclick={() => void quickRestock(product.id)}
						class="shrink-0 inline-flex items-center gap-1 rounded-full border border-stone-900/12 bg-[#F6F4EE] px-3 py-1.5 text-xs font-medium text-[#141815] hover:border-[#B6842D]/50 hover:text-[#8E6216] cursor-pointer"
					>
						<Plus class="h-3.5 w-3.5" />
						50 kg
					</button>
				</div>
			{/each}
		</div>
	</section>
</main>
