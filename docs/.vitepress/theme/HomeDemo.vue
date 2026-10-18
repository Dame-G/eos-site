<script setup lang="ts">
import { computed, ref } from "vue";
import { EButton, ENotice, ESegmented, EStack, EStamp, ESurface, ETextField, defineTheme } from "@eos-ui/vue";

const brands = [
  { value: "#2c95b4", label: "Teal" },
  { value: "#6d4bd8", label: "Violet" },
  { value: "#c2410c", label: "Rust" },
  { value: "#2f7d4f", label: "Forest" },
];
const brand = ref(brands[0]!.value);
const style = computed(() => Object.fromEntries(Object.entries(defineTheme({ brand: brand.value }).tokens).map(([k, v]) => [`--e-${k}`, v])));

const email = ref("");
const sent = ref(false);
const error = computed(() => (sent.value && !/^\S+@\S+\.\S+$/.test(email.value) ? "Enter an email address like name@example.com" : undefined));
</script>

<template>
  <EStack class="eos-live">
    <ESegmented v-model="brand" label="Brand colour" :options="brands" />
    <ESurface :style="style" as="form" pad="lg" class="e-root" novalidate @submit.prevent="sent = true">
      <EStack>
        <EStamp status="due" detail="Nov 1" />
        <ETextField v-model="email" label="Send my receipt to" type="email" autocomplete="email" :error="error" hint="Used only for the receipt." />
        <ENotice v-if="sent && !error" tone="success" title="Receipt on its way">We will email {{ email }} after you pay.</ENotice>
        <div><EButton type="submit" icon="lock">Pay $162.40</EButton></div>
      </EStack>
    </ESurface>
  </EStack>
</template>
