import test from 'ava';
import BetterBrowser from './dist';

test.beforeEach(t => {
  t.context.betterBrowser = new BetterBrowser();
});

test('get', t => {
  t.is(t.context.betterBrowser.get(), 'chrome', 'the default value should be \'chrome\'');
});

test('set', t => {
  const firefox = 'firefox';
  t.context.betterBrowser.set(firefox);
  t.is(t.context.betterBrowser.get(), firefox);
});

test('current', t => {
  t.true(Array.isArray(t.context.betterBrowser.current()));
});
