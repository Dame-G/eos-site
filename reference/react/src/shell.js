  /* ================= The page: shell, header, banner, toasts, small actions ================= */

  /** The first link on every page: jumps keyboard users past the navigation. */
  function SkipLink(props) {
    return h("a", { className: "op-skip", href: props.href || "#main" }, props.children || t("skipToMain"));
  }

  /** The bar at the top of the page: logo, navigation and the person's menu. Pass the nav as children. */
  function AppHeader(props) {
    return h("header", { className: cx("op-appheader", props.sticky && "op-appheader--sticky") },
      h("div", { className: "op-appheader-bar op-shell-inner" },
        h("div", { className: "op-appheader-logo" }, props.logo),
        props.actions ? h("div", { className: "op-appheader-actions" }, props.actions) : null),
      props.children ? h("div", { className: "op-appheader-nav" }, h("div", { className: "op-shell-inner" }, props.children)) : null);
  }

  /** The bottom of the page. */
  function AppFooter(props) { return h("footer", { className: "op-appfooter" }, h("div", { className: "op-shell-inner" }, props.children)); }

  /** The page frame: skip link, header, an optional side navigation, the main content and a footer. The side navigation sits above the content on a phone. */
  function AppShell(props) {
    return h("div", { className: cx("op-shell", props.sidebar && "op-shell--side") },
      h(SkipLink, { href: "#" + (props.mainId || "main") }),
      props.header || null,
      h("div", { className: "op-shell-body" },
        props.sidebar ? h("aside", { className: "op-shell-side", "aria-label": props.sidebarLabel || t("mainNav") }, props.sidebar) : null,
        h("main", { id: props.mainId || "main", className: "op-shell-main", tabIndex: -1 }, props.children)),
      props.footer || null);
  }

  /** The top of a page's content: breadcrumb, the page title (h1), a short description, a status and the main actions. */
  function PageHeader(props) {
    return h("div", { className: "op-pagehead" },
      props.breadcrumb || null,
      h("div", { className: "op-pagehead-row" },
        h("div", { className: "op-pagehead-text" },
          h("div", { className: "op-pagehead-titlerow" },
            h("h" + (props.headingLevel || 1), { className: "op-pagehead-title" }, props.title),
            props.status || null),
          props.description ? h("p", { className: "op-pagehead-desc" }, props.description) : null),
        props.actions ? h(Actions, { className: "op-pagehead-actions" }, props.actions) : null));
  }

  /** A link back to the page before: arrow, then text. */
  function BackLink(props) {
    return h("a", { className: "op-backlink", href: props.href || "#", onClick: props.onClick }, h(Icon, { name: "arrow-left" }), props.children || t("back"));
  }

  /** Related Buttons side by side as one labelled group. */
  function ButtonGroup(props) { return h("div", { className: "op-btngroup", role: "group", "aria-label": props.label }, props.children); }

  /** A button that stays pressed: a filter, a view option. onChange receives the new state. */
  function ToggleButton(props) {
    var s = React.useState(!!props.defaultPressed), inner = s[0], setInner = s[1];
    var pressed = props.pressed !== undefined ? props.pressed : inner;
    return h("button", { type: "button", className: cx("op-btn op-btn--outline op-toggle"), "aria-pressed": pressed ? "true" : "false", disabled: props.disabled,
      onClick: function () { if (props.pressed === undefined) setInner(!pressed); if (props.onChange) props.onChange(!pressed); } }, props.icon ? h(Icon, { name: props.icon }) : null, props.children);
  }

  /* ---- Toasts: a provider, a hook and the region that shows them ---- */
  var ToastCtx = React.createContext(null);
  /** Wrap the app in it, then call useToast().show({ title, children, tone, action, duration }). Toasts with an action or an error stay until dismissed; others go after 5 seconds, and wait while the pointer or focus is on them. */
  function ToastProvider(props) {
    var s = React.useState([]), items = s[0], setItems = s[1];
    var timers = React.useRef({}), counter = React.useRef(0);
    var api = React.useMemo(function () {
      function dismiss(id) { clearTimeout(timers.current[id]); delete timers.current[id]; setItems(function (prev) { return prev.filter(function (x) { return x.id !== id; }); }); }
      function arm(item) { if (item.duration) timers.current[item.id] = setTimeout(function () { dismiss(item.id); }, item.duration); }
      function show(opts) {
        var id = "t" + (++counter.current), tone = opts.tone || "info";
        var duration = opts.duration !== undefined ? opts.duration : (opts.action || tone === "danger" ? 0 : 5000);
        var item = Object.assign({}, opts, { id: id, tone: tone, duration: duration });
        setItems(function (prev) { return prev.concat(item); });
        arm(item);
        return id;
      }
      function pause() { Object.keys(timers.current).forEach(function (k) { clearTimeout(timers.current[k]); }); timers.current = {}; }
      function resume(list) { list.forEach(arm); }
      return { show: show, dismiss: dismiss, clear: function () { pause(); setItems([]); }, _pause: pause, _resume: resume };
    }, []);
    return h(ToastCtx.Provider, { value: api },
      props.children,
      h("div", { className: "op-toast-region", role: "region", "aria-label": t("toastRegion"), onMouseEnter: api._pause, onMouseLeave: function () { api._resume(items); }, onFocus: api._pause, onBlur: function () { api._resume(items); } },
        items.map(function (it) {
          return h(Toast, { key: it.id, tone: it.tone, title: it.title, action: it.action, onClose: function () { api.dismiss(it.id); } }, it.children);
        })));
  }
  function useToast() {
    var api = React.useContext(ToastCtx);
    if (!api) throw new Error("useToast must be used inside a ToastProvider");
    return api;
  }
