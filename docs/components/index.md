---
title: Components
description: "Every EOS component with its props and a live demo, grouped by layer."
---

<script setup>
import { data } from "../data/components.data.js";
</script>

# Components

Every component below is documented with its props, slots, keyboard behaviour and accessibility notes. They are grouped by what you are trying to do. Under the hood EOS is built in layers, from primitives up to the page frame, each in its own cascade layer (see [Tailwind and CSS](/guide/tailwind-and-css)).

<ComponentIndex :groups="data" />
