import { h, type FunctionalComponent } from "vue";

// Small solid marks for the links to where the project lives. They take the colour of the text beside them.
const solid = (...children: ReturnType<typeof h>[]): FunctionalComponent => (props) =>
  h("svg", { ...props, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", focusable: "false" }, children);

export const GithubIcon = solid(
  h("path", {
    d: "M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.4-.5-1.6.2-3.2 0 0 1-.3 3.3 1.2a11.500 11.500 0 0 1 6 0C17.300 4.700 18.300 5 18.300 5c.7 1.600.2 2.800.1 3.200.8.8 1.300 1.900 1.300 3.200 0 4.600-2.800 5.600-5.500 5.900.4.400.8 1.100.8 2.200v3.300c0 .3.2.7.8.6A12 12 0 0 0 12 .3",
  }),
);

// The npmx mark: its slash, with the small square the slash stands beside.
export const NpmxIcon = solid(h("rect", { x: 3.5, y: 14.4, width: 3, height: 3 }), h("path", { d: "M11.2 19 17.1 4.2h2.6L13.8 19z" }));
