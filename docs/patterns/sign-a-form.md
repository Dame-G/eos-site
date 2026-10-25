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

- Type your name, or switch to drawing and sign with the pointer.
- Submit stays disabled until you have agreed and signed. Sign, then submit.

## Decisions

- **`ESignatureField`, not a checkbox.** A typed or drawn signature is evidence of who agreed, and it carries the agreement. A checkbox is enough when the law or policy only needs a yes.
- **`EUpload` for attachments.** It lists files with Remove buttons and applies size and type limits.
- **`EStamp` for status.** A word in a row says "Signed" or "Due" without colour alone. Swap to `ENotice` for a status that needs an action.
- **Submit disabled until signed.** The notice above says what is missing. A disabled button does not explain itself, so always say why somewhere near it.

<EDisclosure title="SignForm.vue">

<<< @/patterns/SignForm.vue

</EDisclosure>
