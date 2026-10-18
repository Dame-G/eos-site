Booking a visit: choose a day, then a time, then confirm. Days with nothing open are faded and cannot be chosen; days with open times carry a dot. Choosing a day shows only that day's times.

- **Built from:** PageHeader, Grid, Surface, Calendar (`marked`, `disabledDate`), TimeSlots, Notice, Actions.
- The page says who the visit is with and where, before asking when.
- Confirm stays disabled until a time is chosen, and the Notice repeats the date, time and place so the person can check before confirming.
- If the chosen day has no times, say so in words (`emptyText`) instead of showing an empty grid.
