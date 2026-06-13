import { describe, expect, it } from 'vitest';
import { contact, findWork, site, works } from './content';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

describe('site metadata', () => {
	it('has a non-empty artist name and title', () => {
		expect(site.artist.trim()).not.toBe('');
		expect(site.title.trim()).not.toBe('');
	});

	it('has plausible contact entries', () => {
		expect(contact.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
		expect(contact.github).toMatch(/^https:\/\//);
		expect(contact.linkedin).toMatch(/^https:\/\//);
	});
});

describe('works', () => {
	it('contains at least one work', () => {
		expect(works.length).toBeGreaterThan(0);
	});

	it('uses unique, url-safe slugs', () => {
		const slugs = works.map((work) => work.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
		for (const slug of slugs) {
			expect(slug).toMatch(SLUG_PATTERN);
		}
	});

	it('has required fields filled in for every work', () => {
		for (const work of works) {
			expect(work.title.trim()).not.toBe('');
			expect(work.year.trim()).not.toBe('');
			expect(work.medium.trim()).not.toBe('');
			expect(work.description.length).toBeGreaterThan(0);
			for (const paragraph of work.description) {
				expect(paragraph.trim()).not.toBe('');
			}
		}
	});

	it('points images at the static works directory with alt text', () => {
		for (const work of works) {
			for (const image of work.images) {
				expect(image.src).toMatch(new RegExp(`^/works/${work.slug}/`));
				expect(image.alt.trim()).not.toBe('');
			}
		}
	});

	it('finds works by slug and returns undefined otherwise', () => {
		expect(findWork(works[0].slug)).toEqual(works[0]);
		expect(findWork('does-not-exist')).toBeUndefined();
	});
});
