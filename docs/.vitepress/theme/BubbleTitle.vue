<script setup lang="ts">
import { EVisuallyHidden } from "@eos-ui/vue/components/EVisuallyHidden";

// The eos wordmark: lowercase Outfit SemiBold, the face of the logo, in a single colour. On the home page the letters float together, barely; the decorative copy in the header does not move at all.
// It sizes with the text around it and takes its colour from `color`. Screen readers get the word, not the letters.
defineProps<{ decorative?: boolean }>();
const letters = ["e", "o", "s"];
</script>

<template>
  <span class="bubble" :class="{ 'bubble--still': decorative }" :aria-hidden="decorative ? 'true' : undefined">
    <EVisuallyHidden v-if="!decorative">eos</EVisuallyHidden>
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

.bubble-letters {
  display: inline-flex;
  padding: 0.06em 0.08em 0 0.041em;
  font-family: "Outfit", var(--e-font-sans);
  font-weight: var(--e-weight-strong);
}

/* The letters tuck in by 1%, as in the logo. With a negative margin, not letter-spacing: spacing shortens each box so the glyph spills past its right edge, and Safari clips a filtered, animated layer to its box. That cut the last letter. */
.bubble-letter + .bubble-letter {
  margin-inline-start: -0.01em;
}

.bubble-letter {
  position: relative;
  display: inline-block;
  color: inherit;
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
.bubble--still .bubble-letter {
  animation: none;
}

@media (prefers-reduced-motion: reduce) {
  .bubble-letter {
    animation: none;
  }
}
</style>
