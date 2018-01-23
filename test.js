import test from 'ava';
import betterBrowser from './dist';

test.beforeEach(t => {
  t.context.betterBrowser = betterBrowser;
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
  t.true(typeof t.context.betterBrowser.current() === 'object');
});

test('chrome', t => {
  t.context.betterBrowser.set();
  const recommendationLists = t.context.betterBrowser._recommend();
  t.true(recommendationLists[Object.keys(recommendationLists)[0]].url.startsWith('chrome'));
});

test('firefox', t => {
  t.context.betterBrowser.set('firefox');
  const recommendationLists = t.context.betterBrowser._recommend();
  t.true(recommendationLists[Object.keys(recommendationLists)[0]].url.startsWith('about:config'));
});

test('evaluate chrome', t => {
  t.context.betterBrowser.set();
  t.true(typeof t.context.betterBrowser.evaluate() === 'object');
});

test('evaluate firefox', t => {
  t.context.betterBrowser.set('firefox');
  t.true(typeof t.context.betterBrowser.evaluate() === 'object');
});
