---
title: Pay a bill
description: "Pay a balance in full or in part."
aside: false
---

<script setup>
import Pattern from "./PayBill.vue";
</script>

# Pay a bill

Built from: ESurface, EStack, ELink, EHeading, EKicker, ERadioGroup, ECurrencyField, ESelect, ENotice, EActions, EButton.

<div class="pattern-stage">
  <Pattern />
</div>

- Each choice reveals only the next thing it needs.
- The Pay button names the exact amount and is the only filled button.
- A new card is entered with your payment provider's hosted fields, so card details never reach your page.

<EDisclosure title="PayBill.vue">

<<< @/patterns/PayBill.vue

</EDisclosure>
