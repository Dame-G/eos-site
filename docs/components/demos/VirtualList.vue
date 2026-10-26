<script setup lang="ts">
import { ref } from "vue";
import { EList, EListRow, EStack, EText, EVirtualList } from "@eos-ui/vue";

const visits = Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  title: `Visit ${i + 1}`,
  when: `Day ${i + 1} of the record, ${((i % 7) + 1) * 15} minutes`,
}));

const open = ref<string | number | null>(1);
</script>

<template>
  <EStack>
    <EList v-model="open" label="Visit history">
      <EVirtualList :items="visits" :row-height="56" item-key="id" style="height: 18rem">
        <template #default="{ item }">
          <EListRow :value="item.id" :title="item.title" :subtitle="item.when" />
        </template>
      </EVirtualList>
    </EList>
    <EText size="sm" tone="muted">5,000 visits, only the rows in view are in the page. Open visit: {{ open }}.</EText>
  </EStack>
</template>
