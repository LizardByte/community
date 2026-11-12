const assert = require('node:assert/strict');
const { test } = require('node:test');
const { getSelectedTopic } = require('../.github/scripts/get-selected-topic');

const formPrefixes = [
  ['Sunshine / GSMS', ''],
  ['Actions / Libraries', '<h3 dir="auto">Select GitHub action</h3><p dir="auto">other/unlisted</p>'],
  [
    'Themerr (discussion #1145)',
    '<h3 dir="auto">Select Themerr Product</h3><p dir="auto">ThemerrDB</p>'
      + '<h3 dir="auto">Select Media Server</h3><p dir="auto">Jellyfin</p>',
  ],
];

for (const [form, prefix] of formPrefixes) {
  for (const topic of ['Feature Request', 'Question', 'Bug', 'Show &amp; Tell', 'General']) {
    test(`${form}: reads ${topic} from its topic field`, () => {
      const html = `${prefix}<h3 dir="auto">Select Topic Area</h3><p dir="auto">${topic}</p>`
        + '<h3 dir="auto">Body</h3><p dir="auto">Discussion content</p>';

      assert.equal(getSelectedTopic(html), topic.replace('&amp;', '&').toLowerCase());
    });
  }
}

test('normalizes whitespace, casing, and markup in the topic field', () => {
  assert.equal(
    getSelectedTopic('<h3> Select Topic Area </h3><p> <strong>FEATURE REQUEST</strong> </p>'),
    'feature request',
  );
});

for (const [description, html] of [
  ['empty body', ''],
  ['untemplated body', '<p>Question</p>'],
  ['unrelated heading', '<h3>Body</h3><p>Question</p>'],
  ['missing selection', '<h3>Select Topic Area</h3>'],
  ['empty selection', '<h3>Select Topic Area</h3><p> </p>'],
  ['unsupported topic', '<h3>Select Topic Area</h3><p>arbitrary label</p>'],
  ['topic missing before body', '<h3>Select Topic Area</h3><h3>Body</h3><p>Question</p>'],
]) {
  test(`ignores ${description}`, () => {
    assert.equal(getSelectedTopic(html), '');
  });
}
