interface BetterBrowser {
  target: 'chrome' | 'firefox';
  set(target: 'chrome' | 'firefox'): void;
  get(): 'chrome' | 'firefox';
  recommend(): any;
}
