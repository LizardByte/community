const { JSDOM } = require('jsdom');

/**
 * Read the selected topic from a rendered GitHub discussion form.
 * @param {string} bodyHTML The discussion's rendered body.
 * @returns {string} A supported topic label, or an empty string for other posts.
 */
function getSelectedTopic(bodyHTML) {
  const fragment = JSDOM.fragment(bodyHTML);
  const selectTopicHeader = [...fragment.querySelectorAll('h3')].find(
    (header) => header.textContent.trim() === 'Select Topic Area',
  );
  const selectedTopicElement = selectTopicHeader?.nextElementSibling;
  if (!selectedTopicElement) {
    return '';
  }

  const selectedTopic = selectedTopicElement.textContent.trim().toLowerCase();
  const validTopics = ['feature request', 'question', 'bug', 'show & tell', 'general'];
  return validTopics.includes(selectedTopic) ? selectedTopic : '';
}

module.exports = { getSelectedTopic };
