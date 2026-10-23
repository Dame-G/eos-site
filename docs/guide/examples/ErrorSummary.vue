<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { EButton, ELink, ENotice, EStack, ETextField } from "@eos-ui/vue";

const first = ref("");
const phone = ref("");
const submitted = ref(false);

const problems = computed(() => {
  if (!submitted.value) return [];
  const list: { id: string; label: string; message: string }[] = [];
  if (!first.value.trim()) list.push({ id: "es-first", label: "First name", message: "Enter your first name" });
  if (phone.value.replace(/\D/g, "").length !== 10) list.push({ id: "es-phone", label: "Mobile phone", message: "Enter a mobile number with 10 digits" });
  return list;
});
const errorOf = (id: string) => problems.value.find((p) => p.id === id)?.message;
const focusField = (id: string) => document.getElementById(id)?.focus();

async function submit() {
  submitted.value = true;
  await nextTick(); // let the errors render before moving focus
  if (problems.value.length) focusField(problems.value[0]!.id);
}
</script>

<template>
  <form novalidate @submit.prevent="submit">
    <EStack>
      <ENotice v-if="problems.length" tone="danger" :title="problems.length === 1 ? 'Fix 1 thing to continue' : `Fix ${problems.length} things to continue`">
        <EStack as="ul" :gap="1">
          <li v-for="p in problems" :key="p.id">
            <ELink :href="`#${p.id}`" @click.prevent="focusField(p.id)">{{ p.label }}: {{ p.message }}</ELink>
          </li>
        </EStack>
      </ENotice>
      <ETextField id="es-first" v-model="first" label="First name" autocomplete="given-name" required :error="errorOf('es-first')" />
      <ETextField id="es-phone" v-model="phone" label="Mobile phone" type="tel" autocomplete="tel" required :error="errorOf('es-phone')" />
      <EButton type="submit">Continue</EButton>
    </EStack>
  </form>
</template>
