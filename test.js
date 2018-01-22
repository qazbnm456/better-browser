import test from 'ava';
import betterBrowser from './dist';

test('get', t => {
  t.is(betterBrowser.get(), 'chrome', 'the default value should be \'chrome\'');
});

test('set', t => {
  const firefox = 'firefox';
  betterBrowser.set(firefox);
  t.is(betterBrowser.get(), firefox);
});

test('current', t => {
  t.true(Array.isArray(betterBrowser.current()));
});
