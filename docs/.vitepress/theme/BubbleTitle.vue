<script setup lang="ts">
// The home page's title: the eos wordmark in lowercase Outfit SemiBold, the face of the logo, in a single colour, standing on a slab of that colour darkened so they pop off the page. The letters float together, barely.
// It sizes with the text around it and takes its colour from `color`. Screen readers get the word, not the letters.
const letters = ["e", "o", "s"];
</script>

<template>
  <span class="bubble">
    <span class="bubble-word">eos</span>
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
  padding: 0.06em 0.08em 0 0.041em;
  font-family: "Outfit", var(--e-font-sans);
  font-weight: 600;
}

/* The letters tuck in by 1%, as in the logo. With a negative margin, not letter-spacing: spacing shortens each box so the glyph spills past its right edge, and Safari clips a filtered, animated layer to its box. That cut the last letter. */
.bubble-letter + .bubble-letter {
  margin-inline-start: -0.01em;
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

/* On the dark page the slab has to be a good deal darker than the letters to read as depth. */
:root[data-scheme="dark"] .bubble-letter {
  --slab: 58%;
}

@media (prefers-reduced-motion: reduce) {
  .bubble-letter {
    animation: none;
  }
}
</style>
