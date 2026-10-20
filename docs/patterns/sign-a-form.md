---
title: Sign a form
description: "A list of forms to sign, and signing one."
aside: false
---

<script setup>
import Pattern from "./SignForm.vue";
</script>

# Sign a form

Built from: [`EStamp`](/components/Stamp), [`EIcon`](/components/Icon), [`ENotice`](/components/Notice), [`EHeading`](/components/Heading), [`EText`](/components/Text), [`ESurface`](/components/Surface), [`EStack`](/components/Stack), [`EGrid`](/components/Grid), [`ELink`](/components/Link), [`ESignatureField`](/components/SignatureField), [`EUpload`](/components/Upload), [`EActions`](/components/Actions), [`EButton`](/components/Button).

<div class="pattern-stage">
  <Pattern />
</div>

- A signature can be typed or drawn.
- Submit waits until the person has agreed and signed.

<EDisclosure title="SignForm.vue">

<<< @/patterns/SignForm.vue

</EDisclosure>
