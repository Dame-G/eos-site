---
title: Toasts and notifications
description: "Show confirmations with useToast, keep messages that need action in a Notice, and announce changes to screen readers."
---

<script setup>
import ToastsAndNotices from "./examples/ToastsAndNotices.vue";
</script>

# Toasts and notifications

## Toast or Notice

| | A toast, from [`useToast()`](/guide/api#usetoast) | [`ENotice`](/components/Notice) |
| --- | --- | --- |
| Goes away | by itself, after 5 seconds (a danger toast or one with an action stays) | when the problem is dealt with, or the person closes it |
| Dismiss button | on by default; `closable: false` hides it on a toast that goes by itself | off by default, `closable` shows it |
| Appears | floating, at the edge of the page | in the page, where it applies |
| For | "Saved", "Payment received", "Statement removed, Undo" | a form error, a deadline, an outage, a failed payment |
| Announced | politely ([tone](/guide/glossary#tone) `danger` at once) | politely (`danger` at once) |

If the person must read it before going on, it is a Notice. If it confirms what they just did, it is a toast.

<div class="pattern-stage">
  <ToastsAndNotices />
</div>

## Set up

`createEos()` gives the whole app one toast store, so `useToast()` works in any component. Mount one [`EToastProvider`](/components/ToastProvider) near the root of the app: it is where the toasts appear. [Getting started](/guide/getting-started#_3-add-the-toast-region-to-app-vue) shows both.

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

Without the plugin, the `EToastProvider` makes its own store and `useToast()` works only in components inside it. Elsewhere it throws. To use it elsewhere without the plugin, such as in a router guard or a store, provide a store yourself: `app.provide(TOAST_KEY, createToasts())`.

## Options

| Option | Notes |
| --- | --- |
| `title` | Required. What happened, in a few words |
| `message` | One sentence of detail |
| `tone` | `info` (default), `neutral`, `success`, `warning` or `danger`. `danger` is announced at once |
| `icon` | Replaces the tone's icon |
| `closable` | Shows the "Dismiss" button. On by default. A toast that stays (`duration` 0) always shows it, since nothing else would remove it |
| `key` | Names the toast. Showing another with the same key updates the one on screen and restarts its timer, so a repeated event stays one toast |
| `action` | A button vnode, or a function that returns one |
| `duration` | Milliseconds, `0` to stay until dismissed. 5000 by default; `0` for `danger` and for a toast with an action |

The full types are in the [API reference](/guide/api#usetoast).

## Change a toast on screen

`update(id, patch)` changes a toast that is showing, such as its title or tone, and restarts its timer. `promise()` does the common case for you: it shows `loading` until the promise settles, then turns the same toast into `success` or a `danger` `error`, and returns the promise.

```ts
const id = toast.show({ title: "Uploading statement", duration: 0 });
toast.update(id, { title: "Statement uploaded", tone: "success" }); // goes after 5 seconds

await toast.promise(saveCard(), {
  loading: "Saving card",
  success: "Card saved",
  error: (e) => ({ title: "Card not saved", message: String(e) }),
});
```

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
