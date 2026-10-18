# Tests

49 interaction and contract tests that run in a browser against the bundle: `tests/index.html` loads React, the tokens, the stylesheet, `bundle.js` and `suite.js`, runs every test and lists PASS and FAIL. No framework is needed.

Each test mounts a component, drives it with real DOM events (typing, clicking, keyboard) and checks the DOM. The layout tests set a container width and measure, which only a real browser can do. Run them whenever the bundle changes; the last run passed 49 of 49.

The Handing this to Vue page shows how a test ports to Vitest and Testing Library.
