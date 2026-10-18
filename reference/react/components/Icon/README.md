Phosphor (MIT) icons by name. Props: `name`, `small` (14px, bold weight, for chips and stamps) and `bold`. `Icon.names` lists every name, for a picker or a gallery.

- Regular weight at 20px; bold at 14px so strokes keep their presence when small.
- Icons take `currentColor`. Colour one with a status colour only beside that status's word.
- Components ask for icons by name, so changing the set changes the bundle's icon table and nothing else.
- The set is the interface icons the system uses (money, forms, calendar, people, arrows, status, files, the page). Add one by adding its Phosphor path to the table and its name to `IconName` in `index.d.ts`.
