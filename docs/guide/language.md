---
title: Words and language
description: "Replace every word a component says. Money, dates and direction follow the locale."
---

# Words and language

```ts
createEos({
  locale: "fr-CA",
  currency: "CAD",
  dir: "rtl", // optional; null follows the document
  messages: { required: "Obligatoire", optional: "Facultatif" },
});
```

- `locale` sets month and weekday names, first day of the week, date order and number formats.
- `currency` is an ISO 4217 code: $162.40 in en-US, 162,40 $ in fr-CA.
- `dir` mirrors layout and flips arrows. It sets the `dir` attribute on the theme target (`<html>` by default). With `dir: null` it follows the document.
- EOS never sets `lang`. Set it on `<html>` yourself.

## Messages

`defaultMessages` lists every word by key. Override any key and the rest stay English. Placeholders such as `{n}` are filled by the component. Statuses are keys too (`status.paid`).

The config is reactive:

```ts
const eos = createEos({ locale: "en-US" });
eos.config.locale = "de-DE";
eos.config.messages = { required: "Pflichtfeld" };
```

Use the same words and locale helpers in your own components:

```ts
import { useMessages, useLocale } from "@eos-ui/vue";

const t = useMessages();
t("pageN", { n: 3 }); // "Page 3"

const { formatDate, parseDate, formatMoney } = useLocale();
formatDate(new Date(2026, 9, 22)); // "10/22/2026" in en-US
```

The full list of helpers is in the [API reference](/guide/api#uselocale). Dates in a [data grid](/guide/data-tables#formatting) and the [date picker](/components/DatePicker) follow the same locale.

With `vue-i18n`, build `messages` from it and set `locale` from `useI18n().locale`.
