One upcoming visit. Props: `date` (a Date), `time`, `title` (the kind of visit), `subtitle` (a line under the title when there is no practitioner), `provider` (`{ name, role, photo }`), `location`, `status` (or `tone` and `label`), `actions`, `headingLevel`.

- The practitioner leads: a 56px photo (initials if none), their name with the status at the end of the line, then their role with the visit type at the end of the same line in ink, then a ruled list with date, time and place. Everything lines up under the name. In a Grid, cards in a row take the tallest height, so a name that wraps never leaves a short card: the actions bar stays at the foot of every card.
- With no practitioner, the date tile takes the photo's place and the title takes the name's line. The status is top-right on every card, and the second line is always reserved, so all cards are the same height.
- Actions sit on a tinted footer bar, omitted when there are none.
- Use it on the home page and the appointments list; choosing a new time is Calendar and TimeSlots.
