---
title: Words and language
description: "Replace every word a component says, and let money, dates and direction follow the locale."
---

# Words and language

Every string a component writes can be replaced, and money, dates and numbers follow the configured locale. Set it once:

```ts
createEos({
  locale: "fr-CA",
  currency: "CAD",
  messages: { required: "Obligatoire", optional: "Facultatif" },
});
```

## Messages

Each word is a message with a key. `defaultMessages` lists them all:

```ts
import { defaultMessages } from "@eos-ui/vue";

defaultMessages.pageN; // "Page {n}"
```

Placeholders in braces are filled by the component: `removeItem: "Remove {label}"`. Override any key, and leave the rest in English. Statuses are keys too (`status.paid`, `status.overdue`), so a stamp can say whatever your practice says.

The config is reactive. Change it and every component updates:

```ts
const eos = createEos({ locale: "en-US" });
eos.config.locale = "de-DE";
eos.config.messages = { required: "Pflichtfeld" };
```

To use `vue-i18n`, build `messages` from it and set `locale` from `useI18n().locale`. Dates and numbers then follow without any other change.

In your own components, use the same words with `useMessages()`:

```ts
import { useMessages } from "@eos-ui/vue";

const t = useMessages();
t("pageN", { n: 3 }); // "Page 3"
```

## Locale

The locale drives month and weekday names, which day the week starts on, the order of day, month and year, and number formats. Try the [playground](/playground): switch to French or Japanese and watch the calendar change.

`useLocale()` gives you the same helpers the pickers use:

```ts
const { formatDate, parseDate, formatMoney } = useLocale();
formatDate(new Date(2026, 9, 22)); // "10/22/2026" in en-US, "22/10/2026" in fr-CA
```

Typing a date with Arabic-Indic digits still parses. Dates are local days held at noon, so daylight saving never shifts a day.

## Currency

`currency` is an ISO 4217 code. Amount components format with it, in the locale's way ($162.40 in en-US, 162,40 $ in fr-CA).

## Right to left

Layout uses logical properties (`margin-inline-start`, `padding-inline`), so right-to-left text mirrors without extra CSS. Arrows and chevrons that point left or right flip. In a calendar, ArrowRight goes to the previous day.

```ts
createEos({ locale: "ar-EG", dir: "rtl" });
```

`dir` is applied to the theme target. Leave it `null` to follow the document. Set `lang` and `dir` on your `<html>` element yourself: Eos never sets `lang`.
