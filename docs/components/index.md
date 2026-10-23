---
title: Components
description: "Every EOS component with its props and a live demo, grouped by layer."
---

<script setup>
import { data } from "../data/components.data.js";
</script>

# Components

EOS is built in six layers, from primitives up to the page frame, and each layer's styles sit in their own cascade layer (`e.primitives`, `e.blocks`, `e.controls`, `e.composites`, `e.containers`, `e.page`, in that order). A component only uses components from its own layer or an earlier one, so a primitive never depends on a dialog, and later layers can safely override earlier ones. The groups below follow that order.

<ComponentIndex :groups="data" />
