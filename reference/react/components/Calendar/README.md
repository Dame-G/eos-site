The month grid behind the date pickers, usable alone. Props: `value` and `onChange(date)`, or `mode="range"` with `start`, `end`, `onRangeChange({start, end})`; `min`, `max`, `month` (the month to open on), `footer` (false hides Today and Clear), `onClear`.

**Scheduling:** `disabledDate(date)` fades days with nothing to book (they cannot be focused or chosen); `marked` (dates or a function) puts a dot under days with open times, and screen readers hear `markLabel` (default "times available"). Pair it with TimeSlots.

**Views:** one button in the header shows the month and year ("October 2026"). It opens the years; choosing a year opens that year's months; choosing a month opens its days, so a date of birth is year, month, day and the month is never set before the year. Each step has a Back button and a plain title ("Choose a year", "Choose a month in 2026"); Back goes up one step and Escape returns to the days.

**Keyboard:** arrows move by day and week, Home and End to the week's edges, Page Up and Page Down by month (Shift for year), Enter or Space chooses.

**Marks:** today has a black ring, the chosen day is filled `primary` and bold, days inside a range are tinted, open days carry a dot, unavailable days are faded and disabled. Days are 44px square.

**Range mode** adds a line under the grid: what to do next, then the range and its length ("Oct 4 to Oct 18 (15 days)"), announced politely.

**Locale:** names, week start and date order follow `configure({ locale })`.
