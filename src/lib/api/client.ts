export type RiceGrade = 'artisanal' | 'organik' | 'heritage' | 'premium';

export type OrderStatus =
	| 'menunggu_konfirmasi'
	| 'diproses_penggilingan'
	| 'dikirim'
	| 'selesai'
	| 'dibatalkan';

export interface ProductPackOption {
	weight_kg: number;
	unit_price_idr: number;
	discount_percent: number;
}

export interface RiceProduct {
	id: string;
	slug: string;
	name: string;
	tagline: string;
	description: string;
	origin_region: string;
	harvest_batch: string;
	milled_date: string;
	grade: RiceGrade;
	base_price_per_kg_idr: number;
	stock_kg: number;
	pack_options: ProductPackOption[];
	pulen_score: number;
	aroma_score: number;
	glycemic_label: string;
	water_ratio: number;
	soak_minutes: number;
	cook_minutes: number;
	tasting_notes: string[];
	image_url: string;
	badge: string | null;
}

export interface CartLineInput {
	product_id: string;
	pack_kg: number;
	quantity: number;
}

export interface QuoteItem {
	product_id: string;
	product_name: string;
	pack_kg: number;
	quantity: number;
	unit_price_idr: number;
	line_total_idr: number;
}

export interface QuoteResponse {
	items: QuoteItem[];
	subtotal_idr: number;
	subscription_discount_idr: number;
	promo_discount_idr: number;
	total_discount_idr: number;
	shipping_fee_idr: number;
	free_shipping_threshold_idr: number;
	total_idr: number;
	applied_promo: string | null;
}

export interface OrderRecord {
	id: string;
	customer_name: string;
	customer_phone: string;
	delivery_address: string;
	city: string;
	is_subscription: boolean;
	items: QuoteItem[];
	subtotal_idr: number;
	discount_idr: number;
	shipping_fee_idr: number;
	total_idr: number;
	promo_code: string | null;
	status: OrderStatus;
	created_at: string;
}

export interface CookingGuide {
	portions: number;
	rice_grams: number;
	water_ml: number;
	rice_cups: number;
	water_cups: number;
	soak_minutes: number;
	cook_minutes: number;
	rest_minutes: number;
	chef_tip: string;
}

export function formatIdr(amount: number): string {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: 0
	}).format(amount);
}

async function parseJsonOrThrow<T>(res: Response): Promise<T> {
	const data = await res.json().catch(() => ({}));
	if (!res.ok) {
		throw new Error(data.error || `Request gagal (${res.status})`);
	}
	return data as T;
}

export async function fetchProducts(grade?: RiceGrade | 'all', q?: string): Promise<RiceProduct[]> {
	const params = new URLSearchParams();
	if (grade && grade !== 'all') params.set('grade', grade);
	if (q && q.trim()) params.set('q', q.trim());
	const qs = params.toString();
	const res = await fetch(`/api/products${qs ? `?${qs}` : ''}`);
	const data = await parseJsonOrThrow<{ products: RiceProduct[] }>(res);
	return data.products;
}

export async function fetchCookingGuide(
	productId: string,
	portions: number
): Promise<CookingGuide> {
	const res = await fetch(`/api/products/${encodeURIComponent(productId)}/cooking-guide?portions=${portions}`);
	const data = await parseJsonOrThrow<{ guide: CookingGuide }>(res);
	return data.guide;
}

export async function quoteCartApi(payload: {
	items: CartLineInput[];
	city: string;
	is_subscription: boolean;
	promo_code: string | null;
}): Promise<QuoteResponse> {
	const res = await fetch('/api/cart/quote', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload)
	});
	const data = await parseJsonOrThrow<{ quote: QuoteResponse }>(res);
	return data.quote;
}

export async function placeOrderApi(payload: {
	customer_name: string;
	customer_phone: string;
	delivery_address: string;
	city: string;
	is_subscription: boolean;
	promo_code: string | null;
	items: CartLineInput[];
}): Promise<OrderRecord> {
	const res = await fetch('/api/orders', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload)
	});
	const data = await parseJsonOrThrow<{ order: OrderRecord }>(res);
	return data.order;
}

export async function fetchOrdersApi(): Promise<OrderRecord[]> {
	const res = await fetch('/api/orders');
	const data = await parseJsonOrThrow<{ orders: OrderRecord[] }>(res);
	return data.orders;
}

export async function updateOrderStatusApi(
	orderId: string,
	status: OrderStatus
): Promise<OrderRecord> {
	const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
		method: 'PATCH',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ status })
	});
	const data = await parseJsonOrThrow<{ order: OrderRecord }>(res);
	return data.order;
}

export async function restockProductApi(
	productId: string,
	addedKg: number
): Promise<RiceProduct> {
	const res = await fetch(`/api/products/${encodeURIComponent(productId)}/restock`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ added_kg: addedKg })
	});
	const data = await parseJsonOrThrow<{ product: RiceProduct }>(res);
	return data.product;
}
