import * as fs from 'fs';
import { userInfo } from 'os';
import * as path from 'path';

const is = {
  macos: process.platform === 'darwin',
  linux: process.platform === 'linux',
  windows: process.platform === 'win32',
};

const readJSON = (filePath: string): any => {
  let data: string = '""';
  try {
    data = fs.readFileSync(filePath, 'utf8');
  } catch (readError) {
    // tslint:disable-next-line:no-console
    console.error(`could not read data from ${filePath}, ${readError}`);
  }
  return JSON.parse(data);
};

const getChromeStatePath = () => {
  if (is.macos) {
    return path.join(
      `/Users/${userInfo().username}/Library/Application Support/`, 'Google/Chrome/Local State');
  }
  // tslint:disable-next-line:no-console
  console.error('could not determine the OS');
  return '';
};

const betterBrowser: BetterBrowser = {
  target: 'chrome',
  set(target = betterBrowser.target) {
    this.target = target;
  },
  get() {
    return this.target;
  },
  current() {
    const chromeStatePath = getChromeStatePath();
    const chromeState = readJSON(chromeStatePath);
    if (chromeState === '') {
      return [];
    }
    return chromeState.browser.enabled_labs_experiments;
  },
  recommend() {
    const flagsPath = path.resolve('../libs', this.target, 'flags.json');
    return readJSON(flagsPath);
  },
};

export default betterBrowser;
