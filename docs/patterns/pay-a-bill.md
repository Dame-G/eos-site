---
title: Pay a bill
description: "Pay a balance in full or in part."
aside: false
---

<script setup>
import Pattern from "./PayBill.vue";
</script>

# Pay a bill

Built from: [`ERadioGroup`](/components/RadioGroup), [`ECurrencyField`](/components/CurrencyField), [`ESelect`](/components/Select), [`ENotice`](/components/Notice), and the layout and text components.

<div class="pattern-stage">
  <Pattern />
</div>

- Each choice reveals only the next thing it needs.
- The Pay button names the exact amount and is the only filled button.
- A new card is entered with your payment provider's hosted fields, so card details never reach your page.

## Decisions

- **`ERadioGroup`, not `ESelect`.** There are two or three choices and the person should see them all. Use a select from about six options up.
- **`ECurrencyField` only for another amount.** It formats in the configured currency and stays out of the way until asked. A plain `ETextField` would leave the formatting to the person.
- **`ENotice` for the result.** The receipt message has to stay until read and holds the next step. Swap to a toast when the result is a small confirmation on a page the person stays on.
- **Hosted card fields, not `ETextField`.** Card numbers belong to your payment provider's fields. eos has no card field on purpose.

<EDisclosure title="PayBill.vue">

<<< @/patterns/PayBill.vue

</EDisclosure>
