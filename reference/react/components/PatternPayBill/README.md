Paying a balance, top to bottom: where you are, what you owe, how much, how, then the one decision. Each choice only reveals the next thing it needs: "Another amount" shows the amount field; "A new card" shows the card frame.

- **Built from:** Surface, Stack, BackLink, Heading, AmountFigure, RadioGroup, CurrencyField, Select, PaymentCardField, Notice, Actions.
- The Pay button names the exact amount and carries a lock; it is the only filled Button on the page.
- Card details are entered in the payment processor's hosted fields, inside PaymentCardField. They never reach your page or server.
- After paying, show a Toast ("Payment received") and a receipt link, then take the person back to their statements.
