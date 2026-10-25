/**
 * The height each demo's stage last rendered at, by demo and by window width (to the nearest 100px, since a demo
 * wraps differently on a phone), so its skeleton takes the same room and nothing below it moves when the demo arrives. It is
 * only a convenience for this browser: storage may be missing or full, and then the skeleton takes a usual height.
 */
const KEY = "eos-demo-heights";
const USUAL = 288;

let heights: Record<string, number> | undefined;
function read(): Record<string, number> {
  if (heights) return heights;
  try {
    heights = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, number>;
  } catch {
    heights = {};
  }
  return heights;
}

const keyOf = (name: string) => `${name}@${Math.round(window.innerWidth / 100)}`;

export function stageHeight(name: string): number {
  return read()[keyOf(name)] ?? USUAL;
}

export function rememberStage(name: string, stage: HTMLElement) {
  const all = read();
  const key = keyOf(name);
  const h = Math.round(stage.offsetHeight);
  if (!h || all[key] === h) return;
  all[key] = h;
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // Storage is blocked or full: the skeleton keeps the usual height.
  }
}
