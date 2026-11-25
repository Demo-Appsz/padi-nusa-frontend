<script lang="ts">
	import { CheckCircle2, Loader2, PackageCheck, X } from 'lucide-svelte';
	import { formatIdr, placeOrderApi } from '$lib/api/client';
	import { cartStore } from '$lib/stores/cart.svelte';

	interface Props {
		onOrderPlaced: () => void;
	}

	let { onOrderPlaced }: Props = $props();

	let customerName = $state('');
	let customerPhone = $state('');
	let deliveryAddress = $state('');
	let isSubmitting = $state(false);
	let errorMsg = $state<string | null>(null);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		errorMsg = null;
		isSubmitting = true;
		try {
			const order = await placeOrderApi({
				customer_name: customerName,
				customer_phone: customerPhone,
				delivery_address: deliveryAddress,
				city: cartStore.city,
				is_subscription: cartStore.isSubscription,
				promo_code: cartStore.promoCode.trim() ? cartStore.promoCode.trim() : null,
				items: cartStore.items.map((i) => ({
					product_id: i.product.id,
					pack_kg: i.pack_kg,
					quantity: i.quantity
				}))
			});
			cartStore.lastOrder = order;
			cartStore.clear();
			onOrderPlaced();
		} catch (err) {
			errorMsg = err instanceof Error ? err.message : 'Gagal membuat pesanan';
		} finally {
			isSubmitting = false;
		}
	}

	function closeAll() {
		cartStore.isCheckoutOpen = false;
		cartStore.lastOrder = null;
		errorMsg = null;
	}
</script>

{#if cartStore.isCheckoutOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 p-4 backdrop-blur-md"
		onclick={(e) => {
			if (e.target === e.currentTarget) closeAll();
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') closeAll();
		}}
		tabindex="-1"
		role="dialog"
		aria-modal="true"
		aria-label="Checkout PadiNusa"
	>
		<div class="relative w-full max-w-lg rounded-3xl border border-stone-900/12 bg-[#FCFBF8] p-6 sm:p-8 shadow-2xl">
			<button
				type="button"
				onclick={closeAll}
				class="absolute top-5 right-5 rounded-full border border-stone-900/12 bg-white p-2 text-[#545E56] hover:bg-stone-100 cursor-pointer"
				aria-label="Tutup checkout"
			>
				<X class="h-4 w-4" />
			</button>

			{#if cartStore.lastOrder}
				{@const order = cartStore.lastOrder}
				<div class="text-center space-y-5 py-2">
					<div
						class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ECF5F0] border border-[#1B5E3E]/25 text-[#1B5E3E]"
					>
						<CheckCircle2 class="h-8 w-8" />
					</div>
					<div>
						<span class="font-mono text-xs uppercase tracking-widest text-[#8E6216]">
							Pesanan Dikonfirmasi
						</span>
						<h3 class="font-serif text-3xl text-[#141815] mt-1">Terima Kasih, {order.customer_name}</h3>
						<p class="text-sm text-[#545E56] mt-1">
							Stok gabah segera masuk antrean penggilingan segar.
						</p>
					</div>

					<div class="rounded-2xl border border-stone-900/10 bg-[#F4F1EA] p-4 text-left space-y-2.5 text-xs">
						<div class="flex justify-between">
							<span class="text-[#5C665E]">Nomor Resi / Order</span>
							<span class="font-mono font-semibold text-[#8E6216]">{order.id}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-[#5C665E]">Status</span>
							<span class="inline-flex items-center gap-1 font-mono font-medium text-[#1B5E3E]">
								<PackageCheck class="h-3.5 w-3.5" />
								Menunggu Konfirmasi
							</span>
						</div>
						<div class="flex justify-between">
							<span class="text-[#5C665E]">Alamat Tujuan</span>
							<span class="text-[#141815] text-right max-w-[60%]">{order.delivery_address}, {order.city}</span>
						</div>
						<div class="pt-2 border-t border-stone-900/10 flex justify-between text-sm font-semibold">
							<span class="text-[#141815]">Total Pembayaran</span>
							<span class="font-mono text-[#8E6216]">{formatIdr(order.total_idr)}</span>
						</div>
					</div>

					<div class="flex flex-wrap gap-3 justify-center pt-2">
						<a
							href="/admin"
							onclick={closeAll}
							class="rounded-full border border-stone-900/15 bg-white px-5 py-2.5 text-xs font-medium text-[#141815] hover:bg-stone-100"
						>
							Pantau di Panel Toko
						</a>
						<button
							type="button"
							onclick={closeAll}
							class="rounded-full bg-[#141815] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#B6842D] cursor-pointer"
						>
							Selesai Belanja
						</button>
					</div>
				</div>
			{:else}
				<div class="space-y-5">
					<div>
						<span class="font-mono text-xs uppercase tracking-widest text-[#8E6216]">
							Checkout Cepat
						</span>
						<h3 class="font-serif text-3xl text-[#141815] mt-1">Alamat Pengiriman Beras</h3>
					</div>

					<form onsubmit={handleSubmit} class="space-y-4">
						<div>
							<label for="co-name" class="block text-xs text-[#545E56] mb-1.5">Nama Penerima</label>
							<input
								id="co-name"
								type="text"
								required
								bind:value={customerName}
								placeholder="Contoh: Nadia Kusuma"
								class="w-full rounded-xl border border-stone-900/15 bg-white px-4 py-2.5 text-sm text-[#141815] focus:border-[#B6842D] focus:outline-none"
							/>
						</div>

						<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div>
								<label for="co-phone" class="block text-xs text-[#545E56] mb-1.5">No. WhatsApp</label>
								<input
									id="co-phone"
									type="tel"
									required
									bind:value={customerPhone}
									placeholder="0812xxxxxxxx"
									class="w-full rounded-xl border border-stone-900/15 bg-white px-4 py-2.5 text-sm text-[#141815] focus:border-[#B6842D] focus:outline-none"
								/>
							</div>
							<div>
								<label for="co-city" class="block text-xs text-[#545E56] mb-1.5">Kota</label>
								<input
									id="co-city"
									type="text"
									required
									bind:value={cartStore.city}
									class="w-full rounded-xl border border-stone-900/15 bg-white px-4 py-2.5 text-sm text-[#141815] focus:border-[#B6842D] focus:outline-none"
								/>
							</div>
						</div>

						<div>
							<label for="co-addr" class="block text-xs text-[#545E56] mb-1.5">Alamat Lengkap</label>
							<textarea
								id="co-addr"
								rows="3"
								required
								bind:value={deliveryAddress}
								placeholder="Jl. Kemang Timur No. 24, RT 04/02, Jakarta Selatan"
								class="w-full rounded-xl border border-stone-900/15 bg-white px-4 py-2.5 text-sm text-[#141815] focus:border-[#B6842D] focus:outline-none"
							></textarea>
						</div>

						{#if errorMsg}
							<p class="rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2 text-xs text-rose-700">
								{errorMsg}
							</p>
						{/if}

						<div class="rounded-2xl border border-stone-900/10 bg-[#F4F1EA] p-3.5 flex items-center justify-between text-sm">
							<span class="text-[#545E56]">Total Tagihan ({cartStore.totalKg} kg)</span>
							<span class="font-mono font-semibold text-[#8E6216]">
								{formatIdr(cartStore.quote?.total_idr ?? cartStore.localSubtotal)}
							</span>
						</div>

						<button
							type="submit"
							disabled={isSubmitting || cartStore.items.length === 0}
							class="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#141815] py-3.5 text-sm font-semibold text-white hover:bg-[#B6842D] disabled:opacity-50 cursor-pointer transition-colors"
						>
							{#if isSubmitting}
								<Loader2 class="h-4 w-4 animate-spin" />
								Memproses Pesanan...
							{:else}
								Konfirmasi &amp; Pesan Beras
							{/if}
						</button>
					</form>
				</div>
			{/if}
		</div>
	</div>
{/if}
