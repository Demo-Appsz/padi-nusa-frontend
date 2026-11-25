<script lang="ts">
	import { ArrowRight, Minus, Plus, Sparkles, Tag, Trash2, Truck, X } from 'lucide-svelte';
	import { formatIdr } from '$lib/api/client';
	import { cartStore } from '$lib/stores/cart.svelte';

	const quickCities = [
		'Jakarta Selatan',
		'Jakarta Pusat',
		'Tangerang',
		'Bekasi',
		'Bogor',
		'Depok',
		'Bandung',
		'Surabaya'
	];

	const promoChips = ['PANENBARU', 'LANGGANAN15', 'ONGKIRGRATIS'];

	let freeThreshold = $derived(cartStore.quote?.free_shipping_threshold_idr ?? 150_000);
	let currentSubtotal = $derived(cartStore.quote?.subtotal_idr ?? cartStore.localSubtotal);
	let shippingProgress = $derived(
		Math.min(100, Math.round((currentSubtotal / freeThreshold) * 100))
	);
	let remainingForFree = $derived(Math.max(0, freeThreshold - currentSubtotal));
</script>

{#if cartStore.isOpen}
	<div
		class="fixed inset-0 z-50 flex justify-end bg-stone-950/40 backdrop-blur-sm"
		onclick={(e) => {
			if (e.target === e.currentTarget) cartStore.isOpen = false;
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') cartStore.isOpen = false;
		}}
		tabindex="-1"
		role="dialog"
		aria-modal="true"
		aria-label="Keranjang Belanja"
	>
		<aside
			class="relative h-full w-full max-w-md border-l border-stone-900/12 bg-[#FAF9F6] flex flex-col justify-between shadow-2xl"
		>
			<!-- Drawer Header -->
			<div class="p-5 sm:p-6 border-b border-stone-900/10 bg-white flex items-center justify-between">
				<div>
					<h2 class="font-serif text-2xl text-[#141815]">Keranjang Beras</h2>
					<p class="text-xs font-mono text-[#5C665E]">
						{cartStore.totalPacks} kemasan · total {cartStore.totalKg} kg
					</p>
				</div>
				<button
					type="button"
					onclick={() => (cartStore.isOpen = false)}
					class="rounded-full border border-stone-900/12 p-2 text-[#545E56] hover:bg-stone-100 hover:text-[#141815] cursor-pointer"
					aria-label="Tutup keranjang"
				>
					<X class="h-4 w-4" />
				</button>
			</div>

			<!-- Body -->
			<div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
				{#if cartStore.items.length === 0}
					<div class="py-16 text-center space-y-3">
						<p class="font-serif text-2xl text-[#141815]">Keranjang masih kosong</p>
						<p class="text-sm text-[#5C665E]">
							Pilih varietas beras segar di katalog untuk memulai pesanan Anda.
						</p>
						<button
							type="button"
							onclick={() => (cartStore.isOpen = false)}
							class="rounded-full bg-[#141815] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#B6842D] cursor-pointer"
						>
							Lihat Katalog Beras
						</button>
					</div>
				{:else}
					<!-- Free Shipping Progress -->
					<div class="rounded-2xl border border-stone-900/10 bg-white p-3.5 space-y-2 shadow-xs">
						<div class="flex items-center justify-between text-xs">
							<span class="inline-flex items-center gap-1.5 text-[#3D463F]">
								<Truck class="h-3.5 w-3.5 text-[#B6842D]" />
								{#if remainingForFree === 0 || cartStore.quote?.shipping_fee_idr === 0}
									<span class="text-[#1B5E3E] font-semibold">Gratis Ongkir Terbuka!</span>
								{:else}
									Tambah <strong class="text-[#8E6216]">{formatIdr(remainingForFree)}</strong> untuk gratis ongkir
								{/if}
							</span>
							<span class="font-mono text-[11px] text-[#657067]">{shippingProgress}%</span>
						</div>
						<div class="h-1.5 rounded-full bg-stone-900/10 overflow-hidden">
							<div
								class="h-full rounded-full bg-gradient-to-r from-[#1B5E3E] to-[#D4A043] transition-all duration-500"
								style="width: {shippingProgress}%"
							></div>
						</div>
					</div>

					<!-- Line Items -->
					<div class="space-y-3">
						{#each cartStore.items as item (`${item.product.id}-${item.pack_kg}`)}
							<div class="rounded-2xl border border-stone-900/10 bg-white p-3.5 flex gap-3.5 shadow-xs">
								<img
									src={item.product.image_url}
									alt={item.product.name}
									class="h-16 w-16 rounded-xl object-cover shrink-0"
								/>
								<div class="flex-1 min-w-0">
									<div class="flex items-start justify-between gap-2">
										<div>
											<p class="text-sm font-semibold text-[#141815] truncate">
												{item.product.name}
											</p>
											<p class="text-[11px] font-mono text-[#8E6216]">
												Kemasan {item.pack_kg} kg
											</p>
										</div>
										<button
											type="button"
											onclick={() => cartStore.removeItem(item.product.id, item.pack_kg)}
											class="text-[#7C857D] hover:text-rose-600 cursor-pointer"
											aria-label="Hapus item"
										>
											<Trash2 class="h-3.5 w-3.5" />
										</button>
									</div>

									<div class="mt-3 flex items-center justify-between">
										<div class="inline-flex items-center gap-2 rounded-full border border-stone-900/12 bg-[#F6F4EE] px-2 py-1">
											<button
												type="button"
												onclick={() => cartStore.updateQuantity(item.product.id, item.pack_kg, -1)}
												class="p-0.5 text-[#545E56] hover:text-[#141815] cursor-pointer"
												aria-label="Kurangi"
											>
												<Minus class="h-3 w-3" />
											</button>
											<span class="font-mono text-xs w-5 text-center text-[#141815]">
												{item.quantity}
											</span>
											<button
												type="button"
												onclick={() => cartStore.updateQuantity(item.product.id, item.pack_kg, 1)}
												class="p-0.5 text-[#545E56] hover:text-[#141815] cursor-pointer"
												aria-label="Tambah"
											>
												<Plus class="h-3 w-3" />
											</button>
										</div>
										<span class="font-mono text-sm font-semibold text-[#141815]">
											{formatIdr(item.unit_price_idr * item.quantity)}
										</span>
									</div>
								</div>
							</div>
						{/each}
					</div>

					<!-- City & Subscription & Promo -->
					<div class="space-y-3 rounded-2xl border border-stone-900/10 bg-white p-4 shadow-xs">
						<div class="flex items-center justify-between gap-3">
							<label for="cart-city" class="text-xs text-[#545E56]">Kota Pengiriman</label>
							<select
								id="cart-city"
								bind:value={cartStore.city}
								onchange={() => void cartStore.refreshQuote()}
								class="rounded-xl border border-stone-900/15 bg-[#F6F4EE] px-3 py-1.5 text-xs text-[#141815] focus:border-[#B6842D] focus:outline-none"
							>
								{#each quickCities as c}
									<option value={c}>{c}</option>
								{/each}
							</select>
						</div>

						<label class="flex items-center justify-between gap-3 cursor-pointer pt-1">
							<span class="inline-flex items-center gap-1.5 text-xs text-[#3D463F]">
								<Sparkles class="h-3.5 w-3.5 text-[#B6842D]" />
								Langganan Bulanan (Ekstra Diskon 10%)
							</span>
							<input
								type="checkbox"
								bind:checked={cartStore.isSubscription}
								onchange={() => void cartStore.refreshQuote()}
								class="h-4 w-4 accent-[#B6842D]"
							/>
						</label>

						<div class="pt-2 border-t border-stone-900/10 space-y-2">
							<div class="flex gap-2">
								<div class="relative flex-1">
									<Tag class="h-3.5 w-3.5 text-[#657067] absolute left-3 top-1/2 -translate-y-1/2" />
									<input
										type="text"
										bind:value={cartStore.promoCode}
										placeholder="Kode promo (misal PANENBARU)"
										class="w-full rounded-xl border border-stone-900/12 bg-[#F6F4EE] pl-9 pr-3 py-1.5 font-mono text-xs text-[#141815] placeholder-[#7C857D] focus:border-[#B6842D] focus:bg-white focus:outline-none"
									/>
								</div>
								<button
									type="button"
									onclick={() => void cartStore.refreshQuote()}
									class="rounded-xl border border-[#B6842D]/40 bg-[#B6842D]/12 px-3 py-1.5 text-xs font-semibold text-[#8E6216] hover:bg-[#B6842D]/20 cursor-pointer"
								>
									Pakai
								</button>
							</div>
							<div class="flex flex-wrap gap-1.5">
								{#each promoChips as chip}
									<button
										type="button"
										onclick={() => {
											cartStore.promoCode = chip;
											void cartStore.refreshQuote();
										}}
										class="rounded-full border border-stone-900/10 bg-[#F6F4EE] px-2.5 py-0.5 font-mono text-[10px] text-[#4E5850] hover:border-[#B6842D]/45 hover:text-[#8E6216] cursor-pointer"
									>
										{chip}
									</button>
								{/each}
							</div>
							{#if cartStore.quoteError}
								<p class="text-[11px] text-rose-600">{cartStore.quoteError}</p>
							{/if}
						</div>
					</div>
				{/if}
			</div>

			<!-- Footer Summary -->
			{#if cartStore.items.length > 0}
				<div class="border-t border-stone-900/10 bg-white p-5 sm:p-6 space-y-4">
					<div class="space-y-1.5 text-xs">
						<div class="flex justify-between text-[#5C665E]">
							<span>Subtotal</span>
							<span class="font-mono text-[#141815]">
								{formatIdr(cartStore.quote?.subtotal_idr ?? cartStore.localSubtotal)}
							</span>
						</div>
						{#if (cartStore.quote?.total_discount_idr ?? 0) > 0}
							<div class="flex justify-between text-[#1B5E3E] font-medium">
								<span>Total Hemat (Langganan/Promo)</span>
								<span class="font-mono">-{formatIdr(cartStore.quote?.total_discount_idr ?? 0)}</span>
							</div>
						{/if}
						<div class="flex justify-between text-[#5C665E]">
							<span>Ongkos Kirim ({cartStore.city})</span>
							<span class="font-mono text-[#141815]">
								{cartStore.quote?.shipping_fee_idr === 0
									? 'GRATIS'
									: formatIdr(cartStore.quote?.shipping_fee_idr ?? 18_000)}
							</span>
						</div>
						<div class="flex justify-between pt-2 border-t border-stone-900/10 text-base font-semibold text-[#141815]">
							<span>Total Bayar</span>
							<span class="font-mono text-[#8E6216]">
								{formatIdr(cartStore.quote?.total_idr ?? cartStore.localSubtotal)}
							</span>
						</div>
					</div>

					<button
						type="button"
						onclick={() => {
							cartStore.isOpen = false;
							cartStore.isCheckoutOpen = true;
						}}
						class="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#141815] py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_-8px_rgba(20,24,21,0.35)] hover:bg-[#B6842D] cursor-pointer transition-colors"
					>
						Lanjut ke Checkout
						<ArrowRight class="h-4 w-4" />
					</button>
				</div>
			{/if}
		</aside>
	</div>
{/if}
