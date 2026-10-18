---
title: Pay a bill
description: "Pay a balance in full or in part, top to bottom: where you are, what you owe, how much, how, then the one decision."
aside: false
---

<script setup>
import Pattern from "./PayBill.vue";
</script>

# Pay a bill

Pay a balance in full or in part, top to bottom: where you are, what you owe, how much, how, then the one decision.

**Built from:** ESurface, EStack, EBackLink, EHeading, EAmount, ERadioGroup, ECurrencyField, ESelect, ECardField, ENotice, EActions, EButton.

<div class="pattern-stage">
  <Pattern />
</div>

## Notes

- Each choice only reveals the next thing it needs. "Another amount" shows the amount field, and "A new card" shows the card frame.
- The Pay button names the exact amount it will take and carries a lock. It is the only filled button on the page.
- Card details are entered in the payment provider's hosted fields, inside `ECardField`. They never reach your page or server.
- After paying, show a toast ("Payment received") and a receipt link, then take the person back to their statements.

## Source

::: details PayBill.vue
<<< @/patterns/PayBill.vue
:::
