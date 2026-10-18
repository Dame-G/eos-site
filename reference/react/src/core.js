  /* ---- Configuration: locale, currency, direction and the words the components say ---- */
  var CONFIG = { locale: "en-US", currency: "USD", dir: null, messages: {} };
  var MESSAGES = {
    required: "Required", address: "Address", optional: "Optional", loading: "Loading", close: "Close", dismiss: "Dismiss", search: "Search", select: "Select", clear: "Clear",
    today: "Today", previous: "Previous", next: "Next", pagination: "Pagination", pageN: "Page {n}", breadcrumb: "Breadcrumb", mainNav: "Main", progress: "Progress", done: "done",
    you: "You", practice: "Practice", automatic: "Automatic", activity: "Activity, newest first", history: "History", amount: "Amount", status: "Status",
    "status.paid": "Paid", "status.due": "Due", "status.overdue": "Overdue", "status.action": "Action needed", "status.scheduled": "Scheduled", "status.confirmed": "Confirmed",
    "status.cancelled": "Cancelled", "status.signed": "Signed", "status.pending": "Pending", "status.complete": "Complete",
    dragHere: "Drag a file here or", chooseOne: "choose one", noTimes: "No times are open on this day.",
    signature: "Signature", typeName: "Type your full name", fullName: "Full name", signHint: "Typing your name is your signature.", signAppears: "Your signature appears here", agreeSign: "I agree and want to sign this form.",
    drawSignature: "Draw your signature", signDrawHint: "Draw your signature with a finger, mouse or stylus, or choose Type.", signType: "Type", signDraw: "Draw", signClear: "Clear signature", signEmpty: "Sign here",
    verificationCode: "Verification code", otpDigit: "Digit {n} of {total}", otpChar: "Character {n} of {total}",
    decrease: "Decrease", increase: "Increase", showOptions: "Show options", removeItem: "Remove {label}", searching: "Searching", noMatches: "No matches",
    startDate: "Start date", endDate: "End date", to: "to", chooseDate: "Choose date", chooseDates: "Choose dates", dateFormat: "", dateAtTime: "{date} at {time}", dateError: "Enter a date as {format}.", datesError: "Enter dates as {format}.",
    dateBetween: "Choose a date between {min} and {max}.", endBeforeStart: "The end date is before the start date.",
    last7: "Last 7 days", last30: "Last 30 days", thisMonth: "This month", timesAvailable: "times available",
    prevMonth: "Previous month", chooseAMonth: "Choose a month in {year}", nextMonth: "Next month", backToDays: "Back to the days", chooseAYear: "Choose a year",
    chooseDateNow: "Choose year and month, now {month} {year}", backToYears: "Back to the years", monthsOf: "Months of {year}", yearsRange: "Years {from} to {to}", todaySuffix: "today",
    rangeStart: "Choose a start date", rangeEnd: "Starts {start}. Now choose an end date", rangeDone: "{start} to {end} ({days} days)",
    searchAll: "Search all columns", clearFilters: "Clear filters", columns: "Columns", showColumns: "Show columns", chooseColumns: "Choose columns", filter: "Filter", filterColumn: "Filter {col}",
    all: "All", min: "Min", max: "Max", minOf: "{col} minimum", maxOf: "{col} maximum", selectAll: "Select all rows", selectAllPage: "Select all rows on this page", selectRow: "Select row",
    noResults: "No results", noMatchesFilters: "Nothing matches these filters.", nothingYet: "There is nothing to show yet.", rows: "{n} rows", showing: "Showing {from}\u2013{to} of {total}",
    sortedBy: "Sorted by {col}, {dir}.", ascending: "ascending", descending: "descending", rowsAnnounce: "{n} rows.", resizeCol: "Resize {col} column", sortBy: "Sort by", selected: "{n} selected",
    showPassword: "Show password", hidePassword: "Hide password", password: "Password", passwordRules: "Your password needs:",
    ruleMet: "met", ruleNotMet: "not met yet", errorSummary: "There is a problem", skipToMain: "Skip to main content", back: "Back",
    cardNumber: "Card details", cardSecure: "Your card details go straight to our payment provider. We never see or store them.", cardLoading: "Loading secure card fields",
    street: "Street", unit: "Apartment, suite or unit", city: "City", region: "State", postal: "ZIP code", phone: "Phone number",
    toastRegion: "Notifications"
  };
  function t(key, vars) {
    var s = CONFIG.messages[key];
    if (s == null) s = MESSAGES[key];
    if (s == null) s = key;
    return vars ? s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }) : s;
  }
  /** Sets the locale (names of months, week start, date and number formats), the currency, the text direction and any message overrides. */
  function configure(opts) {
    opts = opts || {};
    if (opts.locale) CONFIG.locale = opts.locale;
    if (opts.currency) CONFIG.currency = opts.currency;
    if (opts.messages) CONFIG.messages = Object.assign({}, CONFIG.messages, opts.messages);
    if (opts.dir !== undefined) { CONFIG.dir = opts.dir; if (typeof document !== "undefined") { if (opts.dir) document.documentElement.setAttribute("dir", opts.dir); else document.documentElement.removeAttribute("dir"); } }
    rebuildNames();
    return { locale: CONFIG.locale, currency: CONFIG.currency, dir: CONFIG.dir };
  }

  /* Icons: Phosphor (MIT). Regular weight by default, bold when small. */
  var PH_VB = "0 0 256 256";
  var PH = {
    "eye": ["<path d=\"M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z\"/>", "<path d=\"M251,123.13c-.37-.81-9.13-20.26-28.48-39.61C196.63,57.67,164,44,128,44S59.37,57.67,33.51,83.52C14.16,102.87,5.4,122.32,5,123.13a12.08,12.08,0,0,0,0,9.75c.37.82,9.13,20.26,28.49,39.61C59.37,198.34,92,212,128,212s68.63-13.66,94.48-39.51c19.36-19.35,28.12-38.79,28.49-39.61A12.08,12.08,0,0,0,251,123.13Zm-46.06,33C183.47,177.27,157.59,188,128,188s-55.47-10.73-76.91-31.88A130.36,130.36,0,0,1,29.52,128,130.45,130.45,0,0,1,51.09,99.89C72.54,78.73,98.41,68,128,68s55.46,10.73,76.91,31.89A130.36,130.36,0,0,1,226.48,128,130.45,130.45,0,0,1,204.91,156.12ZM128,84a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,84Zm0,64a20,20,0,1,1,20-20A20,20,0,0,1,128,148Z\"/>"],
    "eye-slash": ["<path d=\"M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z\"/>", "<path d=\"M56.88,31.93A12,12,0,1,0,39.12,48.07l16,17.65C20.67,88.66,5.72,121.58,5,123.13a12.08,12.08,0,0,0,0,9.75c.37.82,9.13,20.26,28.49,39.61C59.37,198.34,92,212,128,212a131.34,131.34,0,0,0,51-10l20.09,22.1a12,12,0,0,0,17.76-16.14ZM128,188c-29.59,0-55.47-10.73-76.91-31.88A130.69,130.69,0,0,1,29.52,128c5.27-9.31,18.79-29.9,42-44.29l90.09,99.11A109.33,109.33,0,0,1,128,188Zm123-55.12c-.36.81-9,20-28,39.16a12,12,0,1,1-17-16.9A130.48,130.48,0,0,0,226.48,128a130.36,130.36,0,0,0-21.57-28.12C183.46,78.73,157.59,68,128,68c-3.35,0-6.7.14-10,.42a12,12,0,1,1-2-23.91c3.93-.34,8-.51,12-.51,36,0,68.63,13.67,94.49,39.52,19.35,19.35,28.11,38.8,28.48,39.61A12.08,12.08,0,0,1,251,132.88Z\"/>"],
    "arrow-left": ["<path d=\"M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z\"/>", "<path d=\"M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z\"/>"],
    "menu": ["<path d=\"M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z\"/>", "<path d=\"M228,128a12,12,0,0,1-12,12H40a12,12,0,0,1,0-24H216A12,12,0,0,1,228,128ZM40,76H216a12,12,0,0,0,0-24H40a12,12,0,0,0,0,24ZM216,180H40a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Z\"/>"],
    "sign-out": ["<path d=\"M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z\"/>", "<path d=\"M124,216a12,12,0,0,1-12,12H48a12,12,0,0,1-12-12V40A12,12,0,0,1,48,28h64a12,12,0,0,1,0,24H60V204h52A12,12,0,0,1,124,216Zm108.49-96.49-40-40a12,12,0,0,0-17,17L195,116H112a12,12,0,0,0,0,24h83l-19.52,19.51a12,12,0,0,0,17,17l40-40A12,12,0,0,0,232.49,119.51Z\"/>"],
    "eraser": ["<path d=\"M225,80.4,183.6,39a24,24,0,0,0-33.94,0L31,157.66a24,24,0,0,0,0,33.94l30.06,30.06A8,8,0,0,0,66.74,224H216a8,8,0,0,0,0-16h-84.7L225,114.34A24,24,0,0,0,225,80.4ZM108.68,208H70.05L42.33,180.28a8,8,0,0,1,0-11.31L96,115.31,148.69,168Zm105-105L160,156.69,107.31,104,161,50.34a8,8,0,0,1,11.32,0l41.38,41.38a8,8,0,0,1,0,11.31Z\"/>", "<path d=\"M216,204H141l86.84-86.84a28,28,0,0,0,0-39.6L186.43,36.19a28,28,0,0,0-39.6,0L28.19,154.82a28,28,0,0,0,0,39.6l30.06,30.07A12,12,0,0,0,66.74,228H216a12,12,0,0,0,0-24ZM163.8,53.16a4,4,0,0,1,5.66,0l41.38,41.38a4,4,0,0,1,0,5.65L160,151l-47-47ZM71.71,204,45.16,177.45a4,4,0,0,1,0-5.65L96,121l47,47-36,36Z\"/>"],
    "card": ["<path d=\"M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm0,16V88H32V64Zm0,128H32V104H224v88Zm-16-24a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h32A8,8,0,0,1,208,168Zm-64,0a8,8,0,0,1-8,8H120a8,8,0,0,1,0-16h16A8,8,0,0,1,144,168Z\"/>", "<path d=\"M224,44H32A20,20,0,0,0,12,64V192a20,20,0,0,0,20,20H224a20,20,0,0,0,20-20V64A20,20,0,0,0,224,44Zm-4,24V88H36V68ZM36,188V112H220v76Zm172-24a12,12,0,0,1-12,12H164a12,12,0,0,1,0-24h32A12,12,0,0,1,208,164Zm-68,0a12,12,0,0,1-12,12H116a12,12,0,0,1,0-24h12A12,12,0,0,1,140,164Z\"/>"],
    "receipt": ["<path d=\"M72,104a8,8,0,0,1,8-8h96a8,8,0,0,1,0,16H80A8,8,0,0,1,72,104Zm8,40h96a8,8,0,0,0,0-16H80a8,8,0,0,0,0,16ZM232,56V208a8,8,0,0,1-11.58,7.15L192,200.94l-28.42,14.21a8,8,0,0,1-7.16,0L128,200.94,99.58,215.15a8,8,0,0,1-7.16,0L64,200.94,35.58,215.15A8,8,0,0,1,24,208V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56Zm-16,0H40V195.06l20.42-10.22a8,8,0,0,1,7.16,0L96,199.06l28.42-14.22a8,8,0,0,1,7.16,0L160,199.06l28.42-14.22a8,8,0,0,1,7.16,0L216,195.06Z\"/>", "<path d=\"M68,100A12,12,0,0,1,80,88h96a12,12,0,0,1,0,24H80A12,12,0,0,1,68,100Zm12,52h96a12,12,0,0,0,0-24H80a12,12,0,0,0,0,24ZM236,56V208a12,12,0,0,1-17.37,10.73L192,205.42l-26.63,13.31a12,12,0,0,1-10.74,0L128,205.42l-26.63,13.31a12,12,0,0,1-10.74,0L64,205.42,37.37,218.73A12,12,0,0,1,20,208V56A20,20,0,0,1,40,36H216A20,20,0,0,1,236,56Zm-24,4H44V188.58l14.63-7.31a12,12,0,0,1,10.74,0L96,194.58l26.63-13.31a12,12,0,0,1,10.74,0L160,194.58l26.63-13.31a12,12,0,0,1,10.74,0L212,188.58Z\"/>"],
    "signature": ["<path d=\"M232,168H63.86c2.66-5.24,5.33-10.63,8-16.11,15,1.65,32.58-8.78,52.66-31.14,5,13.46,14.45,30.93,30.58,31.25,9.06.18,18.11-5.2,27.42-16.37C189.31,143.75,203.3,152,232,152a8,8,0,0,0,0-16c-30.43,0-39.43-10.45-40-16.11a7.67,7.67,0,0,0-5.46-7.75,8.14,8.14,0,0,0-9.25,3.49c-12.07,18.54-19.38,20.43-21.92,20.37-8.26-.16-16.66-19.52-19.54-33.42a8,8,0,0,0-14.09-3.37C101.54,124.55,88,133.08,79.57,135.29,88.06,116.42,94.4,99.85,98.46,85.9c6.82-23.44,7.32-39.83,1.51-50.1-3-5.38-9.34-11.8-22.06-11.8C61.85,24,49.18,39.18,43.14,65.65c-3.59,15.71-4.18,33.21-1.62,48s7.87,25.55,15.59,31.94c-3.73,7.72-7.53,15.26-11.23,22.41H24a8,8,0,0,0,0,16H37.41c-11.32,21-20.12,35.64-20.26,35.88a8,8,0,1,0,13.71,8.24c.15-.26,11.27-18.79,24.7-44.12H232a8,8,0,0,0,0-16ZM58.74,69.21C62.72,51.74,70.43,40,77.91,40c5.33,0,7.1,1.86,8.13,3.67,3,5.33,6.52,24.19-21.66,86.39C56.12,118.78,53.31,93,58.74,69.21Z\"/>", "<path d=\"M232,164H70.38c2.2-4.42,4.41-8.94,6.59-13.52l.79-1.66c13.52-1.65,28.69-11.3,45.38-28.87,5.31,12,14,24.73,27.59,27.29,5.26,1,13.51.79,22.93-5.82a57.86,57.86,0,0,0,9-7.91C190.9,141.2,205.68,148,232,148a12,12,0,0,0,0-24c-31,0-35.42-10.49-36-12.38.49-5.37-2.75-9.76-7.88-11.63s-11.17.78-14.22,5.46c-10,15.32-16.62,18.62-18.75,18.21-4.88-.91-12.39-15.54-15.44-30.09a12,12,0,0,0-21.13-5c-10.3,12.92-19.16,21.79-26.47,27.56,21.19-52.94,17-72.22,11.37-82.25C98.48,24.91,89.41,20,78,20,59.92,20,45.36,36.55,39,64.26c-3.45,15.1-4,31.81-1.46,45.85,2.65,14.71,8.36,25.7,16.68,32.23C50.69,149.78,47,157.06,43.47,164H24a12,12,0,0,0,0,24h6.7c-9.7,17.67-16.85,29.6-17,29.81a12,12,0,1,0,20.56,12.38C34.91,229.15,45.23,212,58,188H232a12,12,0,0,0,0-24ZM62.43,69.6C65.77,55,72.45,44,78,44c3.71,0,4.29,1,4.64,1.64,1.43,2.53,6.55,17.07-17.44,72.78a44.64,44.64,0,0,1-4-12.56C59.23,94.89,59.68,81.67,62.43,69.6Z\"/>"],
    "form": ["<path d=\"M168,152a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,152Zm-8-40H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm56-64V216a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V48A16,16,0,0,1,56,32H92.26a47.92,47.92,0,0,1,71.48,0H200A16,16,0,0,1,216,48ZM96,64h64a32,32,0,0,0-64,0ZM200,48H173.25A47.93,47.93,0,0,1,176,64v8a8,8,0,0,1-8,8H88a8,8,0,0,1-8-8V64a47.93,47.93,0,0,1,2.75-16H56V216H200Z\"/>", "<path d=\"M172,164a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,164Zm-12-52H96a12,12,0,0,0,0,24h64a12,12,0,0,0,0-24Zm60-64V216a20,20,0,0,1-20,20H56a20,20,0,0,1-20-20V48A20,20,0,0,1,56,28H90.53a51.88,51.88,0,0,1,74.94,0H200A20,20,0,0,1,220,48ZM100.29,60h55.42a28,28,0,0,0-55.42,0ZM196,52H178.59A52.13,52.13,0,0,1,180,64v8a12,12,0,0,1-12,12H88A12,12,0,0,1,76,72V64a52.13,52.13,0,0,1,1.41-12H60V212H196Z\"/>"],
    "download": ["<path d=\"M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z\"/>", "<path d=\"M228,144v64a12,12,0,0,1-12,12H40a12,12,0,0,1-12-12V144a12,12,0,0,1,24,0v52H204V144a12,12,0,0,1,24,0Zm-108.49,8.49a12,12,0,0,0,17,0l40-40a12,12,0,0,0-17-17L140,115V32a12,12,0,0,0-24,0v83L96.49,95.51a12,12,0,0,0-17,17Z\"/>"],
    "print": ["<path d=\"M214.67,72H200V40a8,8,0,0,0-8-8H64a8,8,0,0,0-8,8V72H41.33C27.36,72,16,82.77,16,96v80a8,8,0,0,0,8,8H56v32a8,8,0,0,0,8,8H192a8,8,0,0,0,8-8V184h32a8,8,0,0,0,8-8V96C240,82.77,228.64,72,214.67,72ZM72,48H184V72H72ZM184,208H72V160H184Zm40-40H200V152a8,8,0,0,0-8-8H64a8,8,0,0,0-8,8v16H32V96c0-4.41,4.19-8,9.33-8H214.67c5.14,0,9.33,3.59,9.33,8Zm-24-52a12,12,0,1,1-12-12A12,12,0,0,1,200,116Z\"/>", "<path d=\"M214.67,68H204V40a12,12,0,0,0-12-12H64A12,12,0,0,0,52,40V68H41.33C25.16,68,12,80.56,12,96v80a12,12,0,0,0,12,12H52v28a12,12,0,0,0,12,12H192a12,12,0,0,0,12-12V188h28a12,12,0,0,0,12-12V96C244,80.56,230.84,68,214.67,68ZM76,52H180V68H76ZM180,204H76V172H180Zm40-40H204v-4a12,12,0,0,0-12-12H64a12,12,0,0,0-12,12v4H36V96c0-2.17,2.44-4,5.33-4H214.67c2.89,0,5.33,1.83,5.33,4Zm-16-44a16,16,0,1,1-16-16A16,16,0,0,1,204,120Z\"/>"],
    "lock": ["<path d=\"M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Z\"/>", "<path d=\"M208,76H180V56A52,52,0,0,0,76,56V76H48A20,20,0,0,0,28,96V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V96A20,20,0,0,0,208,76ZM100,56a28,28,0,0,1,56,0V76H100ZM204,204H52V100H204Z\"/>"],
    "pin": ["<path d=\"M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z\"/>", "<path d=\"M128,60a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,60Zm0,64a20,20,0,1,1,20-20A20,20,0,0,1,128,124Zm0-112a92.1,92.1,0,0,0-92,92c0,77.36,81.64,135.4,85.12,137.83a12,12,0,0,0,13.76,0,259,259,0,0,0,42.18-39C205.15,170.57,220,136.37,220,104A92.1,92.1,0,0,0,128,12Zm31.3,174.71A249.35,249.35,0,0,1,128,216.89a249.35,249.35,0,0,1-31.3-30.18C80,167.37,60,137.31,60,104a68,68,0,0,1,136,0C196,137.31,176,167.37,159.3,186.71Z\"/>"],
    "edit": ["<path d=\"M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z\"/>", "<path d=\"M230.14,70.54,185.46,25.85a20,20,0,0,0-28.29,0L33.86,149.17A19.85,19.85,0,0,0,28,163.31V208a20,20,0,0,0,20,20H92.69a19.86,19.86,0,0,0,14.14-5.86L230.14,98.82a20,20,0,0,0,0-28.28ZM91,204H52V165l84-84,39,39ZM192,103,153,64l18.34-18.34,39,39Z\"/>"],
    "mail": ["<path d=\"M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z\"/>", "<path d=\"M224,44H32A12,12,0,0,0,20,56V192a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V56A12,12,0,0,0,224,44ZM193.15,68,128,127.72,62.85,68ZM44,188V83.28l75.89,69.57a12,12,0,0,0,16.22,0L212,83.28V188Z\"/>"],
    "phone": ["<path d=\"M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z\"/>", "<path d=\"M224,154.8l-47.09-21.11-.18-.08a19.94,19.94,0,0,0-19,1.75,13.08,13.08,0,0,0-1.12.84l-22.31,19c-13-7.05-26.43-20.37-33.49-33.21l19.06-22.66a11.76,11.76,0,0,0,.85-1.15,20,20,0,0,0,1.66-18.83,1.42,1.42,0,0,1-.08-.18L101.2,32A20.06,20.06,0,0,0,80.42,20.15,60.27,60.27,0,0,0,28,80c0,81.61,66.39,148,148,148a60.27,60.27,0,0,0,59.85-52.42A20.06,20.06,0,0,0,224,154.8ZM176,204A124.15,124.15,0,0,1,52,80,36.29,36.29,0,0,1,80.48,44.46l18.82,42L80.14,109.28a12,12,0,0,0-.86,1.16A20,20,0,0,0,78,130.08c9.42,19.28,28.83,38.56,48.31,48A20,20,0,0,0,146,176.63a11.63,11.63,0,0,0,1.11-.85l22.43-19.07,42,18.81A36.29,36.29,0,0,1,176,204Z\"/>"],
    "wallet": ["<path d=\"M216,64H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,56V184a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H56a8,8,0,0,1-8-8V78.63A23.84,23.84,0,0,0,56,80H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,132Z\"/>", "<path d=\"M196,136a16,16,0,1,1-16-16A16,16,0,0,1,196,136Zm40-36v80a32,32,0,0,1-32,32H60a32,32,0,0,1-32-32V60.92A32,32,0,0,1,60,28H192a12,12,0,0,1,0,24H60a8,8,0,0,0-8,8.26v.08A8.32,8.32,0,0,0,60.48,68H204A32,32,0,0,1,236,100Zm-24,0a8,8,0,0,0-8-8H60.48A33.72,33.72,0,0,1,52,90.92V180a8,8,0,0,0,8,8H204a8,8,0,0,0,8-8Z\"/>"],
    "bell": ["<path d=\"M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z\"/>", "<path d=\"M225.29,165.93C216.61,151,212,129.57,212,104a84,84,0,0,0-168,0c0,25.58-4.59,47-13.27,61.93A20.08,20.08,0,0,0,30.66,186,19.77,19.77,0,0,0,48,196H84.18a44,44,0,0,0,87.64,0H208a19.77,19.77,0,0,0,17.31-10A20.08,20.08,0,0,0,225.29,165.93ZM128,212a20,20,0,0,1-19.6-16h39.2A20,20,0,0,1,128,212ZM54.66,172C63.51,154,68,131.14,68,104a60,60,0,0,1,120,0c0,27.13,4.48,50,13.33,68Z\"/>"],
    "shield": ["<path d=\"M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z\"/>", "<path d=\"M208,36H48A20,20,0,0,0,28,56v56c0,54.29,26.32,87.22,48.4,105.29,23.71,19.39,47.44,26,48.44,26.29a12.1,12.1,0,0,0,6.32,0c1-.28,24.73-6.9,48.44-26.29,22.08-18.07,48.4-51,48.4-105.29V56A20,20,0,0,0,208,36Zm-4,76c0,35.71-13.09,64.69-38.91,86.15A126.28,126.28,0,0,1,128,219.38a126.14,126.14,0,0,1-37.09-21.23C65.09,176.69,52,147.71,52,112V60H204ZM79.51,144.49a12,12,0,1,1,17-17L112,143l47.51-47.52a12,12,0,0,1,17,17l-56,56a12,12,0,0,1-17,0Z\"/>"],
    "trash": ["<path d=\"M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z\"/>", "<path d=\"M216,48H180V36A28,28,0,0,0,152,8H104A28,28,0,0,0,76,36V48H40a12,12,0,0,0,0,24h4V208a20,20,0,0,0,20,20H192a20,20,0,0,0,20-20V72h4a12,12,0,0,0,0-24ZM100,36a4,4,0,0,1,4-4h48a4,4,0,0,1,4,4V48H100Zm88,168H68V72H188ZM116,104v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Zm48,0v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Z\"/>"],
    "arrow-up": ["<path d=\"M205.66,117.66a8,8,0,0,1-11.32,0L136,59.31V216a8,8,0,0,1-16,0V59.31L61.66,117.66a8,8,0,0,1-11.32-11.32l72-72a8,8,0,0,1,11.32,0l72,72A8,8,0,0,1,205.66,117.66Z\"/>", "<path d=\"M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z\"/>"],
    "arrow-down": ["<path d=\"M205.66,149.66l-72,72a8,8,0,0,1-11.32,0l-72-72a8,8,0,0,1,11.32-11.32L120,196.69V40a8,8,0,0,1,16,0V196.69l58.34-58.35a8,8,0,0,1,11.32,11.32Z\"/>", "<path d=\"M208.49,152.49l-72,72a12,12,0,0,1-17,0l-72-72a12,12,0,0,1,17-17L116,187V40a12,12,0,0,1,24,0V187l51.51-51.52a12,12,0,0,1,17,17Z\"/>"],
    "sort": ["<path d=\"M117.66,170.34a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L72,188.69V48a8,8,0,0,1,16,0V188.69l18.34-18.35A8,8,0,0,1,117.66,170.34Zm96-96-32-32a8,8,0,0,0-11.32,0l-32,32a8,8,0,0,0,11.32,11.32L168,67.31V208a8,8,0,0,0,16,0V67.31l18.34,18.35a8,8,0,0,0,11.32-11.32Z\"/>", "<path d=\"M120.49,167.51a12,12,0,0,1,0,17l-32,32a12,12,0,0,1-17,0l-32-32a12,12,0,1,1,17-17L68,179V48a12,12,0,0,1,24,0V179l11.51-11.52A12,12,0,0,1,120.49,167.51Zm96-96-32-32a12,12,0,0,0-17,0l-32,32a12,12,0,0,0,17,17L164,77V208a12,12,0,0,0,24,0V77l11.51,11.52a12,12,0,0,0,17-17Z\"/>"],
    "minus": ["<path d=\"M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z\"/>", "<path d=\"M228,128a12,12,0,0,1-12,12H40a12,12,0,0,1,0-24H216A12,12,0,0,1,228,128Z\"/>"],
    "filter": ["<path d=\"M230.6,49.53A15.81,15.81,0,0,0,216,40H40A16,16,0,0,0,28.19,66.76l.08.09L96,139.17V216a16,16,0,0,0,24.87,13.32l32-21.34A16,16,0,0,0,160,194.66V139.17l67.74-72.32.08-.09A15.8,15.8,0,0,0,230.6,49.53ZM40,56h0Zm106.18,74.58A8,8,0,0,0,144,136v58.66L112,216V136a8,8,0,0,0-2.16-5.47L40,56H216Z\"/>", "<path d=\"M234.29,47.91A20,20,0,0,0,216,36H40A20,20,0,0,0,25.2,69.45l.12.14L92,140.75V216a20,20,0,0,0,31.1,16.64l32-21.33A20,20,0,0,0,164,194.66V140.75l66.67-71.16.12-.14A20,20,0,0,0,234.29,47.91Zm-91,79.89A12,12,0,0,0,140,136v56.52l-24,16V136a12,12,0,0,0-3.25-8.2L49.23,60H206.77Z\"/>"],
    "search": ["<path d=\"M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z\"/>", "<path d=\"M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z\"/>"],
    "check": ["<path d=\"M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z\"/>", "<path d=\"M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z\"/>"],
    "x": ["<path d=\"M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z\"/>", "<path d=\"M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z\"/>"],
    "alert": ["<path d=\"M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z\"/>", "<path d=\"M240.26,186.1,152.81,34.23h0a28.74,28.74,0,0,0-49.62,0L15.74,186.1a27.45,27.45,0,0,0,0,27.71A28.31,28.31,0,0,0,40.55,228h174.9a28.31,28.31,0,0,0,24.79-14.19A27.45,27.45,0,0,0,240.26,186.1Zm-20.8,15.7a4.46,4.46,0,0,1-4,2.2H40.55a4.46,4.46,0,0,1-4-2.2,3.56,3.56,0,0,1,0-3.73L124,46.2a4.77,4.77,0,0,1,8,0l87.44,151.87A3.56,3.56,0,0,1,219.46,201.8ZM116,136V104a12,12,0,0,1,24,0v32a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,176Z\"/>"],
    "info": ["<path d=\"M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z\"/>", "<path d=\"M108,84a16,16,0,1,1,16,16A16,16,0,0,1,108,84Zm128,44A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Zm-72,36.68V132a20,20,0,0,0-20-20,12,12,0,0,0-4,23.32V168a20,20,0,0,0,20,20,12,12,0,0,0,4-23.32Z\"/>"],
    "user": ["<path d=\"M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z\"/>", "<path d=\"M234.38,210a123.36,123.36,0,0,0-60.78-53.23,76,76,0,1,0-91.2,0A123.36,123.36,0,0,0,21.62,210a12,12,0,1,0,20.77,12c18.12-31.32,50.12-50,85.61-50s67.49,18.69,85.61,50a12,12,0,0,0,20.77-12ZM76,96a52,52,0,1,1,52,52A52.06,52.06,0,0,1,76,96Z\"/>"],
    "plus": ["<path d=\"M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z\"/>", "<path d=\"M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z\"/>"],
    "file": ["<path d=\"M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z\"/>", "<path d=\"M216.49,79.52l-56-56A12,12,0,0,0,152,20H56A20,20,0,0,0,36,40V216a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V88A12,12,0,0,0,216.49,79.52ZM160,57l23,23H160ZM60,212V44h76V92a12,12,0,0,0,12,12h48V212Zm112-80a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,132Zm0,40a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,172Z\"/>"],
    "clock": ["<path d=\"M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z\"/>", "<path d=\"M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm68-84a12,12,0,0,1-12,12H128a12,12,0,0,1-12-12V72a12,12,0,0,1,24,0v44h44A12,12,0,0,1,196,128Z\"/>"],
    "chevron-down": ["<path d=\"M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z\"/>", "<path d=\"M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z\"/>"],
    "chevron-right": ["<path d=\"M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z\"/>", "<path d=\"M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z\"/>"],
    "chevron-left": ["<path d=\"M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z\"/>", "<path d=\"M168.49,199.51a12,12,0,0,1-17,17l-80-80a12,12,0,0,1,0-17l80-80a12,12,0,0,1,17,17L97,128Z\"/>"],
    "upload": ["<path d=\"M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0ZM93.66,77.66,120,51.31V144a8,8,0,0,0,16,0V51.31l26.34,26.35a8,8,0,0,0,11.32-11.32l-40-40a8,8,0,0,0-11.32,0l-40,40A8,8,0,0,0,93.66,77.66Z\"/>", "<path d=\"M228,144v64a12,12,0,0,1-12,12H40a12,12,0,0,1-12-12V144a12,12,0,0,1,24,0v52H204V144a12,12,0,0,1,24,0ZM96.49,80.49,116,61v83a12,12,0,0,0,24,0V61l19.51,19.52a12,12,0,1,0,17-17l-40-40a12,12,0,0,0-17,0l-40,40a12,12,0,1,0,17,17Z\"/>"],
    "calendar": ["<path d=\"M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z\"/>", "<path d=\"M208,28H188V24a12,12,0,0,0-24,0v4H92V24a12,12,0,0,0-24,0v4H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28ZM68,52a12,12,0,0,0,24,0h72a12,12,0,0,0,24,0h16V76H52V52ZM52,204V100H204V204Z\"/>"],
    "home": ["<path d=\"M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V160h32v56a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H160V152a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v56H48V120l80-80,80,80Z\"/>", "<path d=\"M222.14,105.85l-80-80a20,20,0,0,0-28.28,0l-80,80A19.86,19.86,0,0,0,28,120v96a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V164h24v52a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V120A19.86,19.86,0,0,0,222.14,105.85ZM204,204H164V152a12,12,0,0,0-12-12H104a12,12,0,0,0-12,12v52H52V121.65l76-76,76,76Z\"/>"],
  };
  /** Icon by name (Phosphor). The bold weight is used when `small` or `bold`. */
  function Icon(props) {
    var name = props.name;
    var bold = props.small || props.bold;
    var markup = (PH[name] || PH.info)[bold ? 1 : 0];
    return h("svg", { className: cx("op-icon", props.small && "op-icon--s", /-(left|right)$/.test(name) && "op-icon--dir"), viewBox: PH_VB, "aria-hidden": "true", focusable: "false", dangerouslySetInnerHTML: { __html: markup } });
  }

  /** Every icon name, for pickers and the gallery. */
  Icon.names = Object.keys(PH);

  function Button(props) {
    var variant = props.variant || "primary";
    return h("button", {
      type: props.type || "button",
      className: cx("op-btn", variant !== "primary" && "op-btn--" + variant, props.block && "op-btn--block"),
      disabled: props.disabled, onClick: props.onClick
    }, props.icon ? h(Icon, { name: props.icon }) : null, props.children);
  }

  function IconButton(props) {
    return h("button", { type: "button", className: "op-icon-btn", "aria-label": props.label, onClick: props.onClick, disabled: props.disabled, popovertarget: props.popoverTarget, popovertargetaction: props.popoverAction }, h(Icon, { name: props.icon }));
  }

  function Chip(props) {
    var tone = props.tone && props.tone !== "ink" && props.tone !== "neutral" ? props.tone : null;
    return h("span", { className: cx("op-chip", tone && "op-chip--" + tone) }, props.children);
  }


  var fieldId = 0;
  var PASS_KEYS = ["name", "autoComplete", "autoCapitalize", "autoCorrect", "maxLength", "minLength", "pattern", "min", "max", "step", "inputMode", "spellCheck", "readOnly", "enterKeyHint", "form", "list", "onBlur", "onFocus", "onKeyDown", "onKeyUp", "onPaste", "autoFocus", "tabIndex", "title"];
  /** The native attributes a consumer may put on an input (name, autocomplete, maxlength, pattern, aria-* and so on), with the hint or error id joined into aria-describedby. */
  function inputAttrs(props, describedBy) {
    var o = {};
    PASS_KEYS.forEach(function (k) { if (props[k] !== undefined) o[k] = props[k]; });
    Object.keys(props).forEach(function (k) { if (/^(aria-|data-)/.test(k) && k !== "aria-describedby") o[k] = props[k]; });
    var desc = [describedBy, props["aria-describedby"]].filter(Boolean).join(" ");
    if (desc) o["aria-describedby"] = desc;
    if (props.inputRef) o.ref = props.inputRef;
    return o;
  }
  function mergeRefs(a, b) { return function (el) { [a, b].forEach(function (r) { if (typeof r === "function") r(el); else if (r) r.current = el; }); }; }

  /** A text input with its label, hint and error. onChange receives the value first, then the event. */
  function Field(props) {
    var id = useUid("op-field-", props.id), hintId = id + "-hint", affixed = props.prefix || props.suffix;
    var input = h("input", Object.assign({
      id: id, className: "op-input", type: props.type || "text", placeholder: props.placeholder,
      defaultValue: props.defaultValue, value: props.value, disabled: props.disabled, required: props.required,
      "aria-invalid": props.error ? "true" : undefined,
      onChange: function (e) { if (props.onChange) props.onChange(e.target.value, e); }
    }, inputAttrs(props, props.error || props.hint ? hintId : "")));
    var control = affixed
      ? h("div", { className: "op-input-wrap", onClick: focusInside, "data-invalid": props.error ? "" : undefined, "data-disabled": props.disabled ? "" : undefined },
          props.prefix ? h("span", { className: "op-affix op-affix--pre", "aria-hidden": "true" }, props.prefix) : null,
          input,
          props.suffix ? h("span", { className: "op-affix op-affix--post", "aria-hidden": "true" }, props.suffix) : null)
      : input;
    return FieldShell(props, control, id);
  }

  /** The label, control slot, hint and error around any custom control. Pass a function as children to receive the id and aria attributes to put on the control. */
  function FormField(props) {
    var id = useUid("op-ff-", props.id);
    var control = typeof props.children === "function" ? props.children({ id: id, "aria-invalid": props.error ? "true" : undefined, "aria-describedby": props.error || props.hint ? id + "-hint" : undefined }) : props.children;
    return FieldShell(props, control, id);
  }

  function SearchBar(props) {
    var s = React.useState(props.defaultValue || ""), inner = s[0], setInner = s[1];
    var value = props.value !== undefined ? props.value : inner;
    return h("form", { className: "op-search", role: "search", onSubmit: function (e) { e.preventDefault(); if (props.onSubmit) props.onSubmit(value); } },
      h("span", { className: "op-search-lead" }, h(Icon, { name: "search" })),
      h("input", { className: "op-input", name: props.name || "q", "aria-label": props.label || t("search"), placeholder: props.placeholder || t("search"), value: value, disabled: props.disabled,
        onChange: function (e) { if (props.value === undefined) setInner(e.target.value); if (props.onChange) props.onChange(e.target.value, e); } }),
      h(Button, { type: "submit", disabled: props.disabled }, props.action || t("search")));
  }


  var STAMPS = {
    paid: ["success", "Paid", "check"], due: ["info", "Due", "clock"], overdue: ["danger", "Overdue", "alert"], action: ["warning", "Action needed", "alert"],
    scheduled: ["info", "Scheduled", "calendar"], confirmed: ["success", "Confirmed", "check"], cancelled: ["danger", "Cancelled", "x"],
    signed: ["success", "Signed", "check"], pending: ["info", "Pending", "clock"], complete: ["success", "Complete", "check"]
  };
  function StatusStamp(props) {
    var preset = STAMPS[props.status] || [];
    var tone = props.tone || preset[0] || "info", label = props.label || CONFIG.messages["status." + props.status] || preset[1] || t("status");
    var icon = props.icon || preset[2] || TONE_ICON[tone];
    return h("div", { className: cx("op-stamp", "op-stamp--" + tone, props.small && "op-stamp--s"), role: "img", "aria-label": label + (props.detail ? ", " + props.detail : "") },
      h(Icon, { name: icon, bold: true }),
      h("span", { className: "op-stamp-word" }, label),
      props.detail ? h("span", { className: "op-stamp-detail" }, props.detail) : null);
  }

  function money(n, o) {
    o = o || {};
    try { return new Intl.NumberFormat(o.locale || CONFIG.locale, { style: "currency", currency: o.currency || CONFIG.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n)); }
    catch (e) { return Number(n).toFixed(2); }
  }

  function AmountFigure(props) {
    return h("div", { className: "op-amount" },
      props.label ? h("span", { className: "op-amount-label" }, props.label) : null,
      h("span", { className: "op-amount-main" }, money(props.amount, props)),
      props.details && props.details.length ? h("div", { className: "op-amount-meta" }, props.details.map(function (d) { return h("span", { key: d.label }, d.label + " " + (typeof d.value === "number" ? money(d.value, props) : d.value)); })) : null);
  }

  var KINDS = { you: { label: "you", tone: "neutral" }, practice: { label: "practice", tone: "info" }, system: { label: "automatic", tone: "neutral" } };

  function ActivityList(props) {
    return h("ol", { className: "op-activity", "aria-label": t("activity") },
      (props.items || []).map(function (item, i) {
        var kind = KINDS[item.kind] || KINDS.system;
        return h("li", { key: i, className: "op-activity-row" },
          h(Chip, { tone: kind.tone }, t(kind.label)),
          h("p", { className: "op-activity-main" }, item.note),
          h("p", { className: "op-activity-source" }, item.source));
      }));
  }

  /** A section that opens and closes (native details). The row variant is flush and mono; the card variant is a roomy accordion row. */
  function Disclosure(props) {
    var card = props.variant === "card";
    return h("details", { className: cx("op-disclosure", card ? "op-acc" : "op-details"), name: props.group, open: props.defaultOpen || undefined },
      h("summary", null, card ? [h("span", { key: "t", className: "op-acc-title" }, props.title), props.meta ? h("span", { key: "m", className: "op-acc-meta" }, props.meta) : null] : props.title),
      card ? h("div", { className: "op-acc-body" }, props.children) : h("div", { className: "op-details-body" }, props.children));
  }

  /* ---- The account: statements, appointments, details, forms ---- */
  function StatementCard(props) {
    return h(Surface, { as: "article", className: "op-stmt", pad: "md", actions: props.actions },
      h("div", { className: "op-stmt-top" },
        h(StatusStamp, { status: props.status, tone: props.tone, label: props.label, detail: props.detail }),
        h(AmountFigure, { label: props.amountLabel, amount: props.amount, details: props.details, currency: props.currency, locale: props.locale })),
      h("div", { className: "op-stmt-head" },
        h("h" + (props.headingLevel || 3), { className: "op-stmt-title" }, props.title),
        props.subtitle ? h("p", { className: "op-stmt-sub" }, props.subtitle) : null),
      props.reason ? h("p", { className: "op-stmt-reason" }, props.reason) : null,
      props.parts && props.parts.length ? h(DescriptionList, { items: props.parts }) : null,
      props.activity && props.activity.length ? h(Disclosure, { title: (props.activityTitle || t("history")) + " (" + props.activity.length + ")" }, h(ActivityList, { items: props.activity })) : null);
  }

  /** A one-line statement that opens to what you owe, why and how to pay. The amount shows in the row and again as the total of the breakdown. */
  function StatementRow(props) {
    var details = props.details || [];
    return h("details", { className: "op-srow" },
      h("summary", null,
        h(StatusStamp, { status: props.status, tone: props.tone, label: props.label, small: true }),
        h("div", { className: "op-srow-main" }, h("p", { className: "op-srow-title" }, props.title), props.subtitle ? h("p", { className: "op-srow-sub" }, props.subtitle) : null),
        h("span", { className: "op-srow-amount" }, money(props.amount, props))),
      h("div", { className: "op-srow-body" },
        h("div", { className: "op-srow-content" },
        props.reason || details.length ? h("div", { className: cx("op-srow-lead", details.length && "op-srow-lead--totals") },
          props.reason ? h("p", { className: "op-stmt-reason" }, props.reason) : null,
          details.length ? h(Surface, { as: "dl", className: "op-totals", pad: "sm" },
            details.map(function (d) { return h("div", { key: d.label, className: "op-totals-row" }, h("dt", null, d.label), h("dd", null, typeof d.value === "number" ? money(d.value, props) : d.value)); }),
            h("div", { className: "op-totals-row op-totals-row--sum" }, h("dt", null, props.amountLabel || t("amount")), h("dd", null, money(props.amount, props)))) : null) : null,
        props.parts && props.parts.length ? h(DescriptionList, { items: props.parts }) : null,
        props.activity && props.activity.length ? h(Disclosure, { title: (props.activityTitle || t("history")) + " (" + props.activity.length + ")" }, h(ActivityList, { items: props.activity })) : null,
        ), props.actions ? h(Actions, { bar: true }, props.actions) : null));
  }

  function DetailRow(props) {
    return h("div", { className: "op-detail" },
      h("div", { className: "op-detail-main" }, h("p", { className: "op-kicker op-detail-label" }, props.label), h("p", { className: "op-detail-value" }, props.children)),
      props.status ? h(Chip, { tone: props.tone }, props.status) : h("span", { className: "op-detail-gap", "aria-hidden": "true" }),
      props.onEdit ? h(Button, { variant: "quiet", onClick: props.onEdit, "aria-label": "Edit " + props.label }, "Edit") : null);
  }

  var ItemsCtx = React.createContext(false);
  /** A line in a list of forms, receipts or documents. Status and action sit at the end of the row when it is wide, and under the title when it is narrow. */
  function ItemRow(props) {
    var inList = React.useContext(ItemsCtx);
    var row = h("div", { className: "op-item" },
      props.icon ? h("span", { className: "op-item-icon" }, h(Icon, { name: props.icon })) : null,
      h("div", { className: "op-item-main" }, h("p", { className: "op-item-title" }, props.title), props.subtitle ? h("p", { className: "op-item-sub" }, props.subtitle) : null),
      props.status || props.label ? h(StatusStamp, { status: props.status, tone: props.tone, label: props.label, small: true }) : null,
      props.action || null);
    return inList ? row : h(ItemList, null, row);
  }

  /** Rows that share their columns, so statuses and actions line up down the list. */
  function ItemList(props) {
    return h("div", { className: "op-items" }, h("div", { className: "op-items-grid" }, h(ItemsCtx.Provider, { value: true }, props.children)));
  }

  /** One upcoming visit. The practitioner leads (photo, name, role); the visit type, when and where line up under the name. With no practitioner, the date tile takes the photo's place. */
  function AppointmentCard(props) {
    var d = props.date, p = props.provider || {}, who = props.with || p.name, role = props.role || p.role, photo = props.photo || p.photo;
    var tile = h("div", { className: "op-appt-date", "aria-hidden": "true" }, h("span", { className: "op-appt-month" }, MONTHS[d.getMonth()].slice(0, 3)), h("span", { className: "op-appt-day" }, d.getDate()));
    return h(Surface, { as: "article", className: "op-appt", actions: props.actions },
      h("div", { className: "op-appt-main" },
        who ? h(Avatar, { name: who, src: photo, large: true }) : tile,
        h("div", { className: "op-appt-body" },
          h("div", { className: "op-appt-head" },
            h("h" + (props.headingLevel || 3), { className: "op-appt-title" }, who || props.title),
            props.status ? h(StatusStamp, { status: props.status, tone: props.tone, label: props.label, small: true }) : null),
          h("p", { className: "op-appt-sub" }, who ? [role ? h("span", { key: "r", className: "op-appt-role" }, role) : null, h("span", { key: "k", className: "op-appt-kind" }, props.title)] : props.subtitle ? h("span", { className: "op-appt-role" }, props.subtitle) : null),
          h(MetaList, { className: "op-appt-facts", items: [{ icon: "calendar", text: t("dateAtTime", { date: longDate(d), time: props.time }) }, props.location ? { icon: "pin", text: props.location } : null] }))),);
  }

  function TimeSlots(props) {
    var name = useUid("op-slots-", props.name);
    var s1 = React.useState(props.defaultValue != null ? props.defaultValue : null), inner = s1[0], setInner = s1[1];
    var value = props.value !== undefined ? props.value : inner;
    var slots = (props.slots || []).map(function (x) { return typeof x === "string" ? { value: x, label: x } : x; });
    return h(Fieldset, { bare: true, className: "op-slots", legendClassName: "op-slots-legend", legend: props.label, hint: props.hint, error: props.error, required: props.required, disabled: props.disabled, id: name + "-fs" },
      slots.length ? h("div", { className: "op-slots-grid" }, slots.map(function (o) {
        return h("label", { key: o.value, className: cx("op-slot", o.disabled && "op-slot--off") },
          h("input", { type: "radio", name: name, value: o.value, className: "op-slot-input", checked: value === o.value, disabled: o.disabled, required: props.required, onChange: function () { if (props.value === undefined) setInner(o.value); if (props.onChange) props.onChange(o.value); } }),
          h("span", { className: "op-slot-text" }, o.label));
      })) : h("p", { className: "op-field-hint" }, props.emptyText || t("noTimes")));
  }

  /* ---- Form primitives: FieldShell, Fieldset, Textarea, Checkbox, RadioGroup, Switch ---- */
  function Flag(props) { return props.required ? h("span", { className: "op-field-flag" }, t("required")) : props.optional ? h("span", { className: "op-field-flag" }, t("optional")) : null; }
  /* a click on the padding or the symbol of a boxed input puts the cursor in the input */
  function focusInside(e) { if (e.target.closest("button, a")) return; var el = e.currentTarget.querySelector("input"); if (el && e.target !== el && !el.disabled) el.focus(); }
  function Message(props, id) {
    return props.error ? h("p", { id: id, className: "op-field-error", role: "alert" }, h(Icon, { name: "alert" }), props.error)
      : props.hint ? h("p", { id: id, className: "op-field-hint" }, props.hint) : null;
  }
  function FieldShell(props, control, id) {
    return h("div", { className: "op-field" },
      h("label", { className: cx("op-field-label op-kicker", props.hideLabel && "op-sr"), htmlFor: id }, props.label, Flag(props)),
      control,
      Message(props, id + "-hint"));
  }
  function useUid(prefix, given) {
    var ref = React.useRef(null);
    if (ref.current === null) ref.current = prefix + (++fieldId);
    return given || ref.current;
  }

  /** A group of related controls in a bordered box. The title sits on the top edge at the start and Required or Optional at the end, each with room either side. `bare` drops the box for a small label above the controls (RadioGroup, TimeSlots). Disabling it disables everything inside. */
  function Fieldset(props) {
    var id = useUid("op-fs-", props.id), hintId = id + "-hint", msg = Message(props, hintId), bare = !!props.bare;
    return h("fieldset", { className: cx("op-fieldset", !bare && "op-fieldset--box", props.className), disabled: props.disabled, "aria-describedby": props.error || props.hint ? hintId : undefined, "aria-invalid": props.error ? "true" : undefined },
      props.legend ? h("legend", { className: cx("op-fieldset-legend", bare && "op-kicker", props.legendClassName) },
        h("span", { className: "op-fieldset-title" }, props.legend), bare ? null : h("span", { className: "op-fieldset-rule", "aria-hidden": "true" }), Flag(props)) : null,
      bare ? h(React.Fragment, null, props.children, msg) : h("div", { className: "op-fieldset-body" }, props.children, msg));
  }

  function Textarea(props) {
    var id = useUid("op-textarea-", props.id);
    return FieldShell(props, h("textarea", Object.assign({
      id: id, className: "op-input op-textarea", rows: props.rows || 4, placeholder: props.placeholder, defaultValue: props.defaultValue, value: props.value,
      disabled: props.disabled, required: props.required, "aria-invalid": props.error ? "true" : undefined,
      onChange: function (e) { if (props.onChange) props.onChange(e.target.value, e); }
    }, inputAttrs(props, props.error || props.hint ? id + "-hint" : ""))), id);
  }

  /** A single checkbox. onChange receives the checked state first, then the event. */
  function Checkbox(props) {
    var id = useUid("op-check-", props.id), ref = React.useRef(null), errId = id + "-hint";
    React.useEffect(function () { if (ref.current) ref.current.indeterminate = !!props.indeterminate; });
    var label = h("label", { className: cx("op-choice", props.bare && "op-choice--bare", props.disabled && "op-choice--disabled"), htmlFor: id },
      h("input", Object.assign({ ref: mergeRefs(ref, props.inputRef), id: id, type: "checkbox", className: "op-check", defaultChecked: props.defaultChecked, checked: props.checked, value: props.value, required: props.required, disabled: props.disabled, name: props.name,
        "aria-invalid": props.error ? "true" : undefined, "aria-describedby": props.error ? errId : undefined,
        onChange: function (e) { if (props.onChange) props.onChange(e.target.checked, e); } })),
      props.bare ? h("span", { className: "op-sr" }, props.label)
        : h("span", { className: "op-choice-text" }, props.label, props.description ? h("span", { className: "op-choice-desc" }, props.description) : null));
    return props.error && !props.bare ? h("div", { className: "op-choice-wrap" }, label, Message({ error: props.error }, errId)) : label;
  }

  function RadioGroup(props) {
    var name = useUid("op-radio-", props.name), s = React.useState(props.defaultValue), picked = s[0], setPicked = s[1];
    var current = props.value !== undefined ? props.value : picked;
    var options = (props.options || []).map(function (o) { return typeof o === "string" ? { value: o, label: o } : o; });
    return h(Fieldset, { bare: true, className: "op-radiogroup", legendClassName: "op-radiogroup-legend", legend: props.label, hint: props.hint, error: props.error, required: props.required, optional: props.optional, disabled: props.disabled, id: name + "-fs" },
      options.map(function (o) {
        var open = o.reveal && current === o.value;
        return h(React.Fragment, { key: o.value },
          h("label", { className: cx("op-choice", o.disabled && "op-choice--disabled", open && "op-choice--open") },
            h("input", { type: "radio", className: "op-radio", name: name, value: o.value, required: props.required, defaultChecked: props.defaultValue === o.value, checked: props.value !== undefined ? props.value === o.value : undefined, onChange: function (e) { setPicked(o.value); if (props.onChange) props.onChange(o.value, e); }, disabled: o.disabled }),
            h("span", { className: "op-choice-text" }, o.label, o.description ? h("span", { className: "op-choice-desc" }, o.description) : null)),
          open ? h("div", { className: "op-choice-reveal" }, o.reveal) : null);
      }));
  }

  /** An on-off switch. onChange receives the new state first, then the event. */
  function Switch(props) {
    var id = useUid("op-switch-", props.id);
    return h("label", { className: cx("op-choice op-switch", props.disabled && "op-choice--disabled"), htmlFor: id },
      h("input", { ref: props.inputRef, id: id, type: "checkbox", role: "switch", className: "op-switch-input", name: props.name, value: props.value, defaultChecked: props.defaultChecked, checked: props.checked, onChange: function (e) { if (props.onChange) props.onChange(e.target.checked, e); }, disabled: props.disabled }),
      h("span", { className: "op-switch-track", "aria-hidden": "true" }),
      h("span", { className: "op-choice-text" }, props.label, props.description ? h("span", { className: "op-choice-desc" }, props.description) : null));
  }

  /* ---- Link, Spinner, Panel ---- */
  function Link(props) {
    return h("a", { className: "op-link", href: props.href, target: props.external ? "_blank" : undefined, rel: props.external ? "noreferrer" : undefined }, props.children);
  }

  function Spinner(props) {
    return h("span", { className: cx("op-spinner", props.block && "op-spinner--block"), role: "status" },
      h("svg", { className: "op-spinner-ring", viewBox: "0 0 24 24", "aria-hidden": "true" }, h("circle", { cx: 12, cy: 12, r: 9 })),
      h("span", { className: props.label ? "op-spinner-label" : "op-sr" }, props.label || t("loading")));
  }

  function Panel(props) {
    return h(Surface, { as: "section", className: "op-panel" },
      props.title || props.action ? h("header", { className: "op-panel-head" },
        h("div", null, props.kicker ? h("p", { className: "op-kicker", style: { margin: 0 } }, props.kicker) : null, props.title ? h("h" + (props.headingLevel || 3), { className: "op-panel-title" }, props.title) : null),
        props.action || null) : null,
      h("div", { className: "op-panel-body" }, props.children));
  }

  /* ---- Tabs ---- */
  function Tabs(props) {
    var items = props.items || [];
    var state = React.useState(props.defaultValue || (items[0] && items[0].id));
    var current = props.value !== undefined ? props.value : state[0];
    var uid = useUid("op-tabs-");
    function select(id) { state[1](id); if (props.onChange) props.onChange(id); }
    function onKey(e) {
      var i = items.findIndex(function (it) { return it.id === current; });
      var next = e.key === "ArrowRight" ? (i + 1) % items.length : e.key === "ArrowLeft" ? (i - 1 + items.length) % items.length : e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : -1;
      if (next < 0) return;
      e.preventDefault(); select(items[next].id);
      var el = document.getElementById(uid + "-tab-" + items[next].id); if (el) el.focus();
    }
    var active = items.filter(function (it) { return it.id === current; })[0];
    return h("div", { className: "op-tabs" },
      h("div", { className: "op-tablist", role: "tablist", onKeyDown: onKey },
        items.map(function (it) {
          return h("button", { key: it.id, id: uid + "-tab-" + it.id, type: "button", role: "tab", className: "op-tab", "aria-selected": it.id === current ? "true" : "false", "aria-controls": uid + "-panel", tabIndex: it.id === current ? 0 : -1, onClick: function () { select(it.id); } },
            it.label, it.count != null ? h("span", { className: "op-tab-count" }, it.count) : null);
        })),
      active && active.content ? h("div", { key: active.id, id: uid + "-panel", role: "tabpanel", className: "op-tabpanel", "aria-labelledby": uid + "-tab-" + active.id }, active.content) : null);
  }

  /* ---- Dialog ---- */
  function Dialog(props) {
    var ref = React.useRef(null);
    var titleId = useUid("op-dialog-title-");
    React.useEffect(function () {
      var el = ref.current; if (!el) return;
      if (props.open && !el.open) { if (props.inline) el.show(); else el.showModal(); }
      if (!props.open && el.open) el.close();
    }, [props.open, props.inline]);
    return h("dialog", { ref: ref, className: cx("op-dialog", props.inline && "op-dialog--inline"), "aria-labelledby": titleId, onClose: props.onClose, onCancel: props.onClose },
      h("header", { className: "op-dialog-head" },
        h("h" + (props.headingLevel || 2), { id: titleId, className: "op-dialog-title" }, props.title),
        h(IconButton, { icon: "x", label: t("close"), onClick: props.onClose })),
      h("div", { className: "op-dialog-body" }, props.children),
      props.actions ? h(Actions, { as: "footer", bar: true, className: "op-dialog-foot" }, props.actions) : null);
  }

  /* ---- Notice (inline message), built on Icon, Button and IconButton ---- */
  var TONE_ICON = { info: "info", success: "check", warning: "alert", danger: "alert" };
  function Notice(props) {
    var tone = props.tone || "info", actions = props.actions || props.action;
    return h("div", { className: cx("op-notice", tone !== "info" && "op-notice--" + tone, actions && "op-notice--actions", props.className), role: props.role === false ? undefined : props.role || (tone === "danger" ? "alert" : "status") },
      h("div", { className: "op-notice-grid" },
        h("span", { className: "op-notice-icon" }, h(Icon, { name: props.icon || TONE_ICON[tone] })),
        h("div", { className: "op-notice-body" },
          h(props.headingLevel ? "h" + props.headingLevel : "p", { id: props.titleId, className: "op-notice-title" }, props.title),
          props.children ? h("div", { className: "op-notice-text" }, props.children) : null),
        actions ? h(Actions, { className: "op-notice-actions" }, actions) : null,
        props.onDismiss ? h("span", { className: "op-notice-dismiss" }, h(IconButton, { icon: "x", label: t("dismiss"), onClick: props.onDismiss })) : null));
  }

  /* ---- Popover and Menu: one floating panel, placed under their trigger ---- */
  var popoverCount = 0;
  function usePopover(prefix) {
    var idRef = React.useRef(null);
    if (idRef.current === null) idRef.current = prefix + (++popoverCount);
    var button = React.useRef(null);
    var panel = React.useRef(null);
    React.useEffect(function () {
      var el = panel.current;
      if (!el) return;
      function place(e) {
        if (e.newState !== "open" || !button.current) return;
        var rect = button.current.getBoundingClientRect();
        el.style.left = Math.max(16, Math.min(rect.left, window.innerWidth - el.offsetWidth - 16)) + "px";
        el.style.top = (rect.bottom + 8) + "px";
        el.style.maxHeight = Math.max(160, window.innerHeight - rect.bottom - 24) + "px";
      }
      el.addEventListener("toggle", place);
      return function () { el.removeEventListener("toggle", place); };
    }, []);
    return { id: idRef.current, button: button, panel: panel };
  }

  /** A term that opens a floating panel with a title, body and optional actions. */
  function Popover(props) {
    var p = usePopover("op-popover-");
    return h(React.Fragment, null,
      h("button", { ref: p.button, type: "button", className: props.className || "op-linkbtn", popovertarget: p.id, "aria-label": props.label }, props.className ? null : h(Icon, { name: "info", small: true }), props.trigger),
      h("div", { ref: p.panel, id: p.id, popover: "auto", className: "op-popover", role: "dialog", "aria-label": props.title || props.label },
        props.title ? h("header", { className: "op-pop-head" }, h("h" + (props.headingLevel || 3), { className: "op-pop-title" }, props.title), h(IconButton, { icon: "x", label: t("close"), popoverTarget: p.id, popoverAction: "hide" })) : null,
        h("div", { className: "op-pop-body" }, props.children),
        props.actions ? h(Actions, { bar: true }, props.actions) : null));
  }

  /** A button that opens a list of actions. Arrow keys move between items. */
  function Menu(props) {
    var p = usePopover("op-menu-");
    React.useEffect(function () {
      var el = p.panel.current; if (!el) return;
      function onToggle(e) { if (e.newState === "open") { var first = el.querySelector("[role=menuitem]:not([disabled])"); if (first) first.focus(); } }
      el.addEventListener("toggle", onToggle);
      return function () { el.removeEventListener("toggle", onToggle); };
    }, []);
    function onKey(e) {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      var items = Array.prototype.slice.call(p.panel.current.querySelectorAll("[role=menuitem]:not([disabled])"));
      var i = items.indexOf(document.activeElement);
      e.preventDefault();
      items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length].focus();
    }
    return h(React.Fragment, null,
      h("button", { ref: p.button, type: "button", className: cx("op-btn", "op-btn--" + (props.variant || "outline")), popovertarget: p.id, "aria-haspopup": "menu" }, props.icon ? h(Icon, { name: props.icon }) : null, props.label, h(Icon, { name: "chevron-down" })),
      h("div", { ref: p.panel, id: p.id, popover: "auto", className: "op-popover op-menu", role: "menu", onKeyDown: onKey },
        (props.items || []).map(function (it, i) {
          return it.divider ? h("hr", { key: "d" + i, className: "op-divider" }) :
            h("button", { key: it.label, type: "button", role: "menuitem", className: cx("op-menu-item", it.danger && "op-menu-item--danger"), disabled: it.disabled, onClick: function () { if (it.onClick) it.onClick(); p.panel.current.hidePopover(); } },
              it.icon ? h(Icon, { name: it.icon }) : null, it.label);
        })));
  }

  /* ---- Typography ---- */
  function Heading(props) {
    var level = props.level || 2;
    return h("div", { className: "op-heading" },
      props.kicker ? h("p", { className: "op-kicker", style: { margin: 0 } }, props.kicker) : null,
      h("h" + level, { className: "op-h op-h" + level }, props.children));
  }
  function Text(props) {
    var v = props.variant || "body";
    return h(props.as || "p", { className: cx("op-text", "op-text--" + v, props.muted && "op-text--muted") }, props.children);
  }
  function Divider(props) {
    if (!props.label) return h("hr", { className: "op-divider" });
    return h("div", { className: "op-divider-label", role: "separator" }, h("span", { className: "op-kicker" }, props.label));
  }

  /* ---- Navigation: Breadcrumb, Pagination, NavList, Stepper ---- */
  function Breadcrumb(props) {
    var items = props.items || [];
    return h("nav", { className: "op-crumbs", "aria-label": t("breadcrumb") }, h("ol", null,
      items.map(function (it, i) {
        var last = i === items.length - 1;
        return h("li", { key: it.label }, last ? h("span", { "aria-current": "page", className: "op-crumb-current" }, it.label) : h("a", { className: "op-crumb", href: it.href }, it.label),
          last ? null : h(Icon, { name: "chevron-right", small: true }));
      })));
  }

  function Pagination(props) {
    var page = props.page, count = props.pageCount, set = props.onChange || function () {};
    var pages = [];
    for (var i = 1; i <= count; i++) {
      if (i === 1 || i === count || Math.abs(i - page) <= 1) pages.push(i);
      else if (pages[pages.length - 1] !== "gap") pages.push("gap");
    }
    pages = pages.map(function (n, k) { return n === "gap" && typeof pages[k - 1] === "number" && typeof pages[k + 1] === "number" && pages[k + 1] - pages[k - 1] === 2 ? pages[k - 1] + 1 : n; });
    return h("nav", { className: "op-pager", "aria-label": t("pagination") },
      h(Button, { variant: "outline", icon: "chevron-left", disabled: page <= 1, onClick: function () { set(page - 1); } }, t("previous")),
      h("ul", { className: "op-pages" }, pages.map(function (n, i) {
        return h("li", { key: i }, n === "gap" ? h("span", { className: "op-page-gap", "aria-hidden": "true" }, "…")
          : h("button", { type: "button", className: "op-page", "aria-current": n === page ? "page" : undefined, "aria-label": t("pageN", { n: n }), onClick: function () { set(n); } }, n));
      })),
      h(Button, { variant: "outline", disabled: page >= count, onClick: function () { set(page + 1); } }, t("next"), h(Icon, { name: "chevron-right" })));
  }

  function NavList(props) {
    return h("nav", { className: "op-nav", "aria-label": props.label || t("mainNav") }, h("ul", null, (props.items || []).map(function (it) {
      return h("li", { key: it.label }, h("a", { className: "op-nav-item", href: it.href || "#", "aria-current": it.current ? "page" : undefined },
        it.icon ? h(Icon, { name: it.icon }) : null, h("span", { className: "op-nav-label" }, it.label), it.count != null ? h("span", { className: "op-nav-count" }, it.count) : null));
    })));
  }

  function Stepper(props) {
    return h("ol", { className: "op-steps", "aria-label": props.label || t("progress") }, (props.steps || []).map(function (s, i) {
      return h("li", { key: s.label, className: "op-step", "data-state": s.state, "aria-current": s.state === "current" ? "step" : undefined },
        h("span", { className: "op-step-dot" }, s.state === "done" ? h(Icon, { name: "check", small: true }) : i + 1),
        h("span", { className: "op-step-label" }, s.label, s.state === "done" ? h("span", { className: "op-sr" }, " (" + t("done") + ")") : null));
    }));
  }

  /* ---- Display: Avatar, Progress, Skeleton, Accordion ---- */
  /** Initials by default; pass `src` for a photo (it falls back to initials if the image fails). */
  function Avatar(props) {
    var parts = String(props.name || "?").split(/\s+/).filter(Boolean);
    var initials = (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
    var s = React.useState(false), failed = s[0], setFailed = s[1];
    return h("span", { className: cx("op-avatar", props.small && "op-avatar--s", props.large && "op-avatar--l"), role: "img", "aria-label": props.name },
      props.src && !failed ? h("img", { className: "op-avatar-img", src: props.src, alt: "", onError: function () { setFailed(true); } }) : initials);
  }

  function Progress(props) {
    var max = props.max || 100, pct = Math.max(0, Math.min(100, (props.value / max) * 100));
    return h("div", { className: "op-progress" },
      h("div", { className: "op-progress-head" }, h("span", { className: "op-progress-label" }, props.label), h("span", { className: "op-progress-value" }, props.valueText || Math.round(pct) + "%")),
      h("div", { className: "op-progress-track", role: "progressbar", "aria-label": props.label, "aria-valuemin": 0, "aria-valuemax": max, "aria-valuenow": props.value }, h("div", { className: "op-progress-fill", style: { width: pct + "%" } })));
  }

  /** A bar that slides while something of unknown length loads. For a known amount, use Progress. */
  function LoadingBar(props) {
    return h("div", { className: "op-loadbar", role: "progressbar", "aria-label": props.label || t("loading"), "aria-busy": "true" }, h("span", { className: "op-loadbar-fill" }));
  }

  /** One placeholder block while content loads. Size it to what is coming: `height` and `width`, or `circle` for a photo. */
  function Skeleton(props) {
    var st = { height: props.height == null ? 96 : props.height };
    if (props.width != null) st.width = props.width;
    return h("div", { className: cx("op-skeleton", props.circle && "op-skeleton--circle"), style: st, role: "status", "aria-busy": "true" }, h("span", { className: "op-sr" }, t("loading")));
  }

  /* ---- OtpField: a one-time code, one box per character ---- */
  function OtpField(props) {
    var len = props.length || 6, numeric = props.type !== "text", group = props.groupSize || 0;
    var id = useUid("op-otp-", props.id);
    var s1 = React.useState(props.defaultValue || ""), inner = s1[0], setInner = s1[1];
    var refs = React.useRef([]);
    function clean(s) { s = String(s || ""); s = numeric ? s.replace(/\D/g, "") : s.replace(/[^a-z0-9]/gi, "").toUpperCase(); return s.slice(0, len); }
    var value = clean(props.value !== undefined ? props.value : inner);
    /* The latest code, updated the moment it changes: focus moves before React re-renders, so handlers must not read a stale render. */
    var live = React.useRef(value);
    live.current = value;
    function commit(next) {
      next = clean(next);
      var prev = live.current;
      live.current = next;
      if (props.value === undefined) setInner(next);
      if (props.onChange) props.onChange(next);
      if (next.length === len && prev !== next && props.onComplete) props.onComplete(next);
    }
    function focusAt(i) { var el = refs.current[Math.max(0, Math.min(len - 1, i))]; if (el) el.focus(); }
    function without(v, i) { return v.slice(0, i) + v.slice(i + 1); }
    function put(i, text) {
      var v = live.current, chars = clean(text);
      if (!chars) return;
      var from = chars.length >= len ? 0 : Math.min(i, v.length);
      commit(v.slice(0, from) + chars);
      focusAt(from + chars.length);
    }
    function onInput(i, e) {
      var v = live.current, raw = e.target.value;
      if (!raw) { commit(without(v, i)); return; }
      /* typing over a filled box gives two characters: keep the new one, wherever the caret was */
      if (v[i] && raw.length === 2) { var k = raw.indexOf(v[i]); raw = k >= 0 ? without(raw, k) : raw.charAt(1); }
      var chars = clean(raw);
      if (!chars) return;
      if (chars.length === 1 && i < v.length) { commit(v.slice(0, i) + chars + v.slice(i + 1)); focusAt(i + 1); }
      else put(i, chars);
    }
    function onKey(i, e) {
      var v = live.current, k = e.key;
      if (k === "Backspace") { e.preventDefault(); if (v[i]) { commit(without(v, i)); focusAt(i); } else if (i > 0) { commit(without(v, i - 1)); focusAt(i - 1); } }
      else if (k === "Delete") { e.preventDefault(); commit(without(v, i)); }
      else if (k === "ArrowLeft") { e.preventDefault(); focusAt(i - 1); }
      else if (k === "ArrowRight") { e.preventDefault(); focusAt(Math.min(i + 1, v.length)); }
      else if (k === "Home") { e.preventDefault(); focusAt(0); }
      else if (k === "End") { e.preventDefault(); focusAt(v.length); }
    }
    React.useEffect(function () { if (props.autoFocus) focusAt(live.current.length); }, []);
    var hintId = id + "-hint", boxes = [];
    for (var i = 0; i < len; i++) (function (i) {
      if (group && i > 0 && i % group === 0) boxes.push(h("span", { key: "s" + i, className: "op-otp-sep", "aria-hidden": "true" }));
      boxes.push(h("input", {
        key: i, ref: function (el) { refs.current[i] = el; }, className: "op-input op-otp-box", type: "text", inputMode: numeric ? "numeric" : "text",
        autoComplete: i === 0 ? "one-time-code" : "off", autoCapitalize: "characters", spellCheck: false, value: value[i] || "", disabled: props.disabled, "data-filled": value[i] ? "" : undefined,
        "aria-label": t(numeric ? "otpDigit" : "otpChar", { n: i + 1, total: len }), "aria-invalid": props.error ? "true" : undefined, "aria-describedby": props.error || props.hint ? hintId : undefined,
        onChange: function (e) { onInput(i, e); }, onKeyDown: function (e) { onKey(i, e); },
        onFocus: function () { if (i > live.current.length) focusAt(live.current.length); },
        onPaste: function (e) { e.preventDefault(); put(i, e.clipboardData.getData("text")); }
      }));
    })(i);
    return h("div", { className: "op-field" },
      h("span", { id: id + "-label", className: "op-field-label op-kicker" }, props.label || t("verificationCode")),
      h("div", { role: "group", "aria-labelledby": id + "-label", className: "op-otp" }, boxes, props.name ? h("input", { type: "hidden", name: props.name, value: value }) : null),
      props.error ? h("p", { id: hintId, className: "op-field-error", role: "alert" }, h(Icon, { name: "alert" }), props.error)
        : props.hint ? h("p", { id: hintId, className: "op-field-hint" }, props.hint) : null);
  }

  function Accordion(props) {
    var group = useUid("op-acc-");
    return h("div", { className: "op-accordion" }, (props.items || []).map(function (it) {
      return h(Disclosure, { key: it.id, variant: "card", title: it.title, meta: it.meta, defaultOpen: it.defaultOpen, group: props.multiple ? undefined : group }, it.content);
    }));
  }

  /* ---- Feedback: Toast, Tooltip ---- */
  function Toast(props) {
    var tone = props.tone || "info", actions = props.action || props.actions;
    return h(Surface, { tone: "float", className: cx("op-toast", "op-toast--" + tone, actions && "op-toast--actions"), role: tone === "danger" ? "alert" : "status" },
      h("div", { className: "op-notice-grid" },
        h("span", { className: "op-notice-icon" }, h(Icon, { name: props.icon || TONE_ICON[tone] })),
        h("div", { className: "op-notice-body op-toast-body" }, h("p", { className: "op-toast-title" }, props.title), props.children ? h("p", { className: "op-toast-text" }, props.children) : null),
        actions ? h(Actions, { className: "op-notice-actions" }, actions) : null,
        props.onClose ? h("span", { className: "op-notice-dismiss" }, h(IconButton, { icon: "x", label: t("dismiss"), onClick: props.onClose })) : null));
  }

  function Tooltip(props) {
    var id = useUid("op-tip-");
    var hid = React.useState(false), hidden = hid[0], setHidden = hid[1];
    return h("span", { className: "op-tip", "data-hidden": hidden ? "" : undefined,
      onKeyDown: function (e) { if (e.key === "Escape") setHidden(true); }, onMouseLeave: function () { setHidden(false); }, onBlur: function () { setHidden(false); } },
      React.cloneElement(React.Children.only(props.children), { "aria-describedby": id }),
      h("span", { id: id, role: "tooltip", className: "op-tip-bubble" }, props.label));
  }

  /* ---- Forms, continued: FileUpload ---- */
  function FileUpload(props) {
    var id = useUid("op-file-");
    var st = React.useState([]), files = st[0], setFiles = st[1];
    var ov = React.useState(false), over = ov[0], setOver = ov[1];
    function take(list) { var arr = Array.prototype.slice.call(list || []); setFiles(arr); if (props.onFiles) props.onFiles(arr); }
    return FieldShell(props, h("div", null,
      h("label", { htmlFor: id, className: cx("op-drop", over && "op-drop--over", props.disabled && "op-drop--disabled"),
        onDragOver: function (e) { e.preventDefault(); if (!props.disabled) setOver(true); }, onDragLeave: function () { setOver(false); },
        onDrop: function (e) { e.preventDefault(); setOver(false); if (!props.disabled) take(e.dataTransfer.files); } },
        h(Icon, { name: "upload" }),
        h("span", { className: "op-drop-main" }, t("dragHere") + " ", h("span", { className: "op-drop-pick" }, t("chooseOne"))),
        props.accept ? h("span", { className: "op-drop-hint" }, props.accept.replace(/\./g, "").replace(/,/g, ", ").toUpperCase()) : null),
      h("input", { id: id, type: "file", name: props.name, className: "op-drop-input", accept: props.accept, multiple: props.multiple, disabled: props.disabled, required: props.required, "aria-invalid": props.error ? "true" : undefined, "aria-describedby": props.error || props.hint ? id + "-hint" : undefined, onChange: function (e) { take(e.target.files); } }),
      files.length ? h("ul", { className: "op-files" }, files.map(function (f) { return h("li", { key: f.name }, h(Icon, { name: "file" }), h("span", { className: "op-file-name" }, f.name), h("span", { className: "op-file-size" }, Math.max(1, Math.round(f.size / 1024)) + " KB")); })) : null), id);
  }

  /* ================= Dropdown machinery ================= */
  function normOptions(options) { return (options || []).map(function (o) { return typeof o === "string" ? { value: o, label: o } : o; }); }

  /** Keeps a manual popover under its anchor: matches the anchor width unless fit, flips above when short of room, closes on an outside press. */
  function useFloating(open, onClose, anchorRef, panelRef, key, fit) {
    React.useEffect(function () {
      var panel = panelRef.current, anchor = anchorRef.current;
      if (!panel || !anchor) return;
      var isOpen = false;
      try { isOpen = panel.matches(":popover-open"); } catch (e) {}
      if (!open) { if (isOpen) { try { panel.hidePopover(); } catch (e) {} } return; }
      if (!isOpen) { try { panel.showPopover(); } catch (e) {} }
      function place() {
        var r = anchor.getBoundingClientRect();
        if (!fit) { panel.style.minWidth = r.width + "px"; panel.style.width = r.width + "px"; }
        var below = window.innerHeight - r.bottom - 12, above = r.top - 12;
        var hgt = panel.offsetHeight;
        var up = hgt > below && above > below;
        panel.style.left = Math.max(8, Math.min(r.left, window.innerWidth - panel.offsetWidth - 8)) + "px";
        panel.style.top = (up ? Math.max(8, r.top - hgt - 6) : r.bottom + 6) + "px";
      }
      place();
      function onDown(e) { if (panel.contains(e.target) || anchor.contains(e.target)) return; onClose(); }
      window.addEventListener("resize", place);
      window.addEventListener("scroll", place, true);
      document.addEventListener("pointerdown", onDown, true);
      return function () {
        window.removeEventListener("resize", place);
        window.removeEventListener("scroll", place, true);
        document.removeEventListener("pointerdown", onDown, true);
      };
    }, [open, key]);
  }

  function stepEnabled(list, start, dir) {
    var n = list.length;
    for (var step = 1; step <= n; step++) {
      var i = ((start + dir * step) % n + n) % n;
      if (!list[i].disabled) return i;
    }
    return -1;
  }

  function highlight(label, q) {
    if (!q) return label;
    var i = label.toLowerCase().indexOf(q);
    if (i < 0) return label;
    return [label.slice(0, i), h("mark", { key: "m" }, label.slice(i, i + q.length)), label.slice(i + q.length)];
  }

  function optionRows(id, norm, active, isSelected, choose, setActive, q) {
    var items = [], last;
    norm.forEach(function (o, i) {
      if (o.group && o.group !== last) { items.push(h("li", { key: "g" + i, role: "presentation", className: "op-opt-group" }, o.group)); last = o.group; }
      var sel = isSelected(o);
      items.push(h("li", {
        key: o.value, id: id + "-o" + i, role: "option", "aria-selected": sel ? "true" : "false", "aria-disabled": o.disabled ? "true" : undefined,
        className: cx("op-opt", i === active && "op-opt--active", sel && "op-opt--selected", o.disabled && "op-opt--disabled"),
        onMouseDown: function (e) { e.preventDefault(); }, onClick: function () { choose(o); },
        onMouseMove: function () { if (i !== active && !o.disabled) setActive(i); }
      },
        o.icon ? h(Icon, { name: o.icon }) : null,
        h("span", { className: "op-opt-text" }, h("span", { className: "op-opt-label" }, highlight(o.label, q)), o.description ? h("span", { className: "op-opt-desc" }, highlight(o.description, q)) : null),
        sel ? h(Icon, { name: "check", bold: true }) : null));
    });
    return items;
  }

  /* ---- Select: a button that opens a listbox ---- */
  function Select(props) {
    var id = useUid("op-sel-", props.id), listId = id + "-list";
    var norm = normOptions(props.options);
    var s1 = React.useState(props.defaultValue != null ? props.defaultValue : ""), inner = s1[0], setInner = s1[1];
    var value = props.value !== undefined ? props.value : inner;
    var s2 = React.useState(false), open = s2[0], setOpen = s2[1];
    var s3 = React.useState(-1), active = s3[0], setActive = s3[1];
    var anchor = React.useRef(null), panel = React.useRef(null), type = React.useRef({ s: "", t: 0 });
    var selIndex = -1;
    norm.forEach(function (o, i) { if (o.value === value) selIndex = i; });
    var selected = norm[selIndex];
    function close() { setOpen(false); }
    useFloating(open, close, anchor, panel, norm.length);
    function openList() { if (props.disabled) return; setOpen(true); setActive(selIndex >= 0 ? selIndex : stepEnabled(norm, -1, 1)); }
    function choose(o) {
      if (!o || o.disabled) return;
      if (props.value === undefined) setInner(o.value);
      if (props.onChange) props.onChange(o.value);
      setOpen(false);
    }
    React.useEffect(function () {
      if (open && active >= 0) { var el = document.getElementById(id + "-o" + active); if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" }); }
    }, [open, active]);
    function onKey(e) {
      var k = e.key;
      if (k === "ArrowDown" || k === "ArrowUp") { e.preventDefault(); if (!open) openList(); else setActive(stepEnabled(norm, active, k === "ArrowDown" ? 1 : -1)); }
      else if (k === "Home" || k === "End") { if (open) { e.preventDefault(); setActive(k === "Home" ? stepEnabled(norm, -1, 1) : stepEnabled(norm, 0, -1)); } }
      else if (k === "Enter" || k === " ") { e.preventDefault(); if (open && active >= 0) choose(norm[active]); else openList(); }
      else if (k === "Escape") { if (open) { e.preventDefault(); e.stopPropagation(); close(); } }
      else if (k === "Tab") { close(); }
      else if (k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        var now = Date.now(), ty = type.current;
        ty.s = (now - ty.t > 700 ? "" : ty.s) + k.toLowerCase(); ty.t = now;
        var from = open ? active : selIndex, n = norm.length;
        for (var j = 0; j < n; j++) {
          var i = (from + j + (ty.s.length === 1 ? 1 : 0)) % n;
          if (!norm[i].disabled && norm[i].label.toLowerCase().indexOf(ty.s) === 0) { if (!open) setOpen(true); setActive(i); break; }
        }
      }
    }
    var rows = optionRows(id, norm, active, function (o) { return o.value === value; }, choose, setActive, "");
    var control = h("div", { className: "op-sel" },
      h("button", {
        ref: anchor, id: id, type: "button", role: "combobox", className: "op-input op-sel-trigger", disabled: props.disabled,
        "aria-label": props.bare ? props.ariaLabel : undefined, "aria-haspopup": "listbox", "aria-expanded": open ? "true" : "false", "aria-controls": listId,
        "aria-activedescendant": open && active >= 0 ? id + "-o" + active : undefined,
        "aria-invalid": props.error ? "true" : undefined, "aria-describedby": props.error || props.hint ? id + "-hint" : undefined,
        onClick: function () { if (open) close(); else openList(); }, onKeyDown: onKey
      },
        selected ? h("span", { className: "op-sel-value" }, selected.icon ? h(Icon, { name: selected.icon }) : null, selected.label) : h("span", { className: "op-sel-placeholder" }, props.placeholder || t("select")),
        h(Icon, { name: "chevron-down", bold: true })),
      props.name ? h("input", { type: "hidden", name: props.name, value: value || "" }) : null,
      h("ul", { ref: panel, id: listId, role: "listbox", popover: "manual", className: "op-popover op-listpanel", tabIndex: -1, "aria-label": props.label }, rows));
    return props.bare ? control : FieldShell(props, control, id);
  }

  /* ---- Combobox, Autocomplete and MultiSelect: type to filter a list ---- */
  function Combobox(props) {
    var id = useUid("op-combo-", props.id), listId = id + "-list";
    var norm = normOptions(props.options);
    var multiple = !!props.multiple, free = !!props.freeText;
    var s1 = React.useState(props.defaultValue != null ? props.defaultValue : (multiple ? [] : "")), inner = s1[0], setInner = s1[1];
    var value = props.value !== undefined ? props.value : inner;
    function labelOf(v) { var f = norm.filter(function (o) { return o.value === v; })[0]; return f ? f.label : (free ? v : ""); }
    var s2 = React.useState(multiple ? "" : labelOf(value)), text = s2[0], setText = s2[1];
    var s3 = React.useState(false), typing = s3[0], setTyping = s3[1];
    var s4 = React.useState(false), openState = s4[0], setOpen = s4[1];
    var s5 = React.useState(0), active = s5[0], setActive = s5[1];
    var wrap = React.useRef(null), panel = React.useRef(null), input = React.useRef(null);
    React.useEffect(function () { if (!multiple && !typing) setText(labelOf(value)); }, [value]);
    var q = typing ? text.trim().toLowerCase() : "";
    var shown = props.filter ? norm.filter(function (o) { return props.filter(o, q); })
      : norm.filter(function (o) { return !q || o.label.toLowerCase().indexOf(q) >= 0 || (o.description || "").toLowerCase().indexOf(q) >= 0; });
    var hasList = shown.length > 0 || props.loading || !free;
    var open = openState && hasList && !props.disabled;
    function close() { setOpen(false); }
    useFloating(open, close, wrap, panel, shown.length + (props.loading ? "l" : ""));
    function commit(v) { if (props.value === undefined) setInner(v); if (props.onChange) props.onChange(v); }
    function pick(o) {
      if (!o || o.disabled) return;
      if (multiple) {
        var cur = value.slice(), i = cur.indexOf(o.value);
        if (i >= 0) cur.splice(i, 1); else cur.push(o.value);
        commit(cur); setText(""); setTyping(false); setActive(0);
        if (props.onInputChange) props.onInputChange("");
      } else {
        commit(free ? o.label : o.value); setText(o.label); setTyping(false); setOpen(false);
        if (props.onInputChange) props.onInputChange(o.label);
      }
    }
    function remove(v) { commit(value.filter(function (x) { return x !== v; })); }
    function clear() { commit(multiple ? [] : ""); setText(""); setTyping(false); if (props.onInputChange) props.onInputChange(""); if (input.current) input.current.focus(); }
    React.useEffect(function () {
      if (open) { var el = document.getElementById(id + "-o" + active); if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" }); }
    }, [open, active]);
    function onInput(e) {
      var v = e.target.value;
      setText(v); setTyping(true); setOpen(true); setActive(0);
      if (props.onInputChange) props.onInputChange(v);
      if (free && !multiple) commit(v);
    }
    function onKey(e) {
      var k = e.key;
      if (k === "ArrowDown" || k === "ArrowUp") {
        e.preventDefault();
        if (!openState) { setOpen(true); } else if (shown.length) setActive(stepEnabled(shown, active, k === "ArrowDown" ? 1 : -1));
      } else if (k === "Enter") { if (open && shown[active]) { e.preventDefault(); pick(shown[active]); } }
      else if (k === "Escape") { if (open) { e.preventDefault(); e.stopPropagation(); close(); } else if (text) { clear(); } }
      else if (k === "Backspace" && multiple && !text && value.length) { remove(value[value.length - 1]); }
    }
    function onBlur(e) {
      var rel = e.relatedTarget;
      if (rel && ((wrap.current && wrap.current.contains(rel)) || (panel.current && panel.current.contains(rel)))) return;
      setOpen(false); setTyping(false);
      if (!free) setText(multiple ? "" : labelOf(value));
    }
    var hasValue = multiple ? value.length > 0 : !!text;
    var rows = shown.length
      ? optionRows(id, shown, active, function (o) { return multiple ? value.indexOf(o.value) >= 0 : o.value === value; }, pick, setActive, q)
      : [h("li", { key: "none", role: "presentation", className: "op-opt-status" }, props.loading ? h(Spinner, { label: t("searching") }) : (props.emptyText || t("noMatches")))];
    var control = h("div", {
      ref: wrap, className: cx("op-input-wrap op-combo", multiple && "op-combo--multi"), "data-invalid": props.error ? "" : undefined, "data-disabled": props.disabled ? "" : undefined,
      onBlur: onBlur, onMouseDown: function (e) { if (e.target === wrap.current && input.current) { e.preventDefault(); input.current.focus(); } }
    },
      h("div", { className: "op-combo-main" }, multiple ? value.map(function (v) {
        return h("span", { key: v, className: "op-tag" }, labelOf(v), h("button", { type: "button", className: "op-tag-x", "aria-label": t("removeItem", { label: labelOf(v) }), disabled: props.disabled, onClick: function () { remove(v); } }, h(Icon, { name: "x", small: true })));
      }) : null,
      h("input", {
        ref: mergeRefs(input, props.inputRef), id: id, className: "op-input op-combo-input", type: "text", role: "combobox", autoComplete: props.autoComplete || "off", required: props.required && !(multiple && value.length), onBlur: props.onBlur, onFocus: props.onFocus, value: text, placeholder: multiple && value.length ? "" : props.placeholder, disabled: props.disabled,
        "aria-autocomplete": "list", "aria-expanded": open ? "true" : "false", "aria-controls": listId, "aria-activedescendant": open && shown[active] ? id + "-o" + active : undefined,
        "aria-invalid": props.error ? "true" : undefined, "aria-describedby": props.error || props.hint ? id + "-hint" : undefined,
        onChange: onInput, onKeyDown: onKey
      })),
      props.name ? (multiple ? value : [value]).map(function (v, k) { return h("input", { key: k, type: "hidden", name: props.name, value: v }); }) : null,
      h("div", { className: "op-combo-tail" }, hasValue && props.clearable !== false && !props.disabled ? h("button", { type: "button", className: "op-combo-btn", "aria-label": t("clear"), onMouseDown: function (e) { e.preventDefault(); }, onClick: clear }, h(Icon, { name: "x" })) : null,
      props.noToggle ? null : h("button", { type: "button", className: "op-combo-btn", tabIndex: -1, "aria-label": t("showOptions"), disabled: props.disabled, onMouseDown: function (e) { e.preventDefault(); }, onClick: function () { setOpen(!openState); if (input.current) input.current.focus(); } }, h(Icon, { name: "chevron-down", bold: true }))),
      h("ul", { ref: panel, id: listId, role: "listbox", popover: "manual", className: "op-popover op-listpanel", tabIndex: -1, "aria-label": props.label, "aria-multiselectable": multiple ? "true" : undefined }, rows));
    return FieldShell(props, control, id);
  }
  function Autocomplete(props) { return h(Combobox, Object.assign({ freeText: true, noToggle: true }, props)); }
  function MultiSelect(props) { return h(Combobox, Object.assign({ multiple: true }, props)); }

  /* ================= Dates: Calendar, DatePicker, DateRangePicker ================= */
  var MONTHS, DAYS, DAYS_SHORT, WEEK_START = 0, DATE_ORDER = ["month", "day", "year"], DATE_SEP = "/";
  /** Month and weekday names, week start and date order for the configured locale. */
  function rebuildNames() {
    var loc = CONFIG.locale;
    function names(opts, count, base) {
      var f = new Intl.DateTimeFormat(loc, Object.assign({ timeZone: "UTC" }, opts)), out = [];
      for (var i = 0; i < count; i++) out.push(f.format(new Date(base(i))));
      return out;
    }
    try {
      MONTHS = names({ month: "long" }, 12, function (i) { return Date.UTC(2021, i, 1); });
      DAYS = names({ weekday: "long" }, 7, function (i) { return Date.UTC(2021, 7, 1 + i); });
      DAYS_SHORT = names({ weekday: "short" }, 7, function (i) { return Date.UTC(2021, 7, 1 + i); }).map(function (n) { return /^en/i.test(loc) ? n.slice(0, 2) : n; });
      var li = new Intl.Locale(loc), wi = li.getWeekInfo ? li.getWeekInfo() : li.weekInfo;
      WEEK_START = wi && wi.firstDay ? wi.firstDay % 7 : 0;
      var parts = new Intl.DateTimeFormat(loc, { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "UTC" }).formatToParts(new Date(Date.UTC(2021, 10, 22)));
      DATE_ORDER = parts.filter(function (p) { return p.type === "month" || p.type === "day" || p.type === "year"; }).map(function (p) { return p.type; });
      var lit = parts.filter(function (p) { return p.type === "literal"; })[0];
      DATE_SEP = lit && lit.value.trim() ? lit.value.trim() : "/";
    } catch (e) {
      MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
      WEEK_START = 0; DATE_ORDER = ["month", "day", "year"]; DATE_SEP = "/";
    }
  }
  rebuildNames();
  function dateFormatLabel() { return CONFIG.messages.dateFormat || DATE_ORDER.map(function (p) { return p === "month" ? "MM" : p === "day" ? "DD" : "YYYY"; }).join(DATE_SEP); }
  function sod(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12); }
  function addD(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, 12); }
  function addM(d, n) {
    var nd = new Date(d.getFullYear(), d.getMonth() + n, 1, 12), dim = new Date(nd.getFullYear(), nd.getMonth() + 1, 0).getDate();
    nd.setDate(Math.min(d.getDate(), dim)); return nd;
  }
  function cmpD(a, b) { return sod(a).getTime() - sod(b).getTime(); }
  function dkey(d) { return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate(); }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function isoDate(d) { return d ? d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()) : ""; }
  function fmtDate(d) {
    if (!d) return "";
    var v = { month: pad2(d.getMonth() + 1), day: pad2(d.getDate()), year: String(d.getFullYear()) };
    return DATE_ORDER.map(function (p) { return v[p]; }).join(DATE_SEP);
  }
  function parseDate(s) {
    var m = /^(\d{1,4})[\/\-.\s]+(\d{1,2})[\/\-.\s]+(\d{1,4})$/.exec(String(s).trim());
    if (!m) return null;
    var v = {}, nums = [m[1], m[2], m[3]];
    DATE_ORDER.forEach(function (p, i) { v[p] = +nums[i]; });
    if (String(nums[DATE_ORDER.indexOf("year")]).length !== 4) return null;
    var d = new Date(v.year, v.month - 1, v.day, 12);
    return d.getMonth() === v.month - 1 && d.getDate() === v.day ? d : null;
  }

  function Calendar(props) {
    var range = props.mode === "range";
    var base = (range ? props.start : props.value) || props.month || new Date();
    var s1 = React.useState(sod(base)), focus = s1[0], setFocus = s1[1];
    var s2 = React.useState(null), hover = s2[0], setHover = s2[1];
    var s3 = React.useState("days"), view = s3[0], setView = s3[1];
    var s4 = React.useState(0), pick = s4[0], setPick = s4[1];
    var s5 = React.useState(0), yearPage = s5[0], setYearPage = s5[1];
    var uid = useUid("op-cal-");
    var want = React.useRef(null);
    var today = sod(new Date());
    var min = props.min, max = props.max;
    var cy = focus.getFullYear(), cm = focus.getMonth();
    var yLo = Math.min(cy, min ? min.getFullYear() : today.getFullYear() - 120), yHi = Math.max(cy, max ? max.getFullYear() : today.getFullYear() + 20);
    var first = new Date(cy, cm, 1, 12);
    var startCell = addD(first, -((first.getDay() - WEEK_START + 7) % 7));
    function off(d) { return (min && cmpD(d, min) < 0) || (max && cmpD(d, max) > 0) || (props.disabledDate && props.disabledDate(d)); }
    function isMarked(d) {
      var m = props.marked;
      if (!m) return false;
      if (typeof m === "function") return !!m(d);
      for (var k = 0; k < m.length; k++) if (cmpD(m[k], d) === 0) return true;
      return false;
    }
    function monthOff(y, m) { return (min && cmpD(new Date(y, m + 1, 0, 12), min) < 0) || (max && cmpD(new Date(y, m, 1, 12), max) > 0); }
    function yearOff(y) { return (min && y < min.getFullYear()) || (max && y > max.getFullYear()); }
    function clampDate(d) { if (min && cmpD(d, min) < 0) return sod(min); if (max && cmpD(d, max) > 0) return sod(max); return d; }
    function withMonthYear(y, m) { var dim = new Date(y, m + 1, 0, 12).getDate(); return clampDate(new Date(y, m, Math.min(focus.getDate(), dim), 12)); }

    function pickDay(d) {
      if (off(d)) return;
      if (!range) { if (props.onChange) props.onChange(d); return; }
      var st = props.start, en = props.end;
      if (!st || en || cmpD(d, st) < 0) { if (props.onRangeChange) props.onRangeChange({ start: d, end: null }); }
      else if (props.onRangeChange) props.onRangeChange({ start: st, end: d });
    }
    function openView(v) {
      setView(v);
      if (v === "months") { setPick(cm); want.current = uid + "-m-" + cm; }
      else { setPick(cy); want.current = uid + "-y-" + cy; }
    }
    function backToDays() { setView("days"); want.current = uid + "-" + dkey(focus); }
    /* one button opens the years; a year opens its months; a month opens its days. Back goes up one step. */
    function back() { if (view === "months") openView("years"); else backToDays(); }
    function chooseMonth(m) { if (monthOff(cy, m)) return; var nd = withMonthYear(cy, m); setFocus(nd); setView("days"); want.current = uid + "-" + dkey(nd); }
    function chooseYear(y) { if (yearOff(y)) return; var nd = withMonthYear(y, cm); setFocus(nd); setView("months"); setPick(nd.getMonth()); want.current = uid + "-m-" + nd.getMonth(); }

    function onDayKey(e) {
      var steps = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }, next = null;
      if (steps[e.key] !== undefined) next = addD(focus, steps[e.key]);
      else if (e.key === "Home") next = addD(focus, -((focus.getDay() - WEEK_START + 7) % 7));
      else if (e.key === "End") next = addD(focus, 6 - ((focus.getDay() - WEEK_START + 7) % 7));
      else if (e.key === "PageUp") next = addM(focus, e.shiftKey ? -12 : -1);
      else if (e.key === "PageDown") next = addM(focus, e.shiftKey ? 12 : 1);
      if (next) { e.preventDefault(); want.current = uid + "-" + dkey(next); setFocus(next); if (range && props.start && !props.end) setHover(next); }
    }
    function onPickKey(e) {
      var isMonths = view === "months", cols = 3, lo = isMonths ? 0 : yLo, hi = isMonths ? 11 : yHi, next = null;
      var steps = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -cols, ArrowDown: cols };
      if (steps[e.key] !== undefined) next = pick + steps[e.key];
      else if (e.key === "Home") next = lo; else if (e.key === "End") next = hi;
      else if (e.key === "PageUp" && !isMonths) next = pick - 12; else if (e.key === "PageDown" && !isMonths) next = pick + 12;
      else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); setView("days"); want.current = uid + "-" + dkey(focus); return; }
      if (next === null) return;
      e.preventDefault();
      next = Math.max(lo, Math.min(hi, next));
      want.current = uid + (isMonths ? "-m-" : "-y-") + next;
      setPick(next);
    }
    React.useEffect(function () {
      if (want.current) { var el = document.getElementById(want.current); if (el) { el.focus(); if (want.current.indexOf("-y-") > 0 && el.scrollIntoView) el.scrollIntoView({ block: "center" }); want.current = null; } }
    });

    var prevOff = min && cmpD(new Date(cy, cm, 0, 12), min) < 0;
    var nextOff = max && cmpD(new Date(cy, cm + 1, 1, 12), max) > 0;
    var picking = view !== "days";

    var head = h("div", { className: "op-cal-head" },
      picking ? h(IconButton, { icon: "chevron-left", label: t(view === "months" ? "backToYears" : "backToDays"), onClick: back }) : h(IconButton, { icon: "chevron-left", label: t("prevMonth"), onClick: function () { setFocus(clampDate(addM(focus, -1))); }, disabled: !!prevOff }),
      h("div", { className: "op-cal-title", "aria-live": "polite" },
        picking ? h("span", { className: "op-cal-range" }, t(view === "months" ? "chooseAMonth" : "chooseAYear", { year: cy }))
          : h("button", { type: "button", className: "op-cal-pick", "aria-expanded": "false", "aria-label": t("chooseDateNow", { month: MONTHS[cm], year: cy }), onClick: function () { openView("years"); } }, MONTHS[cm] + " " + cy, h(Icon, { name: "chevron-down", small: true }))),
      picking ? h("span", { className: "op-cal-gap" }) : h(IconButton, { icon: "chevron-right", label: t("nextMonth"), onClick: function () { setFocus(clampDate(addM(focus, 1))); }, disabled: !!nextOff }));

    var body;
    if (view === "days") {
      var rangeEnd = range ? (props.end || (props.start && hover && cmpD(hover, props.start) >= 0 ? hover : null)) : null;
      var rows = [];
      for (var w = 0; w < 6; w++) {
        var cells = [];
        for (var i = 0; i < 7; i++) {
          (function (d) {
            var isSel = range ? ((props.start && cmpD(d, props.start) === 0) || (props.end && cmpD(d, props.end) === 0)) : (props.value && cmpD(d, props.value) === 0);
            var inRange = range && props.start && rangeEnd && cmpD(d, props.start) > 0 && cmpD(d, rangeEnd) < 0;
            var dis = off(d), isF = cmpD(d, focus) === 0, mk = !dis && isMarked(d);
            cells.push(h("td", { key: dkey(d), role: "gridcell", "aria-selected": isSel || inRange ? "true" : "false", className: cx(inRange && "op-cal-in") },
              h("button", {
                id: uid + "-" + dkey(d), type: "button", tabIndex: isF ? 0 : -1, disabled: dis,
                className: cx("op-day", d.getMonth() !== cm && "op-day--out", cmpD(d, today) === 0 && "op-day--today", isSel && "op-day--sel", mk && "op-day--mark"),
                "aria-label": DAYS[d.getDay()] + ", " + MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear() + (cmpD(d, today) === 0 ? ", " + t("todaySuffix") : "") + (mk ? ", " + (props.markLabel || t("timesAvailable")) : ""),
                onClick: function () { setFocus(d); pickDay(d); }, onMouseEnter: function () { if (range && props.start && !props.end) setHover(d); }
              }, d.getDate())));
          })(addD(startCell, w * 7 + i));
        }
        rows.push(h("tr", { key: w, role: "row" }, cells));
      }
      body = h("table", { className: "op-cal-grid", role: "grid", "aria-label": MONTHS[cm] + " " + cy, onKeyDown: onDayKey },
        h("thead", null, h("tr", { role: "row" }, [0, 1, 2, 3, 4, 5, 6].map(function (k) { var ix = (WEEK_START + k) % 7; return h("th", { key: ix, scope: "col", abbr: DAYS[ix], role: "columnheader" }, DAYS_SHORT[ix]); }))),
        h("tbody", null, rows));
    } else if (view === "months") {
      body = h("div", { className: "op-cal-cells", role: "group", "aria-label": t("monthsOf", { year: cy }), onKeyDown: onPickKey },
        MONTHS.map(function (n, m) {
          return h("button", { key: n, id: uid + "-m-" + m, type: "button", tabIndex: m === pick ? 0 : -1, disabled: monthOff(cy, m), "aria-pressed": m === cm ? "true" : "false", "aria-current": (cy === today.getFullYear() && m === today.getMonth()) ? "date" : undefined, "aria-label": n + " " + cy,
            className: cx("op-cal-cell", m === cm && "op-day--sel", cy === today.getFullYear() && m === today.getMonth() && "op-day--today"), onClick: function () { chooseMonth(m); } }, n.slice(0, 3));
        }));
    } else {
      var years = []; for (var y = yLo; y <= yHi; y++) years.push(y);
      body = h("div", { className: "op-cal-cells op-cal-years", role: "group", "aria-label": t("yearsRange", { from: yLo, to: yHi }), onKeyDown: onPickKey },
        years.map(function (yy) {
          return h("button", { key: yy, id: uid + "-y-" + yy, type: "button", tabIndex: yy === pick ? 0 : -1, disabled: yearOff(yy), "aria-pressed": yy === cy ? "true" : "false", "aria-current": yy === today.getFullYear() ? "date" : undefined,
            className: cx("op-cal-cell", yy === cy && "op-day--sel", yy === today.getFullYear() && "op-day--today"), onClick: function () { chooseYear(yy); } }, String(yy));
        }));
    }
    function short(d) { return MONTHS[d.getMonth()].slice(0, 3) + " " + d.getDate(); }
    var help = null;
    if (range && view === "days") {
      var msg = !props.start ? t("rangeStart") : !props.end ? t("rangeEnd", { start: short(props.start) }) : t("rangeDone", { start: short(props.start), end: short(props.end), days: Math.round(cmpD(props.end, props.start) / 864e5) + 1 });
      help = h("p", { className: "op-cal-help", "aria-live": "polite" }, msg);
    }
    return h("div", { className: "op-cal" }, head, body, help,
      props.footer === false || view !== "days" ? null : h(Actions, { className: "op-cal-foot" },
        h(Button, { variant: "quiet", onClick: function () { var tc = clampDate(today); setFocus(tc); if (!range && !off(today)) pickDay(today); } }, t("today")),
        props.onClear ? h(Button, { variant: "quiet", onClick: props.onClear }, t("clear")) : null));
  }

  function DatePicker(props) {
    var id = useUid("op-date-", props.id);
    var s1 = React.useState(props.defaultValue || null), inner = s1[0], setInner = s1[1];
    var value = props.value !== undefined ? props.value : inner;
    var s2 = React.useState(fmtDate(value)), text = s2[0], setText = s2[1];
    var s3 = React.useState(false), open = s3[0], setOpen = s3[1];
    var s4 = React.useState(""), err = s4[0], setErr = s4[1];
    var wrap = React.useRef(null), panel = React.useRef(null), input = React.useRef(null);
    React.useEffect(function () { setText(fmtDate(value)); }, [value && value.getTime()]);
    function close() { setOpen(false); }
    useFloating(open, close, wrap, panel, 0, true);
    React.useEffect(function () { if (open) setTimeout(function () { var el = panel.current && panel.current.querySelector('.op-day[tabindex="0"]'); if (el) el.focus(); }, 0); }, [open]);
    function setVal(d) { if (props.value === undefined) setInner(d); if (props.onChange) props.onChange(d); }
    function commit() {
      var raw = text.trim();
      if (!raw) { setErr(""); if (value) setVal(null); return; }
      var d = parseDate(raw);
      if (!d || (props.min && cmpD(d, props.min) < 0) || (props.max && cmpD(d, props.max) > 0)) { setErr(d ? t("dateBetween", { min: fmtDate(props.min || d), max: fmtDate(props.max || d) }) : t("dateError", { format: dateFormatLabel() })); return; }
      setErr(""); setText(fmtDate(d)); if (!value || cmpD(d, value) !== 0) setVal(d);
    }
    function onKey(e) {
      if (e.key === "Enter") { commit(); }
      else if (e.key === "ArrowDown" && e.altKey) { e.preventDefault(); setOpen(true); }
      else if (e.key === "Escape" && open) { e.stopPropagation(); close(); }
    }
    var shellProps = Object.assign({}, props, { error: props.error || err });
    var control = h("div", { ref: wrap, className: "op-input-wrap op-combo", "data-invalid": shellProps.error ? "" : undefined, "data-disabled": props.disabled ? "" : undefined },
      h("input", {
        ref: input, id: id, className: "op-input op-combo-input", type: "text", inputMode: "numeric", autoComplete: "off", placeholder: dateFormatLabel(), value: text, disabled: props.disabled,
        "aria-invalid": shellProps.error ? "true" : undefined, "aria-describedby": shellProps.error || props.hint ? id + "-hint" : undefined,
        onChange: function (e) { setText(e.target.value); setErr(""); }, onBlur: commit, onKeyDown: onKey
      }),
      props.name ? h("input", { type: "hidden", name: props.name, value: isoDate(value) }) : null,
      h("button", { type: "button", className: "op-combo-btn", "aria-label": t("chooseDate"), "aria-haspopup": "dialog", "aria-expanded": open ? "true" : "false", disabled: props.disabled, onClick: function () { setOpen(!open); } }, h(Icon, { name: "calendar" })),
      h("div", { ref: panel, popover: "manual", role: "dialog", "aria-label": t("chooseDate"), className: "op-popover op-calpanel", onKeyDown: function (e) { if (e.key === "Escape") { e.stopPropagation(); close(); if (input.current) input.current.focus(); } } },
        open ? h(Calendar, {
          value: value, min: props.min, max: props.max,
          onChange: function (d) { setVal(d); setText(fmtDate(d)); setErr(""); close(); if (input.current) input.current.focus(); },
          onClear: function () { setVal(null); setText(""); setErr(""); close(); if (input.current) input.current.focus(); }
        }) : null));
    return FieldShell(shellProps, control, id);
  }

  function DateRangePicker(props) {
    var id = useUid("op-range-", props.id);
    var s1 = React.useState(props.defaultValue || { start: null, end: null }), inner = s1[0], setInner = s1[1];
    var value = props.value !== undefined ? props.value : inner;
    var s2 = React.useState(fmtDate(value.start)), t1 = s2[0], setT1 = s2[1];
    var s3 = React.useState(fmtDate(value.end)), t2 = s3[0], setT2 = s3[1];
    var s4 = React.useState(false), open = s4[0], setOpen = s4[1];
    var s5 = React.useState(""), err = s5[0], setErr = s5[1];
    var s6 = React.useState({ start: value.start, end: value.end }), draft = s6[0], setDraft = s6[1];
    var wrap = React.useRef(null), panel = React.useRef(null);
    function close() { setOpen(false); }
    useFloating(open, close, wrap, panel, 0, true);
    React.useEffect(function () { if (open) setTimeout(function () { var el = panel.current && panel.current.querySelector('.op-day[tabindex="0"]'); if (el) el.focus(); }, 0); }, [open]);
    function setVal(v) { if (props.value === undefined) setInner(v); if (props.onChange) props.onChange(v); setT1(fmtDate(v.start)); setT2(fmtDate(v.end)); setErr(""); }
    function commitText() {
      var a = t1.trim() ? parseDate(t1) : null, b = t2.trim() ? parseDate(t2) : null;
      if ((t1.trim() && !a) || (t2.trim() && !b)) { setErr(t("datesError", { format: dateFormatLabel() })); return; }
      if (a && b && cmpD(b, a) < 0) { setErr(t("endBeforeStart")); return; }
      setErr(""); setVal({ start: a, end: b });
    }
    var today = sod(new Date());
    var presets = props.presets || [
      { label: t("last7"), get: function () { return { start: addD(today, -6), end: today }; } },
      { label: t("last30"), get: function () { return { start: addD(today, -29), end: today }; } },
      { label: t("thisMonth"), get: function () { return { start: new Date(today.getFullYear(), today.getMonth(), 1, 12), end: today }; } }
    ];
    var shellProps = Object.assign({}, props, { error: props.error || err });
    var control = h("div", { ref: wrap, className: "op-input-wrap op-combo op-rangefield", "data-invalid": shellProps.error ? "" : undefined, "data-disabled": props.disabled ? "" : undefined },
      h("input", { id: id, className: "op-input op-combo-input", type: "text", inputMode: "numeric", autoComplete: "off", placeholder: t("startDate"), "aria-label": t("startDate"), value: t1, disabled: props.disabled, "aria-invalid": shellProps.error ? "true" : undefined, onChange: function (e) { setT1(e.target.value); }, onBlur: commitText }),
      h("span", { className: "op-range-sep", "aria-hidden": "true" }, t("to")),
      h("input", { className: "op-input op-combo-input", type: "text", inputMode: "numeric", autoComplete: "off", placeholder: t("endDate"), "aria-label": t("endDate"), value: t2, disabled: props.disabled, "aria-invalid": shellProps.error ? "true" : undefined, onChange: function (e) { setT2(e.target.value); }, onBlur: commitText }),
      props.startName ? h("input", { type: "hidden", name: props.startName, value: isoDate(value.start) }) : null,
      props.endName ? h("input", { type: "hidden", name: props.endName, value: isoDate(value.end) }) : null,
      h("button", { type: "button", className: "op-combo-btn", "aria-label": t("chooseDates"), "aria-haspopup": "dialog", "aria-expanded": open ? "true" : "false", disabled: props.disabled, onClick: function () { setDraft({ start: value.start, end: value.end }); setOpen(!open); } }, h(Icon, { name: "calendar" })),
      h("div", { ref: panel, popover: "manual", role: "dialog", "aria-label": t("chooseDates"), className: "op-popover op-calpanel", onKeyDown: function (e) { if (e.key === "Escape") { e.stopPropagation(); close(); } } },
        open ? h(React.Fragment, null,
          h(Calendar, {
            mode: "range", start: draft.start, end: draft.end, min: props.min, max: props.max, footer: false,
            onRangeChange: function (r) { setDraft(r); if (r.start && r.end) { setVal(r); close(); } }
          }),
          h("div", { className: "op-cal-presets" }, presets.map(function (p) { return h(Button, { key: p.label, variant: "outline", onClick: function () { setVal(p.get()); close(); } }, p.label); }))) : null));
    return FieldShell(shellProps, control, id);
  }

  /* ================= DataGrid ================= */
  function cellValue(row, col) { return col.value ? col.value(row) : row[col.key]; }
  function compareValues(a, b) {
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    if (typeof a === "number" && typeof b === "number") return a - b;
    if (a instanceof Date && b instanceof Date) return a - b;
    return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
  }
  function parsePx(w) { if (typeof w === "number") return w; if (typeof w === "string" && /px$/.test(w)) return parseFloat(w); return null; }
  function filterActive(f) { return f != null && f !== "" && !(typeof f === "object" && (f.min === "" || f.min == null) && (f.max === "" || f.max == null)); }

  /** Draggable and keyboard-operable column edge (the ARIA window splitter pattern). */
  function Resizer(props) {
    var ref = React.useRef(null);
    function currentWidth() { return ref.current ? ref.current.parentNode.getBoundingClientRect().width : props.min; }
    function onDown(e) {
      e.preventDefault();
      var startX = e.clientX, startW = currentWidth();
      function move(ev) { props.onResize(Math.max(props.min, Math.round(startW + ev.clientX - startX))); }
      function up() { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); document.body.style.cursor = ""; }
      document.body.style.cursor = "col-resize";
      window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
    }
    function onKey(e) {
      var d = e.shiftKey ? 40 : 10;
      if (e.key === "ArrowLeft") { e.preventDefault(); props.onResize(Math.max(props.min, Math.round(currentWidth()) - d)); }
      else if (e.key === "ArrowRight") { e.preventDefault(); props.onResize(Math.round(currentWidth()) + d); }
      else if (e.key === "Home" || e.key === "Escape") { e.preventDefault(); props.onReset(); }
    }
    return h("span", { ref: ref, className: "op-resizer", role: "separator", "aria-orientation": "vertical", tabIndex: 0, "aria-label": t("resizeCol", { col: props.label }), "aria-valuenow": Math.round(props.width || 0), "aria-valuemin": props.min, onPointerDown: onDown, onKeyDown: onKey, onDoubleClick: props.onReset });
  }

  /** A table you can sort, filter per column, resize, hide columns of, select from, page through or scroll as thousands of rows. */
  function DataGrid(props) {
    var allCols = props.columns || [];
    var uid = useUid("op-grid-");
    var s1 = React.useState(props.defaultSort || null), sort = s1[0], setSort = s1[1];
    var s2 = React.useState(1), page = s2[0], setPage = s2[1];
    var s3 = React.useState({}), picked = s3[0], setPicked = s3[1];
    var s4 = React.useState(""), query = s4[0], setQuery = s4[1];
    var s5 = React.useState({}), filters = s5[0], setFilters = s5[1];
    var s6 = React.useState({}), widths = s6[0], setWidths = s6[1];
    var s7 = React.useState({}), hidden = s7[0], setHidden = s7[1];
    var s8 = React.useState(0), scrollTop = s8[0], setScrollTop = s8[1];
    var manual = !!props.manual, plain = !!props.plain;
    var vopt = props.virtual ? Object.assign({ rowHeight: 48, height: 440, overscan: 8 }, props.virtual === true ? {} : props.virtual) : null;
    var pageSize = vopt || plain ? 0 : (props.pageSize === undefined ? 10 : props.pageSize);
    var cols = allCols.filter(function (c) { return !hidden[c.key]; });
    var resizable = props.resizable && !plain;
    var cards = props.cards !== false && !vopt && !resizable;
    var rootRef = React.useRef(null);
    /* A table that turns into cards on a narrow container loses its table semantics in some browsers when its display changes, so say what each part is. */
    React.useEffect(function () {
      var el = rootRef.current; if (!el || !cards) return;
      var map = { table: "table", thead: "rowgroup", tbody: "rowgroup", tr: "row", th: "columnheader", td: "cell" };
      Object.keys(map).forEach(function (tag) { Array.prototype.forEach.call(el.querySelectorAll(tag), function (n) { if (!n.getAttribute("role")) n.setAttribute("role", map[tag]); }); });
    });
    var hasFilterRow = props.filterable && cols.some(function (c) { return c.filter; });
    var q = query.trim().toLowerCase();
    var anyFilter = Object.keys(filters).some(function (k) { return filterActive(filters[k]); });

    var first = React.useRef(true);
    React.useEffect(function () {
      if (first.current) { first.current = false; return; }
      if (props.onQueryChange) props.onQueryChange({ sort: sort, page: page, pageSize: pageSize, search: query, filters: filters });
    }, [sort, page, query, filters]);

    function passes(r) {
      for (var i = 0; i < allCols.length; i++) {
        var c = allCols[i], f = filters[c.key];
        if (!filterActive(f)) continue;
        var v = cellValue(r, c);
        if (c.filter && c.filter.type === "select") { if (String(v) !== String(f)) return false; }
        else if (c.filter && c.filter.type === "number") {
          var n = Number(v);
          if (f.min !== "" && f.min != null && n < Number(f.min)) return false;
          if (f.max !== "" && f.max != null && n > Number(f.max)) return false;
        } else if (String(v == null ? "" : v).toLowerCase().indexOf(String(f).toLowerCase()) < 0) return false;
      }
      if (!q) return true;
      return cols.some(function (c) { var v = cellValue(r, c); return v != null && String(v).toLowerCase().indexOf(q) >= 0; });
    }
    var rows = props.rows || [];
    if (!manual) {
      rows = rows.filter(passes);
      if (sort) {
        var sc = allCols.filter(function (c) { return c.key === sort.key; })[0];
        if (sc) {
          var dir = sort.dir === "desc" ? -1 : 1;
          rows = rows.map(function (r, i) { return { r: r, i: i }; }).sort(function (a, b) { return dir * compareValues(cellValue(a.r, sc), cellValue(b.r, sc)) || a.i - b.i; }).map(function (x) { return x.r; });
        }
      }
    }
    var total = manual ? (props.total != null ? props.total : rows.length) : rows.length;
    var pages = pageSize > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 1;
    var cur = Math.min(page, pages);
    var view = rows;
    if (!manual && pageSize > 0) view = rows.slice((cur - 1) * pageSize, cur * pageSize);
    var ids = (vopt ? rows : view).map(function (r) { return r.id; });
    var nPicked = Object.keys(picked).filter(function (k) { return picked[k]; }).length;
    var allOn = ids.length > 0 && ids.every(function (i) { return picked[i]; });
    var someOn = ids.some(function (i) { return picked[i]; });
    function emit(next) { setPicked(next); if (props.onSelectionChange) props.onSelectionChange(Object.keys(next).filter(function (k) { return next[k]; })); }
    function toggleRow(id) { var n = Object.assign({}, picked); n[id] = !n[id]; emit(n); }
    function toggleAll() { var n = Object.assign({}, picked); ids.forEach(function (i) { n[i] = !allOn; }); emit(n); }
    function cycle(c) {
      setPage(1);
      if (!sort || sort.key !== c.key) setSort({ key: c.key, dir: "asc" });
      else if (sort.dir === "asc") setSort({ key: c.key, dir: "desc" });
      else setSort(null);
    }
    function setFilter(key, v) { var n = Object.assign({}, filters); n[key] = v; setFilters(n); setPage(1); }
    function clearFilters() { setFilters({}); setQuery(""); setPage(1); }
    function setWidth(key, px) { var n = Object.assign({}, widths); n[key] = px; setWidths(n); }
    function resetWidth(key) { var n = Object.assign({}, widths); delete n[key]; setWidths(n); }

    // virtual window
    var rh = vopt ? vopt.rowHeight : 0, start = 0, end = view.length;
    if (vopt) {
      start = Math.max(0, Math.floor(scrollTop / rh) - vopt.overscan);
      end = Math.min(view.length, Math.ceil((scrollTop + vopt.height) / rh) + vopt.overscan);
    }
    var shown = vopt ? view.slice(start, end) : view;
    var colCount = cols.length + (props.selectable ? 1 : 0);
    var minTable = (props.selectable ? 52 : 0) + cols.reduce(function (s, c) { return s + (widths[c.key] || parsePx(c.width) || (c.minWidth || 96)); }, 0);
    var from = total === 0 ? 0 : (cur - 1) * (pageSize > 0 ? pageSize : total) + 1;
    var to = pageSize > 0 ? Math.min(total, cur * pageSize) : total;
    var sortedCol = sort && allCols.filter(function (c) { return c.key === sort.key; })[0];
    var fixedLayout = resizable || vopt || cols.some(function (c) { return c.width; });
    var stickyLeft = props.selectable ? 52 : 0;
    function stick(i) { return props.stickyFirst && i === 0; }
    var rafRef = React.useRef(0);

    function filterCell(c) {
      var f = c.filter; if (!f) return null;
      var label = t("filterColumn", { col: c.label });
      if (f.type === "select") {
        return h(Select, { bare: true, ariaLabel: label, placeholder: t("all"), value: filters[c.key] == null ? "" : filters[c.key], options: [{ value: "", label: t("all") }].concat(normOptions(f.options)), onChange: function (v) { setFilter(c.key, v); } });
      }
      if (f.type === "number") {
        var cur2 = filters[c.key] || { min: "", max: "" };
        return h("div", { className: "op-filter-range" },
          h("input", { className: "op-input op-filter-input", type: "text", inputMode: "decimal", placeholder: t("min"), "aria-label": t("minOf", { col: label }), value: cur2.min, onChange: function (e) { setFilter(c.key, { min: e.target.value, max: cur2.max }); } }),
          h("input", { className: "op-input op-filter-input", type: "text", inputMode: "decimal", placeholder: t("max"), "aria-label": t("maxOf", { col: label }), value: cur2.max, onChange: function (e) { setFilter(c.key, { min: cur2.min, max: e.target.value }); } }));
      }
      return h("input", { className: "op-input op-filter-input", type: "search", placeholder: t("filter"), "aria-label": label, value: filters[c.key] || "", onChange: function (e) { setFilter(c.key, e.target.value); } });
    }

    var sortables = allCols.filter(function (c) { return c.sortable; });
    var sortOptions = [{ value: "", label: t("sortBy") }];
    sortables.forEach(function (c) { ["asc", "desc"].forEach(function (d) { sortOptions.push({ value: c.key + ":" + d, label: c.label + ", " + t(d === "asc" ? "ascending" : "descending") }); }); });
    var sortSelect = cards && sortables.length ? h("div", { className: "op-grid-sortsel" }, h(Select, { bare: true, ariaLabel: t("sortBy"), placeholder: t("sortBy"), value: sort ? sort.key + ":" + sort.dir : "", options: sortOptions, onChange: function (v) { if (!v) setSort(null); else { var p = v.split(":"); setSort({ key: p[0], dir: p[1] }); } setPage(1); } })) : null;
    var barOther = props.searchable || props.toolbar || nPicked || props.columnToggle || anyFilter;
    var showBar = !plain && (barOther || sortSelect);
    return h("div", { ref: rootRef, className: cx("op-grid", plain && "op-grid--plain", cards && "op-grid--cards") },
      showBar ? h("div", { className: cx("op-grid-bar", !barOther && "op-grid-bar--sortonly") },
        props.searchable ? h("div", { className: "op-input-wrap op-grid-search" }, h("span", { className: "op-affix op-affix--pre" }, h(Icon, { name: "search" })),
          h("input", { className: "op-input", type: "search", placeholder: props.searchPlaceholder || t("searchAll"), "aria-label": t("searchAll"), value: query, onChange: function (e) { setQuery(e.target.value); setPage(1); } })) : null,
        nPicked ? h("div", { className: "op-grid-picked" }, h("span", { className: "op-grid-count" }, t("selected", { n: nPicked })), props.bulkActions || null) : null,
        sortSelect,
        h("div", { className: "op-grid-tools" },
          anyFilter || q ? h(Button, { variant: "quiet", onClick: clearFilters }, t("clearFilters")) : null,
          props.columnToggle ? h(Popover, { className: "op-btn op-btn--outline", label: t("chooseColumns"), trigger: t("columns"), title: t("showColumns") },
            allCols.map(function (c) { return h(Checkbox, { key: c.key, label: c.label, checked: !hidden[c.key], onChange: function () { var n = Object.assign({}, hidden); n[c.key] = !n[c.key]; setHidden(n); } }); })) : null,
          props.toolbar || null)) : null,
      h("div", {
        className: "op-grid-scroll", style: vopt ? { height: vopt.height } : (props.maxHeight ? { maxHeight: props.maxHeight } : undefined), tabIndex: 0, role: "region", "aria-label": props.caption,
        onScroll: vopt ? function (e) { var st = e.currentTarget.scrollTop; cancelAnimationFrame(rafRef.current); rafRef.current = requestAnimationFrame(function () { setScrollTop(st); }); } : undefined
      },
        h("table", { className: cx("op-table op-gridtable", vopt && "op-gridtable--virtual"), style: { tableLayout: fixedLayout ? "fixed" : undefined, minWidth: fixedLayout ? minTable : undefined, "--row-h": rh ? rh + "px" : undefined }, "aria-rowcount": vopt ? total + 1 + (hasFilterRow ? 1 : 0) : undefined },
          props.caption ? h("caption", { className: "op-sr" }, props.caption) : null,
          fixedLayout ? h("colgroup", null, props.selectable ? h("col", { style: { width: 52 } }) : null, cols.map(function (c) { var w = widths[c.key] || parsePx(c.width); return h("col", { key: c.key, style: w ? { width: w } : undefined }); })) : null,
          h("thead", null,
            h("tr", null,
              props.selectable ? h("th", { scope: "col", className: "op-cell-check" }, h(Checkbox, { bare: true, label: vopt ? t("selectAll") : t("selectAllPage"), checked: allOn, indeterminate: someOn && !allOn, onChange: toggleAll })) : null,
              cols.map(function (c, i) {
                var on = sort && sort.key === c.key;
                var w = widths[c.key];
                return h("th", { key: c.key, scope: "col", className: cx(c.numeric && "op-num", c.align === "center" && "op-center", stick(i) && "op-sticky"), style: stick(i) ? { insetInlineStart: stickyLeft } : undefined, "aria-sort": c.sortable ? (on ? (sort.dir === "asc" ? "ascending" : "descending") : "none") : undefined },
                  c.sortable ? h("button", { type: "button", className: "op-sortbtn", onClick: function () { cycle(c); } }, c.label, h(Icon, { name: on ? (sort.dir === "asc" ? "arrow-up" : "arrow-down") : "sort", small: true })) : c.label,
                  resizable && c.resizable !== false ? h(Resizer, { label: c.label, width: w || parsePx(c.width), min: c.minWidth || 72, onResize: function (px) { setWidth(c.key, px); }, onReset: function () { resetWidth(c.key); } }) : null);
              })),
            hasFilterRow ? h("tr", { className: "op-filterrow" }, (props.selectable ? [h("td", { key: "c", className: "op-cell-check" })] : []).concat(cols.map(function (c, i) { return h("td", { key: c.key, className: cx(stick(i) && "op-sticky"), style: stick(i) ? { insetInlineStart: stickyLeft } : undefined }, filterCell(c)); }))) : null),
          h("tbody", null,
            props.loading ? [0, 1, 2, 3, 4].map(function (i) { return h("tr", { key: "s" + i }, (props.selectable ? [h("td", { key: "c", className: "op-cell-check" })] : []).concat(cols.map(function (c) { return h("td", { key: c.key }, h("span", { className: "op-skel" })); }))); })
              : view.length === 0 ? h("tr", null, h("td", { colSpan: colCount, className: "op-grid-empty" }, h(EmptyState, { bare: true, icon: props.emptyIcon || "search", title: props.emptyTitle || t("noResults"), action: anyFilter || q ? h(Button, { variant: "outline", onClick: clearFilters }, t("clearFilters")) : null }, props.emptyText || (anyFilter || q ? t("noMatchesFilters") : t("nothingYet")))))
              : [
                vopt && start > 0 ? h("tr", { key: "top", "aria-hidden": "true", className: "op-spacer", style: { height: start * rh } }, h("td", { colSpan: colCount })) : null,
                shown.map(function (r, k) {
                  return h("tr", { key: r.id, "data-selected": picked[r.id] ? "" : undefined, "aria-rowindex": vopt ? start + k + 2 + (hasFilterRow ? 1 : 0) : undefined },
                    props.selectable ? h("td", { className: "op-cell-check" }, h(Checkbox, { bare: true, label: t("selectRow"), checked: !!picked[r.id], onChange: function () { toggleRow(r.id); } })) : null,
                    cols.map(function (c, i) { return h("td", { key: c.key, "data-label": c.label, className: cx(c.numeric && "op-num", c.align === "center" && "op-center", stick(i) && "op-sticky"), style: stick(i) ? { insetInlineStart: stickyLeft } : undefined }, c.render ? c.render(r) : r[c.key]); }));
                }),
                vopt && end < view.length ? h("tr", { key: "bottom", "aria-hidden": "true", className: "op-spacer", style: { height: (view.length - end) * rh } }, h("td", { colSpan: colCount })) : null
              ]))),
      plain ? null : h("div", { className: "op-grid-foot" },
        h("span", { className: "op-grid-range" }, total === 0 ? t("rows", { n: 0 }) : vopt || pageSize === 0 ? t("rows", { n: total }) : t("showing", { from: from, to: to, total: total })),
        pageSize > 0 && pages > 1 ? h(Pagination, { page: cur, pageCount: pages, onChange: function (p) { setPage(p); } }) : null),
      h("span", { className: "op-sr", role: "status", "aria-live": "polite" }, (sortedCol ? t("sortedBy", { col: sortedCol.label, dir: t(sort.dir === "asc" ? "ascending" : "descending") }) + " " : "") + t("rowsAnnounce", { n: total })));
  }

  /* ================= More inputs and surfaces ================= */
  function NumberField(props) {
    var id = useUid("op-num-", props.id);
    var step = props.step || 1, min = props.min, max = props.max;
    var decimals = (String(step).split(".")[1] || "").length;
    var s1 = React.useState(props.defaultValue != null ? props.defaultValue : ""), inner = s1[0], setInner = s1[1];
    var value = props.value !== undefined ? props.value : inner;
    var s2 = React.useState(value === "" ? "" : Number(value).toFixed(decimals)), text = s2[0], setText = s2[1];
    React.useEffect(function () { setText(value === "" || value == null ? "" : Number(value).toFixed(decimals)); }, [value]);
    function clamp(n) { if (min != null && n < min) n = min; if (max != null && n > max) n = max; return n; }
    function set(n) { n = clamp(n); if (props.value === undefined) setInner(n); if (props.onChange) props.onChange(n); setText(n.toFixed(decimals)); }
    function bump(dir, mult) { var base = value === "" || value == null ? (min != null ? min - step * (dir > 0 ? 1 : 0) : 0) : Number(value); set(Math.round((base + dir * step * (mult || 1)) * 1e6) / 1e6); }
    function commit() { var n = parseFloat(text.replace(/,/g, "")); if (isNaN(n)) { if (text === "") { if (props.value === undefined) setInner(""); if (props.onChange) props.onChange(null); } else setText(value === "" ? "" : Number(value).toFixed(decimals)); } else set(n); }
    var num = value === "" || value == null ? undefined : Number(value);
    var control = h("div", { className: cx("op-input-wrap op-numfield", (props.prefix || props.suffix) && "op-numfield--affix"), onClick: focusInside, "data-invalid": props.error ? "" : undefined, "data-disabled": props.disabled ? "" : undefined },
      h("button", { type: "button", className: "op-numbtn", "aria-label": t("decrease"), disabled: props.disabled || (min != null && num != null && num <= min), onClick: function () { bump(-1); } }, h(Icon, { name: "minus", bold: true })),
      props.prefix ? h("span", { className: "op-affix op-affix--pre op-numfield-first", "aria-hidden": "true" }, props.prefix) : null,
      h("input", Object.assign({
        id: id, className: cx("op-input op-numinput", !props.prefix && "op-numfield-first", !props.suffix && "op-numfield-last"), style: { "--chars": Math.max(text.length, 4) }, type: "text", inputMode: "decimal", role: "spinbutton", autoComplete: "off", value: text, disabled: props.disabled, required: props.required,
        "aria-valuenow": num, "aria-valuemin": min, "aria-valuemax": max, "aria-invalid": props.error ? "true" : undefined,
        onChange: function (e) { setText(e.target.value); }, onBlur: commit,
        onKeyDown: function (e) { if (e.key === "ArrowUp") { e.preventDefault(); bump(1, e.shiftKey ? 10 : 1); } else if (e.key === "ArrowDown") { e.preventDefault(); bump(-1, e.shiftKey ? 10 : 1); } else if (e.key === "Enter") commit(); }
      }, inputAttrs({ autoComplete: props.autoComplete, "aria-describedby": props["aria-describedby"], inputRef: props.inputRef }, props.error || props.hint ? id + "-hint" : ""))),
      props.suffix ? h("span", { className: "op-affix op-affix--post op-numfield-last", "aria-hidden": "true" }, props.suffix) : null,
      h("button", { type: "button", className: "op-numbtn", "aria-label": t("increase"), disabled: props.disabled || (max != null && num != null && num >= max), onClick: function () { bump(1); } }, h(Icon, { name: "plus", bold: true })),
      props.name ? h("input", { type: "hidden", name: props.name, value: num == null ? "" : num }) : null);
    return FieldShell(props, control, id);
  }

  function SegmentedControl(props) {
    var name = useUid("op-seg-", props.name);
    var options = normOptions(props.options);
    var s1 = React.useState(props.defaultValue != null ? props.defaultValue : (options[0] && options[0].value)), inner = s1[0], setInner = s1[1];
    var value = props.value !== undefined ? props.value : inner;
    var seg = h("div", { className: "op-seg", role: "radiogroup", "aria-label": props.label, "aria-describedby": props.error || props.hint ? name + "-hint" : undefined }, options.map(function (o) {
      return h("label", { key: o.value, className: "op-seg-opt" },
        h("input", { type: "radio", name: name, value: o.value, className: "op-seg-input", checked: value === o.value, disabled: o.disabled || props.disabled, onChange: function () { if (props.value === undefined) setInner(o.value); if (props.onChange) props.onChange(o.value); } }),
        h("span", { className: "op-seg-text" }, o.icon ? h(Icon, { name: o.icon }) : null, o.label));
    }));
    return props.hint || props.error ? h("div", { className: "op-seg-field" }, seg, Message(props, name + "-hint")) : seg;
  }

  function EmptyState(props) {
    return h("div", { className: cx("op-empty", props.bare && "op-empty--bare") },
      props.icon ? h("span", { className: "op-empty-icon" }, h(Icon, { name: props.icon })) : null,
      h("h" + (props.headingLevel || 3), { className: "op-empty-title" }, props.title),
      props.children ? h("p", { className: "op-empty-text" }, props.children) : null,
      props.action || null);
  }

  function Drawer(props) {
    var ref = React.useRef(null);
    var titleId = useUid("op-drawer-title-");
    React.useEffect(function () {
      var el = ref.current; if (!el) return;
      if (props.open && !el.open) { if (props.inline) el.show(); else el.showModal(); }
      if (!props.open && el.open) el.close();
    }, [props.open, props.inline]);
    return h("dialog", { ref: ref, className: cx("op-drawer", props.side === "left" && "op-drawer--left", props.inline && "op-drawer--inline"), "aria-labelledby": titleId, onClose: props.onClose, onCancel: props.onClose },
      h("header", { className: "op-dialog-head" }, h("h" + (props.headingLevel || 2), { id: titleId, className: "op-dialog-title" }, props.title), h(IconButton, { icon: "x", label: t("close"), onClick: props.onClose })),
      h("div", { className: "op-drawer-body", tabIndex: 0, role: "region", "aria-labelledby": titleId }, props.children),
      props.actions ? h(Actions, { as: "footer", bar: true, className: "op-dialog-foot" }, props.actions) : null);
  }

