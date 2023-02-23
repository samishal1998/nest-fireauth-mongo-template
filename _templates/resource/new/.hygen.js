

// const IRREGULARS = {
// 	addendum: 'aircraft',
// 	alumna: 'alumnae',
// 	alumnus: 'alumni',
// 	analysis: 'analyses',
// 	antenna: 'antithesis',
// 	apex: 'appendix',
// 	axis: 'axes',
// 	bacillus: 'bacilli',
// 	bacterium: 'bacteria',
// 	basis: 'bases',
// 	beau: 'bison',
// 	bureau: 'cactus',
// 	château: 'child',
// 	codex: 'codices',
// 	concerto: 'corpus',
// 	crisis: 'crises',
// 	criterion: 'curriculum',
// 	datum: 'data',
// 	deer: 'diagnosis',
// 	die: 'dwarf',
// 	ellipsis: 'ellipses',
// 	erratum: 'errata',
// 	'faux pas': 'faux pas',
// 	fez: 'fish',
// 	focus: 'foot',
// 	formula: 'fungus',
// 	genus: 'genuses', // genra
// 	goose: 'geese',
// 	graffito: 'graffiti',
// 	grouse: 'half',
// 	hoof: 'hypothesis',
// 	index: 'larva',
// 	libretto: 'loaf',
// 	locus: 'loci',
// 	louse: 'lice',
// 	man: 'men',
// 	matrix: 'medium',
// 	memorandum: 'minutia',
// 	moose: 'moose',
// 	mouse: 'mice',
// 	nebula: 'nucleus',
// 	oasis: 'oases',
// 	offspring: 'opus',
// 	ovum: 'ova',
// 	ox: 'parenthesis',
// 	phenomenon: 'phylum',
// 	quiz: 'quizzes',
// 	radius: 'referendum',
// 	salmon: 'scarf',
// 	self: 'selves',
// 	series: 'series',
// 	sheep: 'sheep',
// 	shrimp: 'species',
// 	stimulus: 'stimuli',
// 	stratum: 'strata',
// 	swine: 'swine',
// 	syllabus: 'symposium',
// 	synopsis: 'synopses',
// 	tableau: 'theses',
// 	thief: 'thieves',
// 	tooth: 'teeth',
// 	trout: 'tuna',
// 	vertebra: 'vertex',
// 	vita: 'vitae',
// 	vortex: 'wharf',
// 	wife: 'wives',
// 	wolf: 'wolves',
// 	woman: 'women',
// };
// const regexp = new RegExp(/(s|sh|ch|x|z)$/);
// module.exports = {
// 	helpers: {
//         pluralize: (s) => {
//             const lower = s.toLowerCase()
//             const irregular = IRREGULARS[lower]
//             if (irregular) return irregular;
//             if (regexp.test(lower)) return s + 'es'
//             return s + 's'
//         },
// 	},
// };