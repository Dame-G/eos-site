<script setup lang="ts">
import { onMounted } from "vue";
import { useData, useRouter } from "vitepress";
import { EActions } from "@eos-ui/vue/components/EActions";
import { EButton } from "@eos-ui/vue/components/EButton";
import { EEmptyState } from "@eos-ui/vue/components/EEmptyState";
import { EKbd } from "@eos-ui/vue/components/EKbd";
import { pageByCase } from "./nav";

defineEmits<{ search: [] }>();

const { theme } = useData();
const router = useRouter();

// The host sends each component's lower-case address to its page. Any other mix of case, or such a link followed inside the site, lands here. When a page differs only in case, go there, replacing this address so Back does not return to it.
onMounted(() => {
  const target = pageByCase(theme.value.sidebar, location.pathname);
  if (!target) return;
  const href = target + location.search + location.hash;
  history.replaceState({}, "", href);
  void router.go(href);
});
</script>

<template>
  <div class="not-found">
    <EEmptyState title="We could not find that page" icon="search" :heading-level="1">
      The address may have changed, or it was never written. Search for what you wanted, or go back to the home page.
      <template #action>
        <EActions>
          <EButton icon="search" @click="$emit('search')">Search the docs <EKbd small class="not-found-key">/</EKbd></EButton>
          <EButton variant="outline" href="/">Back to the home page</EButton>
        </EActions>
      </template>
    </EEmptyState>
  </div>
</template>
