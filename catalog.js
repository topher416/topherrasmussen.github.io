(function () {
  'use strict';

  var catalog = [];
  var activeCategory = 'all';

  var categories = [
    { key: 'all', label: 'All' },
    { key: 'web-design', label: 'Web Design' },
    { key: 'video', label: 'Video' },
    { key: 'music', label: 'Music' },
    { key: 'writing', label: 'Writing' },
    { key: 'theater', label: 'Theater' },
    { key: 'visual-art', label: 'Visual Art' },
    { key: 'experiments', label: 'Experiments' }
  ];

  function init() {
    renderFilterBar();
    fetch('/catalog.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        catalog = data;
        render();
      })
      .catch(function () {
        document.getElementById('catalog-entries').innerHTML =
          '<p class="catalog-empty">Could not load catalog.</p>';
      });
  }

  function renderFilterBar() {
    var bar = document.getElementById('filter-bar');
    if (!bar) return;
    bar.innerHTML = categories.map(function (cat) {
      var cls = 'filter-btn' + (cat.key === activeCategory ? ' active' : '');
      return '<button class="' + cls + '" data-cat="' + cat.key + '">' + cat.label + '</button>';
    }).join('');

    bar.addEventListener('click', function (e) {
      if (!e.target.matches('.filter-btn')) return;
      activeCategory = e.target.getAttribute('data-cat');
      var btns = bar.querySelectorAll('.filter-btn');
      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.toggle('active', btns[i].getAttribute('data-cat') === activeCategory);
      }
      render();
    });
  }

  function render() {
    var container = document.getElementById('catalog-entries');
    if (!container) return;

    var filtered = activeCategory === 'all'
      ? catalog
      : catalog.filter(function (e) { return e.category === activeCategory; });

    if (filtered.length === 0) {
      container.innerHTML = '<p class="catalog-empty">Nothing here yet.</p>';
      return;
    }

    // Sort by year descending
    filtered.sort(function (a, b) { return b.year - a.year; });

    // Group by year
    var groups = new Map();
    filtered.forEach(function (entry) {
      if (!groups.has(entry.year)) groups.set(entry.year, []);
      groups.get(entry.year).push(entry);
    });

    var html = '';
    groups.forEach(function (entries, year) {
      html += '<div class="year-group">';
      html += '<h3 class="year-label">' + year + '</h3>';
      html += '<div class="year-entries">';
      entries.forEach(function (entry) {
        var isComingSoon = entry.status === 'coming-soon';
        var entryClass = 'entry' + (isComingSoon ? ' entry--muted' : '');
        html += '<div class="' + entryClass + '">';

        if (entry.image) {
          html += '<div class="entry-image"><img src="' + entry.image + '" alt="' + entry.title + '" loading="lazy"></div>';
        }

        html += '<div class="entry-body">';

        // Title — linked if URL exists
        if (entry.url) {
          var external = entry.url.indexOf('http') === 0;
          var target = external ? ' target="_blank" rel="noopener noreferrer"' : '';
          html += '<h4 class="entry-title"><a href="' + entry.url + '"' + target + '>' + entry.title + '</a></h4>';
        } else {
          html += '<h4 class="entry-title"><span>' + entry.title + '</span></h4>';
        }

        // Meta line: category + badge
        html += '<div class="entry-meta">';
        html += '<span class="entry-category">' + formatCategory(entry.category) + '</span>';
        if (isComingSoon) {
          html += '<span class="badge-coming-soon">Coming soon</span>';
        }
        html += '</div>';

        if (entry.description) {
          html += '<p class="entry-description">' + entry.description + '</p>';
        }

        html += '</div>'; // .entry-body
        html += '</div>'; // .entry
      });
      html += '</div>'; // .year-entries
      html += '</div>'; // .year-group
    });

    container.innerHTML = html;
  }

  function formatCategory(cat) {
    return cat.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  // Expose displayCount for JSONP visitor counter
  window.displayCount = function (count) {
    var el = document.querySelector('.counter-display');
    if (el) el.textContent = count.toString().padStart(8, '0');
  };

  document.addEventListener('DOMContentLoaded', init);
})();
