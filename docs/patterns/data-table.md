---
title: Data table with bulk actions
description: "A DataGrid with selection, bulk actions, a confirm dialog and a toast."
aside: false
---

<script setup>
import Pattern from "./DataTable.vue";
</script>

# Data table with bulk actions

Built from: [`EDataGrid`](/components/DataGrid), [`EDialog`](/components/Dialog), [`EToastProvider`](/components/ToastProvider), [`EStamp`](/components/Stamp), and the layout and text components.

<div class="pattern-stage">
  <Pattern />
</div>

- Select rows to show the bulk actions. The selection survives paging and filtering.
- The destructive action asks first, in a dialog whose button says what it does.
- The result is a toast. For rows that live on a server, see [Data tables](/guide/data-tables).

<EDisclosure title="DataTable.vue">

<<< @/patterns/DataTable.vue

</EDisclosure>
