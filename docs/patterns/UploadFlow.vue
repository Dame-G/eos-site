<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { EActions, EButton, ENotice, EPageHeader, EProgress, EStack, EUpload } from "@eos-ui/vue";

const MAX_SIZE = 5 * 1024 * 1024;

const files = ref<File[]>([]);
const error = ref<string>();
const phase = ref<"choose" | "sending" | "done">("choose");
const sent = ref(0);
const progress = ref(0);
let timer: ReturnType<typeof setInterval> | undefined;

const reasons = { type: "is not a PDF, JPG or PNG", size: "is over 5 MB", count: "would be the fourth file" } as const;

// `reject` lists what the dropzone left out. Say why, so the person can fix it.
function onReject(rejected: { file: File; reason: keyof typeof reasons }[]) {
  const first = rejected[0]!;
  error.value = `${first.file.name} ${reasons[first.reason]}.${rejected.length > 1 ? ` ${rejected.length - 1} more were left out too.` : ""}`;
}
function onFiles() {
  error.value = undefined;
}

const label = computed(() => (files.value.length === 1 ? "Send 1 document" : `Send ${files.value.length} documents`));

function send() {
  if (!files.value.length) {
    error.value = "Choose at least one file to send.";
    return;
  }
  phase.value = "sending";
  progress.value = 0;
  // A real upload reports progress from the request. This one counts up so the bar has something to show.
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 25);
    if (progress.value === 100) {
      clearInterval(timer);
      sent.value = files.value.length;
      files.value = [];
      phase.value = "done";
    }
  }, 150);
}

function again() {
  phase.value = "choose";
}

onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <div class="pattern-md">
    <EStack gap="loose">
      <EPageHeader :heading-level="2" title="Send documents" description="Your insurance card and any referral letters." />

      <ENotice v-if="phase === 'done'" tone="success" title="Documents sent" :heading-level="3">
        We received {{ sent }} {{ sent === 1 ? "document" : "documents" }}. We will email you when they are checked.
        <template #actions><EButton variant="outline" @click="again">Send more</EButton></template>
      </ENotice>

      <form v-else novalidate @submit.prevent="send">
        <EStack gap="loose">
          <EUpload
            v-model="files"
            label="Documents"
            accept=".pdf,.jpg,.png"
            multiple
            :max-size="MAX_SIZE"
            :max-files="3"
            :disabled="phase === 'sending'"
            :error="error"
            hint="PDF, JPG or PNG. Up to 3 files, 5 MB each."
            @update:model-value="onFiles"
            @reject="onReject"
          />
          <EProgress v-if="phase === 'sending'" label="Sending documents" :value="progress" />
          <EActions>
            <EButton type="submit" icon="upload" :loading="phase === 'sending'">{{ files.length ? label : "Send documents" }}</EButton>
          </EActions>
        </EStack>
      </form>
    </EStack>
  </div>
</template>
