---
title: Upload flow
description: "Choose files, see why one was refused, watch progress and confirm what was sent."
aside: false
---

<script setup>
import Pattern from "./UploadFlow.vue";
</script>

# Upload flow

Built from: [`EUpload`](/components/Upload), [`EProgress`](/components/Progress), [`ENotice`](/components/Notice), [`EButton`](/components/Button), [`EActions`](/components/Actions), and the layout and text components.

<div class="pattern-stage">
  <Pattern />
</div>

- Press Send with nothing chosen to see the error.
- Choose or drop a file that is not a PDF, JPG or PNG, or is over 5 MB: the error names the file and the reason.
- Send a valid file and watch the progress bar, then press "Send more" to bring the form back.

## Decisions

- **`EUpload`, not a native file input.** It names itself, lists the files with Remove buttons, announces what was added or left out, and applies the limits to dropped files.
- **Limits in the `hint` first.** They are stated before anyone tries, then enforced by `accept`, `max-size` and `max-files`.
- **`reject` sets `error`.** The dropzone leaves refused files out silently apart from the announcement. Showing the reason beside the field is your job, and the field's `error` is where it goes.
- **`EProgress` with a value, not `ESpinner`.** A known fraction deserves a bar: drive it from your request's progress event (the example simulates one). While sending, the dropzone is disabled and the button is announced as busy. Leave `value` out for an indeterminate bar when you only know "working".
- **A notice for the result, not a toast.** The person must know whether it worked, and the next step belongs with the message. A toast would go away before a slow reader finished it.

<EDisclosure title="UploadFlow.vue">

<<< @/patterns/UploadFlow.vue

</EDisclosure>
