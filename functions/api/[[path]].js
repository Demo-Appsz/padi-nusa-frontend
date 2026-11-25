const BACKEND_ORIGIN = 'https://padi-nusa-backend.demo-appsz.workers.dev';

/**
 * Cloudflare Pages Function forwarding `/api/*` requests to the Rust Cloudflare Worker.
 */
export async function onRequest(context) {
	const incomingUrl = new URL(context.request.url);
	const targetUrl = `${BACKEND_ORIGIN}${incomingUrl.pathname}${incomingUrl.search}`;

	const headers = new Headers(context.request.headers);
	headers.delete('host');

	const init = {
		method: context.request.method,
		headers
	};

	if (!['GET', 'HEAD'].includes(context.request.method)) {
		init.body = await context.request.arrayBuffer();
	}

	return fetch(targetUrl, init);
}
