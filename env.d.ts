// Modules that only exist inside a VitePress build.
declare module "@localSearchIndex" {
  const index: Record<string, () => Promise<{ default: string }>>;
  export default index;
}
