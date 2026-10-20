---
title: Pay a bill
description: "Pay a balance in full or in part."
aside: false
---

<script setup>
import Pattern from "./PayBill.vue";
</script>

# Pay a bill

Built from: [`ESurface`](/components/Surface), [`EStack`](/components/Stack), [`ELink`](/components/Link), [`EHeading`](/components/Heading), [`EKicker`](/components/Kicker), [`ERadioGroup`](/components/RadioGroup), [`ECurrencyField`](/components/CurrencyField), [`ESelect`](/components/Select), [`ENotice`](/components/Notice), [`EActions`](/components/Actions), [`EButton`](/components/Button).

<div class="pattern-stage">
  <Pattern />
</div>

- Each choice reveals only the next thing it needs.
- The Pay button names the exact amount and is the only filled button.
- A new card is entered with your payment provider's hosted fields, so card details never reach your page.

<EDisclosure title="PayBill.vue">

<<< @/patterns/PayBill.vue

</EDisclosure>
