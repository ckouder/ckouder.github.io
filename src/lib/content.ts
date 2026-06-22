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

/** A single piece inside a series (a Work with `pieces`). */
export interface WorkPiece {
	readonly title: string;
	readonly medium: string;
	readonly year: string;
	readonly description?: readonly string[];
	readonly images: readonly WorkImage[];
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
	/** Optional: people or projects to credit, shown in an Acknowledgement section. */
	readonly acknowledgements?: readonly WorkLink[];
	/** Optional: when set, this entry is a series and renders its pieces as an exhibition. */
	readonly pieces?: readonly WorkPiece[];
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
		slug: 'vocab-101',
		title: 'VOCAB 101',
		year: 'ongoing',
		medium: 'Crayon on wall',
		description: [],
		images: [],
		links: [],
		pieces: [
			{
				title: 'Room Tour',
				medium: 'Crayon on wall',
				year: '2026',
				description: [
					'welcome to my room :) let me show you the parts of me that keep me safe and alive — the membrane, the receptor, the little feet i get around on. i don’t go out much. everything i need is already in here.',
					'— cells'
				],
				images: [
					{
						src: '/works/vocab-101/room-tour.jpg',
						alt: 'Four photographs of a house labelled in crayon as a cell: a door reading “Cell”, a wall reading “Cell membrane”, a window corner reading “Receptor” and “Pseudopodia”, and a mirror selfie reading “Cells”'
					}
				]
			},
			{
				title: 'Untitled',
				medium: 'Crayon on window frame',
				year: '2026',
				images: [
					{
						src: '/works/vocab-101/space.jpg',
						alt: 'A window looking out onto a neighbourhood, with “↑ SPACE ↑” written in crayon across the glass'
					}
				]
			}
		]
	},
	{
		slug: 'untitled-fuji',
		title: 'Untitled',
		year: '2026',
		medium: 'Acrylic on canvas',
		description: [],
		images: [
			{
				src: '/works/untitled-fuji/fuji-mountain.jpg',
				alt: 'A small white canvas resting on carpet, painted with the words “FUJI MOUNTAIN” in black'
			}
		],
		links: []
	},
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
		links: [{ href: 'https://thats-totally-me.art', label: 'thats-totally-me.art' }],
		acknowledgements: [
			{ href: 'https://www.fernandachieco.com/', label: 'Fernanda Chieco' },
			{ href: 'https://www.instagram.com/baklava_square_pants/', label: '@Baklava' },
			{ href: 'https://claude.ai/', label: 'Claude Opus 4.8' }
		]
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

/** The image used for a work's card in the gallery: its own first image, or a series' first piece image. */
export function coverImage(work: Work): WorkImage | undefined {
	return work.images[0] ?? work.pieces?.[0]?.images[0];
}

/** One screen of the full-screen viewer: a single image (or none) plus its label text. */
export interface ViewerSlide {
	readonly workSlug: string;
	readonly workTitle: string;
	readonly title: string;
	readonly meta: string;
	readonly image?: WorkImage;
	readonly description: readonly string[];
	readonly links?: readonly WorkLink[];
	readonly acknowledgements?: readonly WorkLink[];
}

function slidesForWork(work: Work): ViewerSlide[] {
	if (work.pieces) {
		return work.pieces.map((piece) => ({
			workSlug: work.slug,
			workTitle: work.title,
			title: piece.title,
			meta: `${piece.medium}, ${piece.year}`,
			image: piece.images[0],
			description: piece.description ?? []
		}));
	}
	const images = work.images.length > 0 ? work.images : [undefined];
	return images.map((image) => ({
		workSlug: work.slug,
		workTitle: work.title,
		title: work.title,
		meta: `${work.medium}, ${work.year}`,
		image,
		description: work.description,
		links: work.links,
		acknowledgements: work.acknowledgements
	}));
}

/** Every work flattened into one ordered sequence, so the viewer can move across works. */
export const viewerSlides: readonly ViewerSlide[] = works.flatMap(slidesForWork);

/** Index of a work's first slide within {@link viewerSlides}. */
export function firstSlideIndexForWork(slug: string): number {
	return viewerSlides.findIndex((slide) => slide.workSlug === slug);
}
