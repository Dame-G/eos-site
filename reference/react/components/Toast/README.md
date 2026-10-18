A floating message that confirms or reports something just done: Notice's tones, icons and layout, lifted with the float shadow. Props: `title`, children, `tone`, `action`, `onClose`. Render toasts through ToastProvider and `useToast()`, which owns the region, the timers and pause-on-hover.

- 24rem wide; with an action, up to 40rem, laid out like a Notice (action at the end when there is room, under the text when not).
- Success and information go after five seconds. An error, or a toast with an action, stays until dismissed.
