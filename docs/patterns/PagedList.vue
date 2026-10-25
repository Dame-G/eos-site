<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { EButton, ENotice, EPageHeader, EPagination, ESkeleton, EStack, EStamp, ESurface, EText, useAnnouncer } from "@eos-ui/vue";

interface Statement {
  id: number;
  title: string;
  status: "due" | "paid";
}

const PAGE_SIZE = 5;
const all: Statement[] = Array.from({ length: 23 }, (_, i) => ({
  id: 4500 - i * 7,
  title: ["Annual check-up", "Follow-up visit", "Lab work", "Consultation", "Package of four sessions"][i % 5]!,
  status: i === 0 ? "due" : "paid",
}));
const pageCount = Math.ceil(all.length / PAGE_SIZE);

const { announce } = useAnnouncer();

const page = ref(1);
const rows = ref<Statement[]>([]);
const state = ref<"loading" | "error" | "ready">("loading");
let failedOnce = false;
let timer: ReturnType<typeof setTimeout> | undefined;

// Stands in for a request. Page 3 fails the first time so the error state can be seen.
function fetchPage(n: number): Promise<Statement[]> {
  return new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      if (n === 3 && !failedOnce) {
        failedOnce = true;
        reject(new Error("offline"));
      } else resolve(all.slice((n - 1) * PAGE_SIZE, n * PAGE_SIZE));
    }, 350);
  });
}

async function load() {
  const asked = page.value;
  state.value = "loading";
  try {
    const result = await fetchPage(asked);
    if (asked !== page.value) return; // the person moved on: ignore the late answer
    rows.value = result;
    state.value = "ready";
    announce(`${result.length} statements loaded`);
  } catch {
    if (asked !== page.value) return;
    state.value = "error";
  }
}

watch(page, load, { immediate: true });
onBeforeUnmount(() => clearTimeout(timer));

const range = computed(() => `${(page.value - 1) * PAGE_SIZE + 1} to ${Math.min(page.value * PAGE_SIZE, all.length)} of ${all.length}`);
</script>

<template>
  <div class="pattern-md">
    <EStack gap="loose">
      <EPageHeader :heading-level="2" title="Statements" description="Every bill, newest first." />

      <EStack :aria-busy="state === 'loading'" gap="snug" as="ul" aria-label="Statements" class="paged-list">
        <template v-if="state === 'loading'">
          <li v-for="n in PAGE_SIZE" :key="n"><ESkeleton :height="64" /></li>
        </template>
        <template v-else-if="state === 'ready'">
          <li v-for="s in rows" :key="s.id">
            <ESurface>
              <EStack gap="snug">
                <EText>{{ s.title }}</EText>
                <EText size="sm" tone="muted">Statement {{ s.id }}</EText>
                <EStamp :status="s.status" size="sm" />
              </EStack>
            </ESurface>
          </li>
        </template>
      </EStack>

      <ENotice v-if="state === 'error'" tone="danger" title="Page did not load" :heading-level="3">
        We could not reach the server. Your statements are safe.
        <template #actions><EButton variant="outline" @click="load">Try again</EButton></template>
      </ENotice>

      <EText v-if="state === 'ready'" size="sm" tone="muted">Showing {{ range }}</EText>
      <EPagination v-model="page" :page-count="pageCount" label="Statement pages" />
    </EStack>
  </div>
</template>

<style scoped>
.paged-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
