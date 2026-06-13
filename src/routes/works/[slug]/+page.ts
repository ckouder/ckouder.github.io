import { error } from '@sveltejs/kit';
import { findWork, works } from '$lib/content';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => works.map(({ slug }) => ({ slug }));

export const load: PageLoad = ({ params }) => {
	const work = findWork(params.slug);
	if (!work) {
		error(404, `No work named “${params.slug}”`);
	}
	return { work };
};
