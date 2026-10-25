<script setup lang="ts">
import { computed, ref } from "vue";
import {
  EActions,
  EButton,
  EDatePicker,
  EDescriptionList,
  EFieldset,
  ENotice,
  EPhoneField,
  ERadioGroup,
  ESelect,
  ESignatureField,
  EStack,
  EStepper,
  ETextField,
  useLocale,
  type SignatureValue,
} from "@eos-ui/vue";

const STEPS = ["Your details", "How you will pay", "Forms", "Review"];
const step = ref(0);
const done = ref(false);
const submitted = ref(false);

const first = ref("");
const last = ref("");
const born = ref<Date | null>(null);
const phone = ref("");
const street = ref("");
const city = ref("");
const region = ref<string | null>(null);
const postal = ref("");
const pay = ref("card");
const signature = ref<SignatureValue>({ method: "type", name: "", image: "", agreed: false });

const { formatDate } = useLocale();

const stepper = computed(() =>
  STEPS.map((label, i) => ({
    label,
    state: i < step.value ? ("done" as const) : i === step.value ? ("current" as const) : ("todo" as const),
  })),
);

const errors = computed(() => {
  if (!submitted.value || step.value !== 0) return [];
  const list: { id: string; field: string; message: string }[] = [];
  if (!first.value.trim()) list.push({ id: "reg-first", field: "First name", message: "Enter your first name" });
  if (!last.value.trim()) list.push({ id: "reg-last", field: "Last name", message: "Enter your last name" });
  if (phone.value.replace(/\D/g, "").length < 10) list.push({ id: "reg-phone", field: "Mobile phone", message: "Enter a mobile number with 10 digits" });
  return list;
});
const errorOf = (id: string) => errors.value.find((e) => e.id === id)?.message;

function next() {
  submitted.value = true;
  if (step.value === 0 && errors.value.length) return;
  submitted.value = false;
  if (step.value < STEPS.length - 1) step.value++;
  else done.value = true;
}
function back() {
  submitted.value = false;
  if (step.value > 0) step.value--;
}
</script>

<template>
  <form novalidate class="pattern-narrow" @submit.prevent="next">
    <EStack gap="section">
      <EStepper label="Registration" :steps="stepper" />

      <ENotice v-if="done" tone="success" title="You are registered">We sent a confirmation to your phone.</ENotice>

      <template v-else>
        <EFieldset v-if="step === 0" section legend="Your details" hint="We use these to find your account and send reminders.">
          <ETextField id="reg-first" v-model="first" label="First name" required autocomplete="given-name" :error="errorOf('reg-first')" />
          <ETextField id="reg-last" v-model="last" label="Last name" required autocomplete="family-name" :error="errorOf('reg-last')" />
          <EDatePicker v-model="born" label="Date of birth" required :max="new Date(2026, 9, 18, 12)" hint="Type it or choose from the calendar." />
          <EPhoneField id="reg-phone" v-model="phone" label="Mobile phone" required hint="We will text a code to confirm it." :error="errorOf('reg-phone')" />
          <EFieldset legend="Home address">
            <ETextField v-model="street" label="Street" autocomplete="address-line1" />
            <ETextField v-model="city" label="City" autocomplete="address-level2" />
            <ESelect
              v-model="region"
              label="State"
              :options="[
                { value: 'CA', label: 'California' },
                { value: 'NY', label: 'New York' },
                { value: 'TX', label: 'Texas' },
                { value: 'WA', label: 'Washington' },
              ]"
            />
            <ETextField v-model="postal" label="ZIP code" autocomplete="postal-code" inputmode="numeric" />
          </EFieldset>
        </EFieldset>

        <EFieldset v-else-if="step === 1" section legend="How you will pay" hint="You can change this at any time.">
          <ERadioGroup
            v-model="pay"
            label="Payment method"
            :options="[
              { value: 'card', label: 'Card on file', description: 'We keep it with our payment provider, not on this page.' },
              { value: 'later', label: 'Pay at each visit' },
            ]"
          />
        </EFieldset>

        <EFieldset v-else-if="step === 2" section legend="Forms" hint="Typing your name is your signature.">
          <ESignatureField v-model="signature" label="New client form" mode="both" :date="new Date(2026, 9, 18, 12)" />
        </EFieldset>

        <EFieldset v-else section legend="Review" hint="Check your details, then finish.">
          <EDescriptionList
            :items="[
              { label: 'Name', text: `${first} ${last}`.trim() || 'Not entered' },
              { label: 'Date of birth', text: born ? formatDate(born) : 'Not entered' },
              { label: 'Mobile phone', text: phone || 'Not entered' },
              { label: 'Payment', text: pay === 'card' ? 'Card on file' : 'Pay at each visit' },
              { label: 'Form', text: signature.agreed ? 'Signed' : 'Not signed' },
            ]"
          />
        </EFieldset>

        <EActions>
          <EButton type="submit">{{ step === STEPS.length - 1 ? "Finish registration" : "Continue" }}</EButton>
          <EButton v-if="step > 0" variant="outline" type="button" @click="back">Back</EButton>
          <EButton v-else variant="outline" type="button">Save and finish later</EButton>
        </EActions>
      </template>
    </EStack>
  </form>
</template>
