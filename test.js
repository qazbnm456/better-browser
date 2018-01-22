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

test('chrome', t => {
  const recommendationlists = t.context.betterBrowser.recommend();
  t.true(recommendationlists[Object.keys(recommendationlists)[0]].url.startsWith('chrome'));
});

test('firefox', t => {
  t.context.betterBrowser.set('firefox');
  const recommendationlists = t.context.betterBrowser.recommend();
  t.true(recommendationlists[Object.keys(recommendationlists)[0]].url.startsWith('about:config'));
});
