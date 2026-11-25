import {
	quoteCartApi,
	type OrderRecord,
	type QuoteResponse,
	type RiceProduct
} from '$lib/api/client';

export interface LocalCartItem {
	product: RiceProduct;
	pack_kg: number;
	unit_price_idr: number;
	quantity: number;
}

class CartStore {
	items = $state<LocalCartItem[]>([]);
	isOpen = $state(false);
	isCheckoutOpen = $state(false);
	isSubscription = $state(false);
	city = $state('Jakarta Selatan');
	promoCode = $state('');
	quote = $state<QuoteResponse | null>(null);
	quoteError = $state<string | null>(null);
	isQuoting = $state(false);
	lastOrder = $state<OrderRecord | null>(null);
	toastMessage = $state<string | null>(null);

	totalPacks = $derived(this.items.reduce((acc, i) => acc + i.quantity, 0));
	totalKg = $derived(this.items.reduce((acc, i) => acc + i.pack_kg * i.quantity, 0));
	localSubtotal = $derived(
		this.items.reduce((acc, i) => acc + i.unit_price_idr * i.quantity, 0)
	);

	showToast(msg: string) {
		this.toastMessage = msg;
		setTimeout(() => {
			if (this.toastMessage === msg) {
				this.toastMessage = null;
			}
		}, 3200);
	}

	addItem(product: RiceProduct, packKg: number, quantity = 1) {
		const packOption =
			product.pack_options.find((p) => p.weight_kg === packKg) ?? product.pack_options[0];
		if (!packOption) return;

		const existing = this.items.find(
			(i) => i.product.id === product.id && i.pack_kg === packOption.weight_kg
		);
		if (existing) {
			existing.quantity += quantity;
		} else {
			this.items.push({
				product,
				pack_kg: packOption.weight_kg,
				unit_price_idr: packOption.unit_price_idr,
				quantity
			});
		}

		this.showToast(`${product.name} (${packOption.weight_kg} kg) ditambahkan ke keranjang`);
		void this.refreshQuote();
	}

	updateQuantity(productId: string, packKg: number, delta: number) {
		const idx = this.items.findIndex(
			(i) => i.product.id === productId && i.pack_kg === packKg
		);
		if (idx === -1) return;
		const next = this.items[idx].quantity + delta;
		if (next <= 0) {
			this.items.splice(idx, 1);
		} else {
			this.items[idx].quantity = next;
		}
		void this.refreshQuote();
	}

	removeItem(productId: string, packKg: number) {
		this.items = this.items.filter(
			(i) => !(i.product.id === productId && i.pack_kg === packKg)
		);
		void this.refreshQuote();
	}

	clear() {
		this.items = [];
		this.quote = null;
		this.quoteError = null;
		this.promoCode = '';
	}

	async refreshQuote() {
		if (this.items.length === 0) {
			this.quote = null;
			this.quoteError = null;
			return;
		}
		this.isQuoting = true;
		this.quoteError = null;
		try {
			const res = await quoteCartApi({
				items: this.items.map((i) => ({
					product_id: i.product.id,
					pack_kg: i.pack_kg,
					quantity: i.quantity
				})),
				city: this.city,
				is_subscription: this.isSubscription,
				promo_code: this.promoCode.trim() ? this.promoCode.trim() : null
			});
			this.quote = res;
		} catch (err) {
			this.quoteError = err instanceof Error ? err.message : 'Gagal menghitung harga';
		} finally {
			this.isQuoting = false;
		}
	}
}

export const cartStore = new CartStore();
