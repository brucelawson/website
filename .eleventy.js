// Eleventy Plugins
const rssPlugin = require('@11ty/eleventy-plugin-rss');

// Markdown Libraries
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');

// Filters
const dateFilter = require('./src/filters/date-filter.js');
const w3DateFilter = require('./src/filters/w3-date-filter.js');

// Utils
const sortByDisplayOrder = require('./src/utils/sort-by-display-order.js');

module.exports = config => {
  // Add filters
  config.addFilter('dateFilter', dateFilter);
  config.addFilter('w3DateFilter', w3DateFilter);

  // Plugins
  config.addPlugin(rssPlugin);

  // Returns a collection of blog posts in reverse date order
  config.addCollection('blog', collection => {
    return [...collection.getFilteredByGlob('./src/posts/*.md')].reverse();
  });

  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  config.setUseGitIgnore(false);

  // Pass through images
  config.addPassthroughCopy('./src/images');

  // Pass through css
  config.addPassthroughCopy('./src/css');

  // Set custom markdown library
  config.setLibrary('md', buildMarkdownLibrary());

  return {
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: 'dist'
    }
  };
};

function buildMarkdownLibrary() {
  const mdParser = markdownIt({
    html: true,
  });

  mdParser.use(markdownItAnchor, {
    level: 1,
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: 'before'
    })
  });

  return mdParser;
}
