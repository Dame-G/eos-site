  /* ================= Portal forms: password, phone, money, address, card, signature, summaries ================= */
  var US_STATES = [["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"], ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"], ["DC", "District of Columbia"], ["FL", "Florida"], ["GA", "Georgia"], ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"], ["MD", "Maryland"], ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"], ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"], ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"], ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"], ["SC", "South Carolina"], ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"], ["WA", "Washington"], ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"]]
    .map(function (s) { return { value: s[0], label: s[1] }; });

  /** A password with a show and hide button and, optionally, a live checklist of rules: [{ label, test(value) }]. */
  function PasswordField(props) {
    var id = useUid("op-pw-", props.id), hintId = id + "-hint", rulesId = id + "-rules";
    var s1 = React.useState(false), shown = s1[0], setShown = s1[1];
    var s2 = React.useState(props.defaultValue || ""), inner = s2[0], setInner = s2[1];
    var value = props.value !== undefined ? props.value : inner;
    var rules = props.rules || [];
    var describedBy = [props.error || props.hint ? hintId : "", rules.length ? rulesId : ""].filter(Boolean).join(" ");
    var input = h("input", Object.assign({
      id: id, className: "op-input", type: shown ? "text" : "password", value: value, disabled: props.disabled, required: props.required,
      autoComplete: props.mode === "new" ? "new-password" : "current-password", autoCapitalize: "none", spellCheck: false, "aria-invalid": props.error ? "true" : undefined,
      onChange: function (e) { if (props.value === undefined) setInner(e.target.value); if (props.onChange) props.onChange(e.target.value, e); }
    }, inputAttrs(props, describedBy)));
    var control = h(React.Fragment, null,
      h("div", { className: "op-input-wrap", "data-invalid": props.error ? "" : undefined, "data-disabled": props.disabled ? "" : undefined },
        input,
        h("button", { type: "button", className: "op-combo-btn", "aria-pressed": shown ? "true" : "false", "aria-label": shown ? t("hidePassword") : t("showPassword"), disabled: props.disabled, onClick: function () { setShown(!shown); } }, h(Icon, { name: shown ? "eye-slash" : "eye" }))),
      rules.length ? h("ul", { id: rulesId, className: "op-rules", "aria-label": t("passwordRules") }, rules.map(function (r) {
        var met = !!r.test(value);
        return h("li", { key: r.label, className: "op-rule", "data-met": met ? "" : undefined },
          met ? h(Icon, { name: "check", small: true }) : h("span", { className: "op-rule-dot", "aria-hidden": "true" }),
          r.label, h("span", { className: "op-sr" }, " (" + t(met ? "ruleMet" : "ruleNotMet") + ")"));
      })) : null);
    return FieldShell(Object.assign({}, props, { label: props.label || t("password") }), control, id);
  }

  function formatPhone(raw, style) {
    var d = String(raw || "").replace(/\D/g, "");
    if (style !== "us") return String(raw || "");
    if (d.length > 10 && d.charAt(0) === "1") d = d.slice(1);
    d = d.slice(0, 10);
    if (d.length < 4) return d;
    if (d.length < 7) return "(" + d.slice(0, 3) + ") " + d.slice(3);
    return "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6);
  }
  /** A phone number. With the default `format="us"` it groups digits as you type: (555) 123-4567. */
  function PhoneField(props) {
    var style = props.format || (/^en-US/i.test(CONFIG.locale) ? "us" : "none");
    var s1 = React.useState(formatPhone(props.defaultValue, style)), inner = s1[0], setInner = s1[1];
    var value = props.value !== undefined ? formatPhone(props.value, style) : inner;
    return h(Field, Object.assign({ type: "tel", inputMode: "tel", autoComplete: "tel", label: t("phone") }, props, {
      value: value, defaultValue: undefined,
      onChange: function (v, e) { var f = formatPhone(v, style); if (props.value === undefined) setInner(f); if (props.onChange) props.onChange(f, e); }
    }));
  }

  /** An amount of money: a NumberField with the currency symbol in front, two decimals and no negatives by default. */
  function CurrencyField(props) {
    var symbol = "$";
    try { symbol = new Intl.NumberFormat(props.locale || CONFIG.locale, { style: "currency", currency: props.currency || CONFIG.currency }).formatToParts(0).filter(function (p) { return p.type === "currency"; })[0].value; } catch (e) {}
    return h(NumberField, Object.assign({ step: 0.01, min: 0, prefix: symbol }, props));
  }

  /** A postal address as one group: street, unit, city, state and ZIP, each with the right autocomplete token. */
  function AddressFields(props) {
    var s1 = React.useState(props.defaultValue || {}), inner = s1[0], setInner = s1[1];
    var value = props.value !== undefined ? props.value : inner;
    var errors = props.errors || {}, name = props.name || "address";
    function set(k) { return function (v) { var n = Object.assign({}, value); n[k] = v; if (props.value === undefined) setInner(n); if (props.onChange) props.onChange(n); }; }
    return h(Fieldset, { legend: props.legend || t("address"), disabled: props.disabled, id: name + "-fs" },
      h("div", { className: "op-address-grid" },
        h("div", { className: "op-address-wide" }, h(Field, { label: t("street"), name: name + "-street", autoComplete: "address-line1", required: true, value: value.street || "", error: errors.street, onChange: set("street") })),
        h("div", { className: "op-address-wide" }, h(Field, { label: t("unit"), name: name + "-unit", autoComplete: "address-line2", optional: true, value: value.unit || "", error: errors.unit, onChange: set("unit") })),
        h(Field, { label: t("city"), name: name + "-city", autoComplete: "address-level2", required: true, value: value.city || "", error: errors.city, onChange: set("city") }),
        h(Select, { label: t("region"), name: name + "-region", required: true, options: props.regions || US_STATES, placeholder: t("select"), value: value.region || "", error: errors.region, onChange: set("region") }),
        h(Field, { label: t("postal"), name: name + "-postal", autoComplete: "postal-code", inputMode: "numeric", required: true, value: value.postal || "", error: errors.postal, onChange: set("postal") })));
  }

  /** The frame for a payment processor's hosted card fields. Mount the processor's element inside it (children, or the element with `mountId`); it never sees card numbers itself. `state`: loading, ready or error. */
  function PaymentCardField(props) {
    var id = useUid("op-card-", props.id), state = props.error ? "error" : props.state || "ready";
    return h("div", { className: "op-field" },
      h("span", { id: id + "-label", className: "op-field-label op-kicker" }, props.label || t("cardNumber"), Flag(props)),
      h("div", { className: "op-cardfield", role: "group", "aria-labelledby": id + "-label", "aria-describedby": props.error ? id + "-hint" : id + "-note", "data-state": state },
        h("div", { id: props.mountId || id + "-mount", ref: props.mountRef, className: "op-cardfield-mount" }, state === "loading" ? h(Spinner, { label: t("cardLoading") }) : props.children)),
      props.error ? Message({ error: props.error }, id + "-hint") : null,
      h("p", { id: id + "-note", className: "op-cardfield-note" }, h(Icon, { name: "lock", small: true }), props.note || t("cardSecure")));
  }

  /** A signature drawn with a finger, stylus or mouse. onChange gets { empty, image } where image is a PNG data URL. */
  function SignaturePad(props) {
    var canvas = React.useRef(null), draw = React.useRef({ on: false, x: 0, y: 0 });
    var s1 = React.useState(true), empty = s1[0], setEmpty = s1[1];
    var height = props.height || 160, id = useUid("op-pad-", props.id);
    React.useEffect(function () {
      var cv = canvas.current; if (!cv) return;
      var dpr = window.devicePixelRatio || 1, w = cv.clientWidth || 320;
      cv.width = Math.round(w * dpr); cv.height = Math.round(height * dpr);
      var ctx = cv.getContext("2d"); ctx.scale(dpr, dpr); ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#000";
    }, [height]);
    function pt(e) { var r = canvas.current.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    function down(e) {
      if (props.disabled) return;
      e.preventDefault(); try { canvas.current.setPointerCapture(e.pointerId); } catch (err) {}
      var p = pt(e), ctx = canvas.current.getContext("2d"); draw.current = { on: true, x: p.x, y: p.y };
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.2, 0, 6.3); ctx.fill();
    }
    function move(e) {
      if (!draw.current.on) return;
      var p = pt(e), ctx = canvas.current.getContext("2d");
      ctx.beginPath(); ctx.moveTo(draw.current.x, draw.current.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      draw.current.x = p.x; draw.current.y = p.y;
    }
    function up() {
      if (!draw.current.on) return;
      draw.current.on = false; setEmpty(false);
      if (props.onChange) props.onChange({ empty: false, image: canvas.current.toDataURL("image/png") });
    }
    function clear() {
      var cv = canvas.current, ctx = cv.getContext("2d"); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.restore();
      setEmpty(true); if (props.onChange) props.onChange({ empty: true, image: "" });
    }
    return h("div", { className: "op-pad" },
      h("div", { className: "op-pad-surface", "data-empty": empty ? "" : undefined },
        h("canvas", { ref: canvas, id: id, className: "op-pad-canvas", style: { height: height }, role: "img", "aria-label": t("drawSignature"), "aria-describedby": id + "-hint", onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: up }),
        empty ? h("span", { className: "op-pad-placeholder", "aria-hidden": "true" }, h(Icon, { name: "signature" }), t("signEmpty")) : null),
      h("div", { className: "op-pad-foot" },
        h("p", { id: id + "-hint", className: "op-field-hint" }, t("signDrawHint")),
        h(Button, { variant: "quiet", icon: "eraser", disabled: empty || props.disabled, onClick: clear }, t("signClear"))));
  }

  /** Sign a form by typing your name, drawing your signature, or either (`mode`: type, draw or both). */
  function SignatureField(props) {
    var id = useUid("op-sign-", props.id), mode = props.mode || "type";
    var s0 = React.useState(mode === "draw" ? "draw" : "type"), method = s0[0], setMethod = s0[1];
    var s1 = React.useState(props.defaultName || ""), name = s1[0], setName = s1[1];
    var s2 = React.useState(false), agreed = s2[0], setAgreed = s2[1];
    var s3 = React.useState(""), image = s3[0], setImage = s3[1];
    function emit(patch) {
      var n = Object.assign({ method: method, name: name, image: image, agreed: agreed }, patch);
      if (props.onChange) props.onChange({ method: n.method, name: n.name, image: n.method === "draw" ? n.image : "", agreed: n.agreed });
    }
    var date = props.date || new Date();
    var dateText = new Intl.DateTimeFormat(CONFIG.locale, { year: "numeric", month: "long", day: "numeric" }).format(date);
    return h("fieldset", { className: "op-sign" },
      h("legend", { className: "op-kicker op-sign-legend" }, props.label || t("signature")),
      mode === "both" ? h(SegmentedControl, { label: t("signature"), value: method, options: [{ value: "type", label: t("signType"), icon: "edit" }, { value: "draw", label: t("signDraw"), icon: "signature" }], onChange: function (v) { setMethod(v); emit({ method: v }); } }) : null,
      method === "type"
        ? h(React.Fragment, null,
            h(Field, { label: t("typeName"), id: id, value: name, placeholder: t("fullName"), autoComplete: "name", required: true, hint: t("signHint"), onChange: function (v) { setName(v); emit({ name: v }); } }),
            h("div", { className: "op-sign-line", "aria-live": "polite" },
              name ? h("span", { className: "op-sign-name" }, name) : h("span", { className: "op-sign-empty" }, t("signAppears")),
              h("span", { className: "op-sign-date" }, dateText)))
        : h(React.Fragment, null,
            h(SignaturePad, { onChange: function (v) { setImage(v.image); emit({ image: v.image }); } }),
            h("p", { className: "op-sign-date op-sign-date--solo" }, dateText)),
      h(Checkbox, { label: props.agreement || t("agreeSign"), checked: agreed, onChange: function (c) { setAgreed(c); emit({ agreed: c }); } }));
  }

  /** A titled group of fields on a form, with a short description. */
  function FormSection(props) {
    var id = useUid("op-fsec-", props.id);
    return h("section", { className: "op-formsection", "aria-labelledby": id },
      h("div", { className: "op-formsection-head" },
        h("h" + (props.headingLevel || 2), { id: id, className: "op-formsection-title" }, props.title),
        props.description ? h("p", { className: "op-formsection-desc" }, props.description) : null),
      h(Stack, { gap: props.gap == null ? 4 : props.gap }, props.children));
  }

  /** The list of what went wrong at the top of a form, each linking to its field. It takes focus when errors appear. errors: [{ id, message }] where id is the field's id. */
  function ErrorSummary(props) {
    var ref = React.useRef(null), errors = props.errors || [];
    React.useEffect(function () { if (errors.length && props.autoFocus !== false && ref.current) { ref.current.focus(); if (ref.current.scrollIntoView) ref.current.scrollIntoView({ block: "nearest" }); } }, [errors.length]);
    if (!errors.length) return null;
    return h("div", { ref: ref, className: "op-errsum", role: "alert", tabIndex: -1, "aria-labelledby": "op-errsum-title" },
      h(Notice, { tone: "danger", role: false, headingLevel: props.headingLevel || 2, titleId: "op-errsum-title", title: props.title || t("errorSummary") },
        h("ul", { className: "op-errsum-list" }, errors.map(function (er) {
          return h("li", { key: er.id || er.message }, er.field ? [h("strong", { key: "f" }, er.field), ": "] : null, er.message);
        }))));
  }
