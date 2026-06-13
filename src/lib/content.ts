/**
 * All portfolio content lives in this file.
 * To add a work: append an entry to `works`, put its images in
 * `static/works/<slug>/`, and reference them as `/works/<slug>/<file>`.
 */

export interface WorkImage {
	readonly src: string;
	readonly alt: string;
	/** Optional: clicking the image opens this URL. */
	readonly href?: string;
}

export interface WorkLink {
	readonly href: string;
	readonly label: string;
}

export interface Work {
	readonly slug: string;
	readonly title: string;
	readonly year: string;
	readonly medium: string;
	readonly dimensions?: string;
	/** Paragraphs of plain text, rendered in order. */
	readonly description: readonly string[];
	readonly images: readonly WorkImage[];
	readonly links: readonly WorkLink[];
}

export const site = {
	artist: 'Bingji Guo',
	title: 'Bingji Guo',
	description: 'Art portfolio and artist statement of Bingji Guo.'
} as const;

export const contact = {
	email: 'bingjiguo@icloud.com',
	github: 'https://github.com/ckouder',
	linkedin: 'https://linkedin.com/in/bingji-guo'
} as const;

export const works: readonly Work[] = [
	{
		slug: 'monuments',
		title: 'Monuments',
		year: '2026',
		medium: 'Interactive website, permanent web archive (Arweave), WebGL',
		description: [
			'An online monument in three sections — birthplace, cemetery, and wish — rendered as day, dawn, and night. Visitors leave records of where they were born, who they have lost, and what they hope for; each record becomes a small light in a shared landscape.',
			'Entries are written to permanent storage, so the monument outlives the website that displays it.'
		],
		images: [],
		links: []
	},
	{
		slug: 'thats-totally-me',
		title: "That's Totally Me",
		// TODO: confirm year and refine the description.
		year: '2026',
		medium: 'Interactive website',
		description: [
			'Visitors are handed the artist’s lost facial features — eyes, eyebrows, nose, mouth, ears — and asked to drag them back onto his blanked-out face.'
		],
		images: [
			{
				src: '/works/thats-totally-me/oh-nooo.jpg',
				alt: 'Screenshot: a face with its features removed, beside a list of draggable eyes, eyebrows, nose, mouth, and ear',
				href: 'https://thats-totally-me.art'
			}
		],
		links: [{ href: 'https://thats-totally-me.art', label: 'thats-totally-me.art' }]
	}
	// Template for a new work:
	// {
	// 	slug: 'work-slug',
	// 	title: 'Title',
	// 	year: '2026',
	// 	medium: 'Oil on canvas',
	// 	dimensions: '50 × 70 cm',
	// 	description: ['First paragraph.', 'Second paragraph.'],
	// 	images: [{ src: '/works/work-slug/01.jpg', alt: 'Describe the image' }],
	// 	links: [{ href: 'https://example.com', label: 'Project site' }]
	// }
];

export function findWork(slug: string): Work | undefined {
	return works.find((work) => work.slug === slug);
}
