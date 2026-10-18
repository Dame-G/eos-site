Related controls in a bordered box. Props: `legend`, `hint`, `error`, `required` or `optional`, `disabled` (disables everything inside), `bare`, and the controls as children. Use it, not a bare label, whenever two or more controls answer one question. RadioGroup and TimeSlots are `bare` Fieldsets; AddressFields is a boxed one.

- The title sits on the top edge at the start and Required or Optional at the end, with a line between them and room either side, so the border never runs into the text.
- `bare` drops the box: the legend becomes a small mono label above the controls, like a Field's label, with Required or Optional at the end.
- The legend names the group and the fields drop the repeated word: "Home address" holds Street, City and ZIP code, not Street address.
- The hint and error are announced with the group.
