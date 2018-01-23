import chalk from 'chalk';
import * as fs from 'fs';
import ini from 'ini';
import { userInfo } from 'os';
import * as path from 'path';

const is = {
  macos: process.platform === 'darwin',
  linux: process.platform === 'linux',
  windows: process.platform === 'win32',
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
  console.error(chalk.red('could not determine the OS'));
  return '';
};

const readJSON = (filePath: string): object => {
  let data: string = '""';
  try {
    data = fs.readFileSync(filePath, 'utf8');
  } catch (readError) {
    // tslint:disable-next-line:no-console
    console.error(chalk.red(`could not read data from ${filePath}, ${readError}`));
  }
  if (JSON.parse(data) !== '') {
    const enabledLabsExperiments = JSON.parse(data).browser.enabled_labs_experiments;
    const results: object = {};
    enabledLabsExperiments.forEach((enabledLabsExperiment) => {
      results[enabledLabsExperiment] = true;
    });
    return results;
  }
  return {};
};

const getFirefoxProfilePath = () => {
  let profileConfigpath = '';
  if (is.macos) {
    profileConfigpath = path.join(
      `/Users/${userInfo().username}/Library/Application Support`, 'Firefox/profiles.ini');
    const config = ini.parse(fs.readFileSync(profileConfigpath, 'utf8'));
    return path.join(
      `/Users/${userInfo().username}/Library/Application Support`,
      `Firefox/${Object.values(config)[1].Path}`, 'prefs.js');
  }
  if (is.windows) {
    profileConfigpath = path.join(
      `C:\\Users\\${userInfo().username}`,
      '\\AppData\\Roaming',
      'Mozilla\\Firefox\\profiles.ini');
    const config = ini.parse(fs.readFileSync(profileConfigpath, 'utf8'));
    return path.join(
      `C:\\Users\\${userInfo().username}`,
      '\\AppData\\Roaming',
      'Mozilla\\Firefox', Object.values(config)[1].Path, 'prefs.js');
  }
  if (is.linux) {
    profileConfigpath = path.join(
      `/home/${userInfo().username}/.mozilla`, 'firefox/profiles.ini');
    const config = ini.parse(fs.readFileSync(profileConfigpath, 'utf8'));
    return path.join(
      `/home/${userInfo().username}/.mozilla`,
      `firefox/${Object.values(config)[1].Path}/prefs.js`);
  }
  // tslint:disable-next-line:no-console
  console.error(chalk.red('could not determine the OS'));
  return '';
};

const readJS = (filePath: string): object => {
  let data: string = '""';
  try {
    data = fs.readFileSync(filePath, 'utf8');
    // strip off the first line
    data = data.substring(28);
  } catch (readError) {
    // tslint:disable-next-line:no-console
    console.error(chalk.red(`could not read data from ${filePath}, ${readError}`));
  }
  const esprima = require('esprima');
  const statements = esprima.parseScript(data).body;
  const results: object = {};
  statements.forEach((statement) => {
    if (statement.expression.type !== 'Literal') {
      const arg1 = statement.expression.arguments[0];
      const arg2 = statement.expression.arguments[1];
      results[arg1.value] = arg2.value;
    }
  });
  return results;
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
  public current(): object {
    if (_target.get(this) === 'chrome') {
      const chromeStatePath = getChromeStatePath();
      const chromeState = readJSON(chromeStatePath);
      return chromeState;
    }
    if (_target.get(this) === 'firefox') {
      const firefoxProfilePath = getFirefoxProfilePath();
      const firefoxProfile = readJS(firefoxProfilePath);
      return firefoxProfile;
    }
    return {};
  }
  private recommend(): object {
    const flagsPath = path.resolve('libs', _target.get(this), 'flags.json');
    let data: string = '{}';
    try {
      data = fs.readFileSync(flagsPath, 'utf8');
    } catch (readError) {
      // tslint:disable-next-line:no-console
      console.error(chalk.red(`could not read data from ${flagsPath}, ${readError}`));
    }
    return JSON.parse(data);
  }
  public evaluate(): object {
    const results: object = {};
    const currentLists = this.current();
    const recommendationLists = this.recommend();
    Object.keys(recommendationLists).forEach((key) => {
      const list = recommendationLists[key];
      if (Object.keys(currentLists).includes(list.recommendation)) {
        // tslint:disable-next-line:no-console
        console.log(chalk.blue(`[INFO] ${list.recommendation} existed`));
      }
      results[`--${key}`] = {
        recommendation: list.recommendation,
        url: list.url,
      };
    });
    return results;
  }
}

export default BetterBrowser;
