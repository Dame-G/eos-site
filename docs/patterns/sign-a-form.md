---
title: Sign a form
description: "A list of forms to sign, and signing one."
aside: false
---

<script setup>
import Pattern from "./SignForm.vue";
</script>

# Sign a form

Built from: [`ESignatureField`](/components/SignatureField), [`EUpload`](/components/Upload), [`EStamp`](/components/Stamp), [`ENotice`](/components/Notice), and the layout and text components.

<div class="pattern-stage">
  <Pattern />
</div>

- A signature can be typed or drawn.
- Submit waits until the person has agreed and signed.

<EDisclosure title="SignForm.vue">

<<< @/patterns/SignForm.vue

</EDisclosure>
