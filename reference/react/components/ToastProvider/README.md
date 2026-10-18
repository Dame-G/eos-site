Put it once around the app, then call `useToast()` anywhere inside it: `toast.show({ title, children, tone, action, duration })` returns an id, `toast.dismiss(id)` removes one, `toast.clear()` all. Toasts stack in a labelled region at the bottom right.

- Success and info toasts go after 5 seconds (`duration` in ms); a toast with an `action` or the `danger` tone stays until dismissed.
- The timers pause while the pointer or keyboard focus is on a toast, so it cannot vanish while being read or used (WCAG 2.2.1).
- Each toast is a status or alert live region, so it is announced when it appears.
- In Vue, provide the same API with `provide` and `inject` and render the region once.
