One amount in mono tabular figures, with an optional label and, only when they add information, a few details beneath. Props: `amount`, `label` and `details` (`{label, value}`; a number is shown as money, text as it is). Show one lead amount per statement; the label says what it is ("You owe", "Paid", "Balance").

Amounts use `Intl.NumberFormat` with the configured currency and locale, so `configure({ currency: "EUR", locale: "de-DE" })` turns $162.40 into 162,40 €. Set `currency` or `locale` on one figure to override.
