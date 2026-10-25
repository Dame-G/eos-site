import { ref } from "vue";

/**
 * Headings of the page that are not on screen right now, which the outline leaves out so it never links to a missing
 * id. The components index hides the groups its filter empties (ComponentIndex.vue).
 */
export const hiddenHeadings = ref<ReadonlySet<string>>(new Set());
