import * as fs from 'fs';
import * as path from 'path';

const betterBrowser: BetterBrowser = {
  target: 'chrome',
  set(target = betterBrowser.target) {
    this.target = target;
  },
  get() {
    return this.target;
  },
  recommend() {
    const flagsPath = path.resolve('../libs', this.target, 'flags.json');
    let flags: string = '""';
    try {
      flags = fs.readFileSync(flagsPath, 'utf8');
    } catch (readError) {
      // tslint:disable-next-line:no-console
      console.error(`could not read data from ${flagsPath}, ${readError}`);
    }
    return JSON.parse(flags);
  },
};

export default betterBrowser;
