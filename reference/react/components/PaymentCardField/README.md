The frame for a payment processor's hosted card fields. Card numbers must never touch your own page or server, so this component draws the label, the edge, the focus ring and the reassurance note, and leaves a mount point for the processor's element. Props: `label`, `state` (`loading`, `ready` or `error`), `error`, `note`, `mountId` or `mountRef` (where to mount the processor's field) or the processor's element as children, and `required`.

- The frame gets the same edge, hover and focus treatment as an input, and shows the focus ring when the processor's iframe is focused.
- Style the processor's own field to match: 16px text, `ink` colour, no border of its own.
- The preview shows a placeholder string where the processor's field would be.
