// Stub for @kabelsalat/web, whose published build exports nothing in this
// install and breaks any ESM import of @strudel/core's bundle. Only SalatRepl is
// referenced, and only by the REPL widget, which a headless check never uses.
export class SalatRepl {
  constructor() {
    throw new Error('SalatRepl is a browser-only REPL widget (stubbed for node)');
  }
}
export default { SalatRepl };
