import type { Action } from 'svelte/action';

/**
 * Magnetic hover pull effect inspired by MotionSites.ai micro-interactions.
 */
export const magnetic: Action<HTMLElement, number | undefined> = (node, strength = 0.28) => {
	let currentStrength = strength;

	function onMove(e: MouseEvent) {
		const rect = node.getBoundingClientRect();
		const dx = e.clientX - (rect.left + rect.width / 2);
		const dy = e.clientY - (rect.top + rect.height / 2);
		node.style.transition = 'transform 120ms cubic-bezier(0.22, 1, 0.36, 1)';
		node.style.transform = `translate3d(${dx * currentStrength}px, ${dy * currentStrength}px, 0)`;
	}

	function onLeave() {
		node.style.transition = 'transform 520ms cubic-bezier(0.22, 1, 0.36, 1)';
		node.style.transform = 'translate3d(0, 0, 0)';
	}

	node.addEventListener('mousemove', onMove);
	node.addEventListener('mouseleave', onLeave);

	return {
		update(nextStrength) {
			currentStrength = nextStrength ?? 0.28;
		},
		destroy() {
			node.removeEventListener('mousemove', onMove);
			node.removeEventListener('mouseleave', onLeave);
		}
	};
};

/**
 * 3D perspective tilt + dynamic spotlight coordinate tracking (--mx, --my).
 */
export const tilt3d: Action<HTMLElement, { maxTilt?: number; scale?: number } | undefined> = (
	node,
	opts
) => {
	let maxTilt = opts?.maxTilt ?? 6;
	let scale = opts?.scale ?? 1.012;

	function onMove(e: MouseEvent) {
		const rect = node.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const px = x / rect.width;
		const py = y / rect.height;

		const rotateY = (px - 0.5) * (maxTilt * 2);
		const rotateX = (0.5 - py) * (maxTilt * 2);

		node.style.setProperty('--mx', `${x}px`);
		node.style.setProperty('--my', `${y}px`);
		node.style.transition = 'transform 140ms ease-out';
		node.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;
	}

	function onLeave() {
		node.style.transition = 'transform 560ms cubic-bezier(0.22, 1, 0.36, 1)';
		node.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
	}

	node.addEventListener('mousemove', onMove);
	node.addEventListener('mouseleave', onLeave);

	return {
		update(next) {
			maxTilt = next?.maxTilt ?? 6;
			scale = next?.scale ?? 1.012;
		},
		destroy() {
			node.removeEventListener('mousemove', onMove);
			node.removeEventListener('mouseleave', onLeave);
		}
	};
};

/**
 * Scroll-triggered entrance reveal with optional stagger delay (ms).
 */
export const reveal: Action<HTMLElement, { delay?: number } | undefined> = (node, opts) => {
	const delay = opts?.delay ?? 0;
	node.classList.add('reveal-hidden');
	if (delay > 0) {
		node.style.transitionDelay = `${delay}ms`;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.remove('reveal-hidden');
					node.classList.add('reveal-visible');
					observer.unobserve(node);
				}
			}
		},
		{ threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
};
