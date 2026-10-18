A thin bar that slides across its track while something of unknown length loads. Props: `label` (what is loading; screen readers hear it as a progress bar, default "Loading"). It fills the width of its container, so put it at the top of a Panel or above the list it is loading, or under a heading.

- Use it for a page, list or statement that takes more than a moment; use Skeleton to hold the shape of what is coming, and Spinner for a single action. For an amount you can measure (a form's steps, an upload) use Progress.
- It is 8px tall with a visible edge, and the moving part is the `primary` fill (7.9:1 on the track).
- Under reduced motion it stops and the fill is a static diagonal stripe, so it still reads as busy. In forced colours it uses the system highlight.
- Pair it with text when the wait may be long; do not stack it with a Spinner.
