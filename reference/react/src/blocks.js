  /* ================= Building blocks =================
     The layer between the primitives (Icon, Button, Chip...) and the domain components (StatementCard...):
     the flat card, the layout helpers, the action group and the label-and-text list that every card is made of. */
  function gapVar(g) { return g == null ? undefined : (typeof g === "number" ? "var(--space-" + g + ")" : g); }
  function boxProps(props, cls, style) {
    var st = Object.assign({}, props.style, style || {});
    var o = { className: cx(cls, props.className), style: Object.keys(st).length ? st : undefined, id: props.id, role: props.role, tabIndex: props.tabIndex, onClick: props.onClick };
    Object.keys(props).forEach(function (k) { if (/^(aria-|data-)/.test(k)) o[k] = props[k]; });
    return o;
  }

  /** The flat, outlined card every content block sits on. `tone`: default, tint or float (the lifted look of a Toast). `pad`: sm, md or lg. `clip` hides what overflows its rounded corners. `actions` puts a group of Buttons on a bar at the foot of the card, edge to edge, and the body takes the remaining height so cards in a row end level. */
  function Surface(props) {
    var tone = props.tone && props.tone !== "default" ? "op-surface--" + props.tone : null, pad = props.pad && "op-surface--pad-" + props.pad;
    if (props.actions) return h(props.as || "div", boxProps(props, cx("op-surface op-surface--actions", tone)),
      h("div", { className: cx("op-surface-body", pad) }, React.Children.toArray(props.children)),
      h(Actions, { as: /^(article|section|aside)$/.test(props.as || "") ? "footer" : "div", bar: true }, props.actions));
    return h(props.as || "div", boxProps(props, cx("op-surface", tone, pad, props.clip && "op-surface--clip")), React.Children.toArray(props.children));
  }

  /** Children one under another with an even gap (a space token number, default 4). */
  function Stack(props) {
    return h(props.as || "div", boxProps(props, cx("op-stack", props.align && "op-stack--" + props.align), { "--gap": gapVar(props.gap == null ? 4 : props.gap) }), React.Children.toArray(props.children));
  }

  /** Children in a row that wraps. `justify`: start, between or end. `align`: center (default), start, baseline. */
  function Inline(props) {
    return h(props.as || "div", boxProps(props, cx("op-inline", props.nowrap && "op-inline--nowrap", props.justify && "op-inline--" + props.justify, props.align && "op-inline--a-" + props.align), { "--gap": gapVar(props.gap == null ? 2 : props.gap) }), React.Children.toArray(props.children));
  }

  /** Cards in as many columns as fit, each at least `min` wide (default 16rem). */
  function Grid(props) {
    return h(props.as || "div", boxProps(props, "op-grid-layout", { "--gap": gapVar(props.gap == null ? 4 : props.gap), "--min": props.min || "16rem" }), React.Children.toArray(props.children));
  }

  /** A group of Buttons. The main action comes first; the group is left-aligned and wraps. `bar` puts it on a tinted footer bar. */
  function Actions(props) {
    return h(props.as || "div", boxProps(props, cx("op-actions", props.bar && "op-actions--bar")), React.Children.toArray(props.children));
  }

  /** Short facts with an icon each: [{ icon, text }]. */
  function MetaList(props) {
    return h("ul", boxProps(props, "op-meta"), (props.items || []).filter(Boolean).map(function (it, i) {
      return h("li", { key: i }, it.icon ? h(Icon, { name: it.icon }) : null, h("span", null, it.text != null ? it.text : it.children));
    }));
  }

  /** Label and text rows: [{ label, text }]. Rendered as a description list. */
  function DescriptionList(props) {
    return h("dl", boxProps(props, "op-facts"), (props.items || []).map(function (p) {
      return h("div", { key: p.label, className: "op-fact" }, h("dt", { className: "op-kicker" }, p.label), h("dd", { className: "op-fact-text" }, p.text));
    }));
  }

  /** The small uppercase label used above values and sections. */
  function Kicker(props) { return h(props.as || "p", boxProps(props, "op-kicker"), React.Children.toArray(props.children)); }

  /** Text for screen readers only. */
  function VisuallyHidden(props) { return h(props.as || "span", boxProps(props, "op-sr"), React.Children.toArray(props.children)); }

  /** A date with its weekday, spelled out in the configured locale. */
  function longDate(d) {
    try { return new Intl.DateTimeFormat(CONFIG.locale, { weekday: "long", month: "long", day: "numeric" }).format(d); }
    catch (e) { return DAYS[d.getDay()] + ", " + MONTHS[d.getMonth()] + " " + d.getDate(); }
  }
