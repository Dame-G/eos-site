---
title: Sign a form
description: "A list of forms to sign, and signing one."
aside: false
---

<script setup>
import Pattern from "./SignForm.vue";
</script>

# Sign a form

A list of forms to sign, and signing one.

**Built from:** EItemList, EItemRow, ENotice, EHeading, ESurface, EBackLink, ESignatureField, EUpload, EIconButton, EActions, EButton.

<div class="pattern-stage">
  <Pattern />
</div>

## Notes

- A signature can be typed or drawn. A drawn one is never the only option.
- The Submit button waits until the person has agreed and signed.
- The status of each form is a stamp with a word and a glyph, not colour alone.

## Source

::: details SignForm.vue
<<< @/patterns/SignForm.vue
:::
