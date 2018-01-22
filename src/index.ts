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
      `/Users/${userInfo().username}/Library/Application Support`, 'Google/Chrome/Local State');
  }
  if (is.windows) {
    return path.join(
      `C:\\Users\\${userInfo().username}`,
      '\\AppData\\Local',
      'Google\\Chrome\\User Data\\Local State');
  }
  if (is.linux) {
    return path.join(
      `/home/${userInfo().username}/.config`, 'google chrome/Local State');
  }
  // tslint:disable-next-line:no-console
  console.error('could not determine the OS');
  return '';
};

const _target = new WeakMap();
class BetterBrowser {
  constructor(target: 'chrome' | 'firefox' = 'chrome') {
    _target.set(this, target);
  }

  public set(specify: 'chrome' | 'firefox' = 'chrome') {
    _target.set(this, specify);
  }
  public get() {
    return _target.get(this);
  }
  public current(): string[] {
    if (_target.get(this) === 'chrome') {
      const chromeStatePath = getChromeStatePath();
      const chromeState = readJSON(chromeStatePath);
      if (chromeState === '') {
        return [];
      }
      return chromeState.browser.enabled_labs_experiments;
    }
    return [];
  }
  public recommend(): string[] {
    const flagsPath = path.resolve('../libs', _target.get(this), 'flags.json');
    return readJSON(flagsPath);
  }
}

export default BetterBrowser;
