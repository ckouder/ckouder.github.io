import type { PageLoad } from './$types';

export const load = (({ params }) => {
    return {
        app: params.app,
    }
}) satisfies PageLoad;