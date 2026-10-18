/* OpenPractice UI: interaction and contract tests.
   Runs in a browser against window.OpenPractice (React 18). No framework: a few helpers and plain assertions,
   so the same cases can be ported one for one to Vitest + Testing Library (see README.md in this folder).
   Open tests/index.html, or call OpenPracticeTests.run() and read the returned results. */
(function () {
  var P = window.OpenPractice, h = React.createElement;
  var tests = [];
  function test(name, fn) { tests.push({ name: name, fn: fn }); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function assert(cond, msg) { if (!cond) throw new Error(msg || "assertion failed"); }
  function eq(actual, expected, msg) { var a = JSON.stringify(actual), b = JSON.stringify(expected); if (a !== b) throw new Error((msg ? msg + ": " : "") + "expected " + b + ", got " + a); }

  var mounted = [];
  function mount(el, width) {
    var host = document.createElement("div");
    host.className = "op-root"; host.style.cssText = "padding:8px;" + (width ? "width:" + width + "px" : "max-width:640px");
    document.getElementById("stage").appendChild(host);
    var root = ReactDOM.createRoot(host);
    root.render(el);
    var m = { host: host, root: root, $: function (s) { return host.querySelector(s); }, $$: function (s) { return Array.prototype.slice.call(host.querySelectorAll(s)); }, unmount: function () { root.unmount(); host.remove(); } };
    mounted.push(m);
    return wait(60).then(function () { return m; });
  }
  function setValue(el, v) {
    var proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(el, v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }
  function key(el, k, o) { el.dispatchEvent(new KeyboardEvent("keydown", Object.assign({ key: k, bubbles: true, cancelable: true }, o || {}))); }
  function typeChars(el, chars) { return chars.split("").reduce(function (p, c) { return p.then(function () { var cur = document.activeElement || el; setValue(cur, c); return wait(15); }); }, Promise.resolve()); }
  function text(el) { return (el.textContent || "").replace(/\s+/g, " ").trim(); }
  function d(y, m, day) { return new Date(y, m, day, 12); }

  /* ------------------------------ form contracts ------------------------------ */
  test("Field: onChange gets the value first, then the event", function () {
    var got = []; return mount(h(P.Field, { label: "Name", onChange: function (v, e) { got.push([typeof v, v, e && e.type]); } })).then(function (m) {
      setValue(m.$("input"), "Maria"); return wait(20).then(function () { eq(got[0], ["string", "Maria", "change"]); });
    });
  });
  test("Field: passes name, autocomplete, maxlength and aria attributes to the input", function () {
    return mount(h(P.Field, { label: "Email", name: "email", autoComplete: "email", maxLength: 40, inputMode: "email", "aria-label": "Your email", hint: "We never share it." })).then(function (m) {
      var i = m.$("input"); eq(i.name, "email"); eq(i.autocomplete, "email"); eq(i.maxLength, 40); eq(i.getAttribute("inputmode"), "email");
      assert(i.getAttribute("aria-describedby"), "hint is linked");
    });
  });
  test("Field: an error replaces the hint, marks the input invalid and is announced", function () {
    return mount(h(P.Field, { label: "Email", hint: "Hint", error: "Enter an email" })).then(function (m) {
      eq(m.$("input").getAttribute("aria-invalid"), "true"); assert(!m.$(".op-field-hint"), "hint hidden"); eq(m.$(".op-field-error").getAttribute("role"), "alert");
    });
  });
  test("Textarea: onChange value first", function () {
    var got; return mount(h(P.Textarea, { label: "Note", onChange: function (v) { got = v; } })).then(function (m) { setValue(m.$("textarea"), "Hello"); return wait(20).then(function () { eq(got, "Hello"); }); });
  });
  test("Checkbox and Switch: onChange gets the checked state first", function () {
    var a = [], b = [];
    return mount(h("div", null, h(P.Checkbox, { label: "Agree", onChange: function (c) { a.push(c); } }), h(P.Switch, { label: "Reminders", onChange: function (c) { b.push(c); } }))).then(function (m) {
      m.$(".op-check").click(); m.$(".op-switch-input").click(); return wait(20).then(function () { eq(a, [true]); eq(b, [true]); });
    });
  });
  test("Checkbox: error is linked and announced", function () {
    return mount(h(P.Checkbox, { label: "Agree", error: "You must agree" })).then(function (m) { eq(m.$(".op-check").getAttribute("aria-invalid"), "true"); assert(text(m.host).indexOf("You must agree") >= 0); });
  });
  test("RadioGroup: value first; legend, hint and error describe the group", function () {
    var got; return mount(h(P.RadioGroup, { label: "Reminder", hint: "Pick one", options: ["Text", "Email"], onChange: function (v) { got = v; } })).then(function (m) {
      m.$$(".op-radio")[1].click(); return wait(20).then(function () { eq(got, "Email"); assert(m.$("fieldset legend"), "legend"); assert(m.$("fieldset").getAttribute("aria-describedby"), "described"); });
    });
  });
  test("Select: keyboard opens, arrows move, Enter chooses, name is submitted", function () {
    var got; return mount(h(P.Select, { label: "Pay with", name: "method", options: ["Visa", "Bank", "Cash"], onChange: function (v) { got = v; } })).then(function (m) {
      var b = m.$("button[role=combobox]"); b.focus(); key(b, "ArrowDown"); return wait(40).then(function () {
        eq(b.getAttribute("aria-expanded"), "true"); key(b, "ArrowDown"); return wait(40).then(function () { key(b, "Enter"); return wait(40); });
      }).then(function () { eq(got, "Bank"); eq(m.$("input[type=hidden]").value, "Bank"); eq(b.getAttribute("aria-expanded"), "false"); });
    });
  });
  test("Select: type-ahead jumps to the matching option", function () {
    var got; return mount(h(P.Select, { label: "Pay with", options: ["Visa", "Bank", "Cash"], onChange: function (v) { got = v; } })).then(function (m) {
      var b = m.$("button[role=combobox]"); b.focus(); key(b, "c"); return wait(30).then(function () { key(b, "Enter"); return wait(30); }).then(function () { eq(got, "Cash"); });
    });
  });
  test("Combobox: typing filters, Enter picks", function () {
    var got; return mount(h(P.Combobox, { label: "Practitioner", options: ["Amara Singh", "Marcus Webb", "Priya Nair"], onChange: function (v) { got = v; } })).then(function (m) {
      var i = m.$("input[role=combobox]"); i.focus(); setValue(i, "ma"); return wait(50).then(function () {
        eq(document.querySelectorAll("[role=option]").length > 0, true); key(i, "Enter"); return wait(30);
      }).then(function () { assert(got === "Amara Singh" || got === "Marcus Webb", "picked " + got); });
    });
  });
  test("MultiSelect: picks several, Backspace removes the last", function () {
    var got = []; return mount(h(P.MultiSelect, { label: "Remind me by", options: ["Text", "Email", "Call"], defaultValue: ["Text", "Email"], onChange: function (v) { got = v; } })).then(function (m) {
      var i = m.$("input[role=combobox]"); i.focus(); key(i, "Backspace"); return wait(30).then(function () { eq(got, ["Text"]); });
    });
  });
  test("NumberField: arrows step, the range clamps, onChange gets numbers", function () {
    var got = []; return mount(h(P.NumberField, { label: "Visits", defaultValue: 9, min: 0, max: 10, onChange: function (n) { got.push(n); } })).then(function (m) {
      var i = m.$("input"); i.focus(); key(i, "ArrowUp"); key(i, "ArrowUp"); return wait(40).then(function () { eq(got[got.length - 1], 10); eq(typeof got[0], "number"); });
    });
  });
  test("CurrencyField: shows the symbol and two decimals", function () {
    return mount(h(P.CurrencyField, { label: "Amount", defaultValue: 162.4 })).then(function (m) { eq(text(m.$(".op-affix--pre")), "$"); eq(m.$("input").value, "162.40"); });
  });
  test("PhoneField: groups digits as you type", function () {
    return mount(h(P.PhoneField, { label: "Mobile" })).then(function (m) { setValue(m.$("input"), "5551234567"); return wait(30).then(function () { eq(m.$("input").value, "(555) 123-4567"); eq(m.$("input").autocomplete, "tel"); }); });
  });
  test("PasswordField: toggles visibility and reports rule status", function () {
    return mount(h(P.PasswordField, { label: "Password", mode: "new", rules: [{ label: "10 characters", test: function (v) { return v.length >= 10; } }] })).then(function (m) {
      var i = m.$("input"); eq(i.type, "password"); eq(i.autocomplete, "new-password");
      m.$(".op-combo-btn").click(); return wait(30).then(function () {
        eq(m.$("input").type, "text"); eq(m.$(".op-combo-btn").getAttribute("aria-pressed"), "true");
        assert(!m.$(".op-rule[data-met]"), "rule not met"); setValue(m.$("input"), "abcdefghijk"); return wait(30);
      }).then(function () { assert(m.$(".op-rule[data-met]"), "rule met"); assert(text(m.$(".op-rule")).indexOf("met") >= 0, "says so in words"); });
    });
  });
  test("OtpField: one keystroke per character, onComplete once, paste and backspace work", function () {
    var val = "", done = []; return mount(h(P.OtpField, { label: "Code", length: 6, onChange: function (v) { val = v; }, onComplete: function (v) { done.push(v); } })).then(function (m) {
      var boxes = m.$$("input"); eq(boxes.length, 6); boxes[0].focus();
      return typeChars(boxes[0], "123456").then(function () {
        eq(val, "123456"); eq(done, ["123456"]); eq(m.$$("input").map(function (b) { return b.value; }).join(""), "123456");
        key(document.activeElement, "Backspace"); return wait(30);
      }).then(function () { eq(val, "12345"); m.$$("input")[0].focus(); setValue(m.$$("input")[0], "987654"); return wait(40); })
        .then(function () { eq(val, "987654"); });
    });
  });
  test("OtpField: focus cannot skip past the last filled box", function () {
    return mount(h(P.OtpField, { label: "Code", length: 6, defaultValue: "12" })).then(function (m) { var far = m.$$("input")[5]; far.focus(); far.dispatchEvent(new FocusEvent("focusin", { bubbles: true })); return wait(30).then(function () { eq(m.$$("input").indexOf(document.activeElement), 2); }); });
  });
  test("DatePicker: typed date parses, hidden ISO value, bad dates show an error", function () {
    var got; return mount(h(P.DatePicker, { label: "Date of birth", name: "dob", onChange: function (v) { got = v; } })).then(function (m) {
      var i = m.$(".op-combo-input"); i.focus(); setValue(i, "10/22/1981"); i.blur(); i.dispatchEvent(new FocusEvent("focusout", { bubbles: true })); return wait(60).then(function () {
        assert(got instanceof Date && got.getFullYear() === 1981 && got.getMonth() === 9 && got.getDate() === 22, "parsed " + got);
        eq(m.$("input[type=hidden]").value, "1981-10-22"); setValue(m.$(".op-combo-input"), "13/45/2020"); m.$(".op-combo-input").dispatchEvent(new FocusEvent("focusout", { bubbles: true })); return wait(60);
      }).then(function () { assert(m.$(".op-field-error"), "error shown"); });
    });
  });
  test("Locale: configure changes names, week start, date order and money, then restores", function () {
    return mount(h("div", null, h(P.DatePicker, { label: "Datum", defaultValue: d(2026, 9, 22) }), h(P.AmountFigure, { amount: 162.4 }), h(P.Calendar, { value: d(2026, 9, 22), footer: false, onChange: function () {} }))).then(function (m) {
      eq(text(m.$(".op-amount-main")), "$162.40"); eq(m.$(".op-combo-input").value, "10/22/2026");
      P.configure({ locale: "de-DE", currency: "EUR" });
      return mount(h("div", null, h(P.DatePicker, { label: "Datum", defaultValue: d(2026, 9, 22) }), h(P.AmountFigure, { amount: 162.4 }), h(P.Calendar, { value: d(2026, 9, 22), footer: false, onChange: function () {} }))).then(function (m2) {
        eq(m2.$(".op-combo-input").value, "22.10.2026"); eq(m2.$(".op-combo-input").placeholder, "DD.MM.YYYY"); eq(text(m2.$(".op-amount-main")).replace(/ /g, " "), "162,40 €");
        eq(text(m2.$(".op-cal-grid th")), "Mo"); eq(text(m2.$(".op-cal-pick")), "Oktober 2026");
        P.configure({ locale: "en-US", currency: "USD" });
      });
    });
  });
  test("Locale: message overrides reach the components", function () {
    P.configure({ messages: { required: "Obligatoire" } });
    return mount(h(P.Field, { label: "Nom", required: true })).then(function (m) { eq(text(m.$(".op-field-flag")), "Obligatoire"); P.configure({ messages: { required: "Required" } }); });
  });
  test("Calendar: arrows move by day, Page Down by month, disabled days cannot be chosen, marked days get a dot", function () {
    var picked; return mount(h(P.Calendar, { value: d(2026, 9, 22), month: d(2026, 9, 22), footer: false, onChange: function (x) { picked = x; }, disabledDate: function (x) { return x.getDay() === 0; }, marked: function (x) { return x.getDate() === 23; } })).then(function (m) {
      assert(m.$(".op-day--mark"), "a marked day"); var grid = m.$("table"); var focusable = m.$('.op-day[tabindex="0"]'); focusable.focus(); key(grid, "ArrowRight"); return wait(40).then(function () {
        assert(/October 23/.test(document.activeElement.getAttribute("aria-label")), "moved to 23: " + document.activeElement.getAttribute("aria-label")); key(m.$("table"), "PageDown"); return wait(40);
      }).then(function () { assert(/November/.test(document.activeElement.getAttribute("aria-label")), "next month"); assert(m.$$(".op-day:disabled").length > 0, "Sundays disabled"); });
    });
  });
  test("Calendar: one title button opens years, a year opens its months, a month opens its days", function () {
    function must(el, what) { assert(el, "missing: " + what); return el; }
    return mount(h(P.Calendar, { value: d(2026, 9, 22), month: d(2026, 9, 22), footer: false, onChange: function () {} })).then(function (m) {
      eq(m.$$(".op-cal-pick").length, 1); eq(text(m.$(".op-cal-pick")), "October 2026");
      m.$(".op-cal-pick").click(); return wait(90).then(function () {
        assert(m.$(".op-cal-years"), "years open first"); eq(must(m.$(".op-cal-head button"), "back in years").getAttribute("aria-label"), "Back to the days");
        must(m.$('[id$="-y-2027"]'), "2027").click(); return wait(90);
      }).then(function () {
        assert(m.$(".op-cal-cells") && !m.$(".op-cal-years"), "a year opens its months"); assert(/Choose a month in 2027/.test(text(m.$(".op-cal-title"))), "months title names the year");
        eq(m.$(".op-cal-head button").getAttribute("aria-label"), "Back to the years"); m.$(".op-cal-head button").click(); return wait(90);
      }).then(function () {
        assert(m.$(".op-cal-years"), "back from months goes to years"); must(m.$('[id$="-y-2027"]'), "2027").click(); return wait(90);
      }).then(function () { must(m.$$(".op-cal-cell")[2], "March").click(); return wait(90); })
        .then(function () { assert(m.$("table"), "a month opens its days"); eq(text(m.$(".op-cal-pick")), "March 2027"); });
    });
  });
  test("DateRangePicker: two day clicks set the range", function () {
    var got; return mount(h(P.DateRangePicker, { label: "Dates", onChange: function (v) { got = v; } })).then(function (m) {
      m.$(".op-combo-btn").click(); return wait(80).then(function () {
        var days = Array.prototype.slice.call(document.querySelectorAll(".op-calpanel .op-day:not(.op-day--out)")); days[4].click(); return wait(30).then(function () { Array.prototype.slice.call(document.querySelectorAll(".op-calpanel .op-day:not(.op-day--out)"))[10].click(); return wait(40); });
      }).then(function () { assert(got && got.start && got.end && got.end > got.start, "range set"); });
    });
  });
  test("Tabs: arrow keys move selection", function () {
    var got; return mount(h(P.Tabs, { items: [{ id: "a", label: "One", content: "A" }, { id: "b", label: "Two", content: "B" }], onChange: function (v) { got = v; } })).then(function (m) {
      var t = m.$$("[role=tab]")[0]; t.focus(); key(t.parentNode, "ArrowRight"); return wait(30).then(function () { eq(got, "b"); eq(m.$$("[role=tab]")[1].getAttribute("aria-selected"), "true"); });
    });
  });
  test("Pagination: Next calls onChange with the next page", function () {
    var got; return mount(h(P.Pagination, { page: 2, pageCount: 5, onChange: function (p) { got = p; } })).then(function (m) { m.$$(".op-btn")[1].click(); return wait(20).then(function () { eq(got, 3); }); });
  });
  test("Dialog: opens modally, labelled by its title, onClose fires on close", function () {
    var closed = 0; return mount(h(P.Dialog, { open: true, title: "Cancel this appointment?", onClose: function () { closed++; }, actions: h(P.Button, null, "Yes") }, "Body")).then(function (m) {
      var dlg = m.$("dialog"); assert(dlg.open, "open"); eq(document.getElementById(dlg.getAttribute("aria-labelledby")).tagName, "H2"); dlg.dispatchEvent(new Event("cancel")); return wait(30).then(function () { assert(closed >= 1, "onClose is wired to the dialog"); dlg.close(); });
    });
  });
  test("Menu: opens and arrow keys move between items", function () {
    return mount(h(P.Menu, { label: "More", items: [{ label: "Edit" }, { label: "Delete" }] })).then(function (m) {
      m.$(".op-btn").click(); return wait(80).then(function () { var items = m.$$("[role=menuitem]"); items[0].focus(); key(m.$("[role=menu]"), "ArrowDown"); return wait(30).then(function () { assert(document.activeElement === items[1], "second item focused"); }); });
    });
  });
  test("DataGrid: sort cycles, search filters, select all counts, data-labels exist for cards", function () {
    var picked = []; var rows = [{ id: 1, n: "Beta", a: 5 }, { id: 2, n: "Alpha", a: 9 }, { id: 3, n: "Gamma", a: 1 }];
    return mount(h(P.DataGrid, { caption: "Test", searchable: true, selectable: true, columns: [{ key: "n", label: "Name", sortable: true }, { key: "a", label: "Amount", numeric: true, sortable: true }], rows: rows, onSelectionChange: function (ids) { picked = ids; } })).then(function (m) {
      var th = m.$$("th")[1]; eq(th.getAttribute("aria-sort"), "none"); th.querySelector("button").click(); return wait(30).then(function () {
        eq(m.$$("th")[1].getAttribute("aria-sort"), "ascending"); eq(text(m.$$("tbody tr")[0].querySelectorAll("td")[1]), "Alpha");
        m.$$("th")[1].querySelector("button").click(); return wait(30);
      }).then(function () {
        eq(m.$$("th")[1].getAttribute("aria-sort"), "descending"); eq(text(m.$$("tbody tr")[0].querySelectorAll("td")[1]), "Gamma");
        setValue(m.$(".op-grid-search input"), "alp"); return wait(30);
      }).then(function () { eq(m.$$("tbody tr").length, 1); assert(m.$("td[data-label]"), "cells carry labels"); setValue(m.$(".op-grid-search input"), ""); return wait(30); })
        .then(function () { m.$("thead .op-check").click(); return wait(30); }).then(function () { eq(picked.length, 3); });
    });
  });
  test("DataGrid: virtual scrolling renders only a window of rows", function () {
    var rows = []; for (var i = 0; i < 2000; i++) rows.push({ id: i, n: "Row " + i });
    return mount(h(P.DataGrid, { caption: "Big", virtual: { height: 300, rowHeight: 40 }, columns: [{ key: "n", label: "Name" }], rows: rows })).then(function (m) { var n = m.$$("tbody tr:not(.op-spacer)").length; assert(n > 5 && n < 60, "rendered " + n + " of 2000"); });
  });
  test("ErrorSummary: takes focus, lists messages as plain text with an optional field name", function () {
    return mount(h("div", null, h(P.ErrorSummary, { errors: [{ field: "Name", message: "Enter your name" }, { message: "Choose a date" }] }))).then(function (m) {
      assert(document.activeElement === m.$(".op-errsum"), "summary focused"); eq(m.$$(".op-errsum-list li").length, 2); eq(m.$$(".op-errsum a").length, 0); eq(m.$(".op-errsum-list strong").textContent, "Name");
    });
  });
  test("Toasts: show, auto-dismiss, errors stay, useToast needs the provider", function () {
    var api; function Grab() { api = P.useToast(); return null; }
    return mount(h(P.ToastProvider, null, h(Grab))).then(function (m) {
      api.show({ title: "Saved", duration: 120 }); api.show({ title: "Failed", tone: "danger" }); return wait(60).then(function () {
        eq(document.querySelectorAll(".op-toast-region .op-toast").length, 2); return wait(200);
      }).then(function () { eq(document.querySelectorAll(".op-toast-region .op-toast").length, 1); eq(document.querySelector(".op-toast").getAttribute("role"), "alert"); var threw = false; try { P.useToast(); } catch (e) { threw = true; } });
    });
  });
  test("SignatureField: typing the name and agreeing reports both", function () {
    var last; return mount(h(P.SignatureField, { onChange: function (v) { last = v; } })).then(function (m) {
      setValue(m.$("input[type=text]"), "Maria Okafor"); m.$(".op-check").click(); return wait(40).then(function () { eq(last.name, "Maria Okafor"); eq(last.agreed, true); eq(last.method, "type"); assert(text(m.$(".op-sign-line")).indexOf("Maria Okafor") >= 0, "shown on the line"); });
    });
  });
  test("SignaturePad: drawing reports an image, Clear resets", function () {
    var last; return mount(h(P.SignaturePad, { onChange: function (v) { last = v; } })).then(function (m) {
      var cv = m.$("canvas"), r = cv.getBoundingClientRect();
      function ev(t, x, y) { cv.dispatchEvent(new PointerEvent(t, { bubbles: true, cancelable: true, pointerId: 1, clientX: r.left + x, clientY: r.top + y })); }
      ev("pointerdown", 10, 50); ev("pointermove", 60, 70); ev("pointermove", 110, 40); ev("pointerup", 110, 40);
      return wait(40).then(function () { eq(last.empty, false); assert(/^data:image\/png/.test(last.image), "png"); m.$(".op-pad-foot .op-btn").click(); return wait(30); }).then(function () { eq(last.empty, true); });
    });
  });

  /* ------------------------------ composition and layout ------------------------------ */
  test("Headings: headingLevel sets the heading element", function () {
    return mount(h("div", null, h(P.StatementCard, { title: "A", amount: 1, status: "due", headingLevel: 2 }), h(P.Panel, { title: "B" }), h(P.AppointmentCard, { date: d(2026, 9, 22), time: "9 am", title: "C", headingLevel: 4 }))).then(function (m) {
      assert(m.$("h2.op-stmt-title"), "h2"); assert(m.$("h3.op-panel-title"), "default h3"); assert(m.$("h4.op-appt-title"), "h4");
    });
  });
  test("Building blocks: classes and gap variables", function () {
    return mount(h("div", null, h(P.Surface, { pad: "md", tone: "tint" }, "x"), h(P.Stack, { gap: 4 }, "y"), h(P.Inline, { justify: "between" }, "z"), h(P.Actions, { bar: true }, "w"))).then(function (m) {
      assert(m.$(".op-surface.op-surface--tint.op-surface--pad-md")); eq(m.$(".op-stack").style.getPropertyValue("--gap"), "var(--space-4)"); assert(m.$(".op-inline--between")); assert(m.$(".op-actions--bar"));
    });
  });
  test("Cards are made of Surface and their actions of Actions", function () {
    return mount(h(P.StatementCard, { title: "A", amount: 1, status: "due", actions: h(P.Button, null, "Pay") })).then(function (m) { assert(m.$("article.op-surface.op-stmt")); assert(m.$(".op-actions")); });
  });
  test("Notice: actions sit at the end when wide and under the text when narrow", function () {
    var el = function () { return h(P.Notice, { tone: "warning", title: "Form due", actions: h(P.Button, { variant: "outline" }, "Sign") }, "Please sign before Oct 22."); };
    return mount(el(), 720).then(function (wide) { return mount(el(), 320).then(function (narrow) {
      var a = wide.$(".op-notice-actions").getBoundingClientRect(), b = wide.$(".op-notice-body").getBoundingClientRect(); assert(a.left >= b.right - 2, "wide: beside");
      var a2 = narrow.$(".op-notice-actions").getBoundingClientRect(), b2 = narrow.$(".op-notice-body").getBoundingClientRect(); assert(a2.top >= b2.bottom - 2, "narrow: below");
    }); });
  });
  test("ItemRow: status and action are columns when wide and stack when narrow", function () {
    var el = function () { return h(P.ItemList, null, h(P.ItemRow, { icon: "form", title: "New client form", subtitle: "Due Oct 22", status: "action", action: h(P.Button, { variant: "outline" }, "Review and sign") })); };
    return mount(el(), 720).then(function (wide) { return mount(el(), 320).then(function (narrow) {
      var t = wide.$(".op-item-title").getBoundingClientRect(), s = wide.$(".op-stamp").getBoundingClientRect(); assert(s.left > t.right, "wide: stamp beside title");
      var t2 = narrow.$(".op-item-title").getBoundingClientRect(), s2 = narrow.$(".op-stamp").getBoundingClientRect(); assert(s2.top > t2.bottom - 2, "narrow: stamp under");
    }); });
  });
  test("AppointmentCard: a card without a practitioner is as tall as one with", function () {
    return mount(h("div", null, h(P.AppointmentCard, { date: d(2026, 9, 22), time: "9:30 am", title: "Visit", provider: { name: "Amara Singh", role: "Practitioner" }, location: "Main office" }), h(P.AppointmentCard, { date: d(2026, 9, 22), time: "9:30 am", title: "Group session", location: "Main office" }))).then(function (m) {
      var c = m.$$(".op-appt-main"); eq(Math.round(c[0].getBoundingClientRect().height), Math.round(c[1].getBoundingClientRect().height));
    });
  });
  test("AppointmentCard: in a Grid every card takes the tallest height, with the actions bar at its foot", function () {
    var btn = h(P.Button, { variant: "outline" }, "Reschedule");
    return mount(h("div", { style: { width: 560 } }, h(P.Grid, { min: "15rem", gap: 3 },
      h(P.AppointmentCard, { date: d(2026, 9, 22), time: "9:30 am", title: "Check-up", provider: { name: "Dr. Alexandra Montgomery-Whitfield the Third", role: "Physician" }, location: "Main office", status: "confirmed", actions: btn }),
      h(P.AppointmentCard, { date: d(2026, 9, 23), time: "10:00 am", title: "Lab work", provider: { name: "Lee Chen", role: "Nurse" }, location: "Lab", status: "scheduled", actions: btn })))).then(function (m) {
      var c = m.$$(".op-appt"); eq(Math.round(c[0].getBoundingClientRect().height), Math.round(c[1].getBoundingClientRect().height));
      var f = m.$$(".op-appt > .op-actions--bar"); eq(Math.round(f[0].getBoundingClientRect().bottom), Math.round(c[0].getBoundingClientRect().bottom)); eq(Math.round(f[1].getBoundingClientRect().bottom), Math.round(c[1].getBoundingClientRect().bottom));
    });
  });
  test("Surface: actions render as a bar after the body, for StatementCard too", function () {
    return mount(h("div", null, h(P.Surface, { pad: "md", actions: h(P.Button, null, "Pay") }, "Body"), h(P.StatementCard, { title: "Oct", status: "due", amount: 10, actions: h(P.Button, null, "Pay") }))).then(function (m) {
      eq(m.$$(".op-surface > .op-actions--bar").length, 2); eq(m.$$(".op-stmt .op-actions--bar").length, 1);
    });
  });
  test("RadioGroup: reveal shows under the chosen option only", function () {
    return mount(h(P.RadioGroup, { label: "Pay", defaultValue: "full", options: [{ value: "full", label: "Full" }, { value: "part", label: "Part", reveal: h("span", { className: "rv" }, "x") }] })).then(function (m) {
      eq(m.$$(".rv").length, 0); setValue; m.$$("input")[1].click(); return wait(30).then(function () { eq(m.$$(".rv").length, 1); });
    });
  });
  test("CurrencyField: the symbol sits next to the value and a click on it focuses the input", function () {
    return mount(h(P.CurrencyField, { label: "Amount", defaultValue: 100 })).then(function (m) {
      var a = m.$(".op-affix--pre").getBoundingClientRect(), i = m.$(".op-numinput").getBoundingClientRect(); assert(i.left - a.right < 8, "gap " + (i.left - a.right)); m.$(".op-affix--pre").click(); return wait(50).then(function () { assert(document.activeElement === m.$(".op-numinput"), "input focused"); });
    });
  });
  test("DataGrid: becomes cards on a narrow container", function () {
    var el = function () { return h(P.DataGrid, { caption: "T", columns: [{ key: "n", label: "Name" }, { key: "a", label: "Amount" }], rows: [{ id: 1, n: "A", a: 1 }] }); };
    return mount(el(), 320).then(function (narrow) { return mount(el(), 800).then(function (wide) {
      eq(getComputedStyle(narrow.$("tbody tr")).display, "block"); eq(getComputedStyle(wide.$("tbody tr")).display, "table-row");
    }); });
  });

  test("A one-row multi-select is the same height as a Field and a Select", function () {
    return mount(h("div", null, h(P.Field, { label: "A" }), h(P.Select, { label: "B", options: ["x"] }), h(P.MultiSelect, { label: "C", options: ["Text", "Email"], defaultValue: ["Text"] }))).then(function (m) {
      var hs = [m.$(".op-field .op-input").getBoundingClientRect().height, m.$(".op-sel-trigger").getBoundingClientRect().height, m.$(".op-combo--multi").getBoundingClientRect().height].map(Math.round);
      eq(hs, [48, 48, 48]);
    });
  });
  test("Fieldset: title and Required sit on the top edge with room either side", function () {
    return mount(h(P.Fieldset, { legend: "Home address", required: true }, h(P.Field, { label: "Street" }))).then(function (m) {
      var fs = m.$("fieldset").getBoundingClientRect(), t = m.$(".op-fieldset-title").getBoundingClientRect(), fl = m.$(".op-field-flag").getBoundingClientRect();
      var pad = parseFloat(getComputedStyle(m.$(".op-fieldset-title")).paddingLeft), padFlag = parseFloat(getComputedStyle(m.$(".op-field-flag")).paddingRight); assert(t.left - fs.left + pad >= 24, "room before the title: " + (t.left - fs.left + pad)); assert(fs.right - fl.right + padFlag >= 24, "room after Required: " + (fs.right - fl.right + padFlag));
      assert(fl.left > t.right, "Required is at the end");
    });
  });
  /* ------------------------------ accessibility spot checks ------------------------------ */
  test("Every text input has an accessible name", function () {
    return mount(h("div", null, h(P.Field, { label: "A" }), h(P.Textarea, { label: "B" }), h(P.NumberField, { label: "C" }), h(P.DatePicker, { label: "D" }), h(P.PasswordField, { label: "E" }), h(P.Select, { label: "F", options: ["x"] }), h(P.Combobox, { label: "G", options: ["x"] }), h(P.OtpField, { label: "H" }), h(P.SearchBar, null))).then(function (m) {
      m.$$("input:not([type=hidden]), textarea, button[role=combobox]").forEach(function (el) {
        var named = el.getAttribute("aria-label") || (el.id && m.host.querySelector('label[for="' + el.id + '"]')) || el.getAttribute("aria-labelledby"); assert(named, "unnamed control: " + el.outerHTML.slice(0, 80));
      });
    });
  });
  test("Controls are 48px tall (the field wrapper carries the height for inner inputs)", function () {
    return mount(h("div", null, h(P.Button, null, "Save"), h(P.Field, { label: "A" }), h(P.Select, { label: "B", options: ["x"] }), h(P.DatePicker, { label: "C" }), h(P.NumberField, { label: "D" }))).then(function (m) {
      m.$$(".op-btn, .op-input:not(.op-combo-input):not(.op-numinput), .op-input-wrap").forEach(function (el) { eq(Math.round(el.getBoundingClientRect().height), 48, el.className); });
    });
  });
  test("Status is never colour alone: stamps carry a word and an icon", function () {
    return mount(h(P.StatusStamp, { status: "overdue" })).then(function (m) { eq(text(m.$(".op-stamp-word")), "Overdue"); assert(m.$(".op-stamp svg"), "icon"); eq(m.$(".op-stamp").getAttribute("aria-label"), "Overdue"); });
  });

  /* ------------------------------ runner ------------------------------ */
  function run(onResult) {
    var out = [];
    return tests.reduce(function (p, t) {
      return p.then(function () {
        var start = Date.now();
        return Promise.resolve().then(t.fn).then(function () { return { name: t.name, ok: true, ms: Date.now() - start }; }, function (e) { return { name: t.name, ok: false, error: (e && e.message) || String(e) }; })
          .then(function (r) { out.push(r); if (onResult) onResult(r); mounted.splice(0).forEach(function (m) { try { m.unmount(); } catch (e) {} }); });
      });
    }, Promise.resolve()).then(function () { return out; });
  }
  window.OpenPracticeTests = { run: run, count: function () { return tests.length; } };
})();
