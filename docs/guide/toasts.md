---
title: Toasts and notifications
description: "Show confirmations with useToast, keep messages that need action in a Notice, and announce changes to screen readers."
---

<script setup>
import ToastsAndNotices from "./examples/ToastsAndNotices.vue";
</script>

# Toasts and notifications

## Toast or Notice

| Compared | [`useToast()`](/components/ToastProvider) | [`ENotice`](/components/Notice) |
| --- | --- | --- |
| Goes away | by itself, after 5 seconds | when the problem is dealt with, or the person closes it |
| Close button | on by default; `EToast` takes `:closable="false"` to hide it | off by default, `closable` shows it |
| Appears | floating, at the edge of the page | in the page, where it applies |
| For | "Saved", "Payment received", "Statement removed, Undo" | a form error, a deadline, an outage, a failed payment |
| Announced | politely (an error at once) | politely (an error at once) |

If the person must read it before going on, it is a Notice. If it confirms what they just did, it is a toast.

<div class="pattern-stage">
  <ToastsAndNotices />
</div>

## Set up

Mount one [`EToastProvider`](/components/ToastProvider) near the root of the app. With `createEos()` installed, `useToast()` then works from any component, and from code outside components such as a router guard or a store.

```vue
<!-- App.vue -->
<EToastProvider><RouterView /></EToastProvider>
```

```ts
import { useToast } from "@eos-ui/vue";

const toast = useToast();
const id = toast.show({ title: "Payment received", message: "A receipt was sent to your email.", tone: "success" });
toast.dismiss(id);
toast.clear();
```

Without the plugin, the `EToastProvider` makes its own store and `useToast()` works only inside it. Elsewhere it throws. To use it elsewhere without the plugin, provide a store: `app.provide(TOAST_KEY, createToasts())`.

## Options

| Option | Notes |
| --- | --- |
| `title` | Required. What happened, in a few words |
| `message` | One sentence of detail |
| `tone` | `info` (default), `success`, `warning` or `danger` |
| `action` | A button vnode, or a function that returns one. A toast with an action stays until dismissed |
| `duration` | Milliseconds. `0` stays. 5000 by default, and `0` for `danger` |

```ts
import { h } from "vue";
import { EButton } from "@eos-ui/vue";

toast.show({
  title: "Statement removed",
  action: () => h(EButton, { variant: "outline", onClick: () => toast.clear() }, () => "Undo"),
});
```

## Good toasts

- Keep the title to a few words and say what happened: "Payment received", not "Success".
- Never put the only copy of important information in a toast. It disappears.
- Show one toast for one action.
- Timers pause while the pointer or keyboard focus is on a toast, so people can read it.

## Announcing without a toast

When something changes that nobody can see, such as "3 rows selected" or a filtered count, use [`useAnnouncer()`](/guide/composables#useannouncer). It speaks to screen readers and shows nothing. Do not announce what is already inside a live region.
