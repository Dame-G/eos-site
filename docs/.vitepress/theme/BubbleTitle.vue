<script setup lang="ts">
// The EOS wordmark: heavy letters in a single colour, standing on a slab of that colour darkened so they pop off the page. The letters float together, barely; the decorative copy in the header does not move at all.
// It sizes with the text around it and takes its colour from `color`. Screen readers get the word, not the letters.
defineProps<{ decorative?: boolean }>();
const letters = ["e", "o", "s"];
</script>

<template>
  <span class="bubble" :class="{ 'bubble--still': decorative }" :aria-hidden="decorative ? 'true' : undefined">
    <span v-if="!decorative" class="bubble-word">EOS</span>
    <span class="bubble-letters" aria-hidden="true">
      <span v-for="(c, n) in letters" :key="n" class="bubble-letter" :style="{ '--n': n }">{{ c }}</span>
    </span>
  </span>
</template>

<style scoped>
.bubble {
  display: inline-block;
  position: relative;
  line-height: 1;
}

.bubble-word {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.bubble-letters {
  display: inline-flex;
  padding: 0.06em 0.08em 0;
  font-family: "Geist Mono", var(--e-font-mono);
  font-weight: 800;
  letter-spacing: -0.07em;
  text-transform: uppercase;
}

.bubble-letter {
  position: relative;
  display: inline-block;
  color: inherit;
  filter: drop-shadow(0 0.028em 0 color-mix(in srgb, currentColor var(--slab, 86%), black));
  transform-origin: 50% 85%;
  animation: bubble-bob 7s ease-in-out infinite;
  animation-delay: calc(var(--n) * -0.35s);
}

@keyframes bubble-bob {
  0%,
  100% {
    transform: translateY(0.006em);
  }
  50% {
    transform: translateY(-0.012em);
  }
}

/* The small one in the header stays still. */
/* On the dark page the slab has to be a good deal darker than the letters to read as depth. */
:root[data-scheme="dark"] .bubble-letter {
  --slab: 58%;
}

.bubble--still .bubble-letter {
  animation: none;
}

@media (prefers-reduced-motion: reduce) {
  .bubble-letter {
    animation: none;
  }
}
</style>
