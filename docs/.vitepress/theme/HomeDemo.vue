<script setup lang="ts">
import { computed, ref } from "vue";
import { EButton, ENotice, EStamp, ETextField } from "@eos-ui/vue";

const email = ref("name@");
const sent = ref(false);
const error = computed(() => (sent.value && !/^\S+@\S+\.\S+$/.test(email.value) ? "Enter an email address like name@example.com" : undefined));
</script>

<template>
  <form class="mini" novalidate @submit.prevent="sent = true">
    <p class="e-kicker">A live Eos form</p>
    <div class="line"><EStamp status="due" detail="Nov 1" /><span>Statement 4471: $162.40</span></div>
    <ETextField v-model="email" label="Send my receipt to" type="email" autocomplete="email" :error="error" hint="We only use this for the receipt." />
    <ENotice v-if="sent && !error" tone="success" title="Receipt on its way">We will email {{ email }} after you pay.</ENotice>
    <div><EButton type="submit" icon="lock">Pay $162.40</EButton></div>
  </form>
</template>

<style scoped>
.mini {
  display: grid;
  gap: var(--e-space-4);
  max-width: 28rem;
  margin: 0 auto;
  padding: var(--e-space-6);
  border: var(--e-stroke-hair) solid var(--e-border);
  border-radius: var(--e-radius-md);
  background: var(--e-surface);
}
.mini p {
  margin: 0;
}
.line {
  display: flex;
  flex-wrap: wrap;
  gap: var(--e-space-3);
  align-items: center;
}
</style>
