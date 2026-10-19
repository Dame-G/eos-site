<script setup lang="ts">
import { computed, ref } from "vue";
import {
  EActions,
  EAmount,
  EBackLink,
  ECardField,
  ECurrencyField,
  EHeading,
  ENotice,
  ERadioGroup,
  ESelect,
  EStack,
  ESurface,
  EButton,
  useLocale,
} from "@eos-ui/vue";

const BALANCE = 162.4;
const { formatMoney } = useLocale();

const mode = ref("full");
const other = ref<number | null>(100);
const method = ref("card");
const paid = ref(false);

const amount = computed(() => (mode.value === "full" ? BALANCE : (other.value ?? 0)));
const tooMuch = computed(() => mode.value === "part" && (other.value ?? 0) > BALANCE);
const canPay = computed(() => amount.value > 0 && !tooMuch.value);
</script>

<template>
  <div class="pattern-narrow">
    <ESurface pad="md">
      <EStack :gap="6">
        <EStack :gap="3">
          <EBackLink href="#statements">Back to statements</EBackLink>
          <EStack :gap="3">
            <EHeading :level="2" kicker="Statement 4471">Pay your balance</EHeading>
            <EAmount label="You owe" :amount="BALANCE" :details="[{ label: 'Due', value: 'Nov 1' }]" />
          </EStack>
        </EStack>

        <EStack :gap="4">
          <ERadioGroup
            v-model="mode"
            label="How much would you like to pay?"
            :options="[
              { value: 'full', label: 'The full balance', description: formatMoney(BALANCE) },
              { value: 'part', label: 'Another amount' },
            ]"
          >
            <template #reveal="{ option }">
              <ECurrencyField
                v-if="option.value === 'part'"
                v-model="other"
                label="Amount"
                hide-label
                :max="BALANCE"
                :hint="`Up to ${formatMoney(BALANCE)}.`"
                :error="tooMuch ? `Enter ${formatMoney(BALANCE)} or less.` : undefined"
              />
            </template>
          </ERadioGroup>

          <EStack :gap="2">
            <ESelect
              v-model="method"
              label="Pay with"
              :options="[
                { value: 'card', label: 'Visa ending 4242', icon: 'card' },
                { value: 'bank', label: 'Bank account ending 6789', icon: 'wallet' },
                { value: 'new', label: 'A new card', icon: 'plus' },
              ]"
            />
            <ECardField v-if="method === 'new'" label="Card details">
              <div style="padding: var(--e-space-3); color: var(--e-muted)">The payment provider's card fields appear here</div>
            </ECardField>
          </EStack>
        </EStack>

        <ENotice tone="warning" title="Pay by November 1 to avoid a late fee">A $15.00 fee is added to balances paid after the due date.</ENotice>

        <ENotice v-if="paid" tone="success" title="Payment received">We emailed your receipt.</ENotice>

        <EActions>
          <EButton icon="lock" :disabled="!canPay" @click="paid = true">Pay {{ formatMoney(amount) }}</EButton>
          <EButton variant="outline">Cancel</EButton>
        </EActions>
      </EStack>
    </ESurface>
  </div>
</template>
