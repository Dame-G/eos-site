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

- Press Send with nothing chosen to see the error. Choose a file that is not a PDF, JPG or PNG, or is over 5 MB, and the error names the file and the reason.
- The limits are stated in the `hint` before anyone tries, then enforced by `accept`, `max-size` and `max-files`. Those apply to dropped files too.
- While sending, the dropzone is disabled, the button shows a spinner and a labelled `EProgress` carries the count. The button is announced as busy and the bar is a named `progressbar`.
- The result replaces the form with a notice that says how many files arrived and what happens next. "Send more" brings the form back.
- The simulated request counts to 100. Drive the bar from your request's progress event instead, or leave `value` out for an indeterminate bar when the length is unknown.

## Decisions

- **`EUpload`, not a native file input.** It names itself, lists the files with Remove buttons, announces what was added or left out, and applies the limits to dropped files.
- **`reject` sets `error`.** The dropzone leaves refused files out silently apart from the announcement. Showing the reason beside the field is your job, and the field's `error` is where it goes.
- **`EProgress` with a value, not `ESpinner`.** A known fraction deserves a bar. Swap in a spinner or an indeterminate bar when you only know "working".
- **A notice for the result, not a toast.** The person must know whether it worked, and the next step belongs with the message. A toast would go away before a slow reader finished it.

<EDisclosure title="UploadFlow.vue">

<<< @/patterns/UploadFlow.vue

</EDisclosure>
