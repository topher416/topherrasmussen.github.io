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
    { key: 'experiments', label: 'Experiments' },
    { key: 'concept', label: 'Concept' }
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
      var pressed = cat.key === activeCategory ? 'true' : 'false';
      return '<button type="button" class="' + cls + '" data-cat="' + cat.key + '" aria-pressed="' + pressed + '">' + cat.label + '</button>';
    }).join('');

    bar.addEventListener('click', function (e) {
      var clicked = e.target.closest('.filter-btn');
      if (!clicked) return;
      activeCategory = clicked.getAttribute('data-cat');
      var btns = bar.querySelectorAll('.filter-btn');
      for (var i = 0; i < btns.length; i++) {
        var isActive = btns[i].getAttribute('data-cat') === activeCategory;
        btns[i].classList.toggle('active', isActive);
        btns[i].setAttribute('aria-pressed', isActive ? 'true' : 'false');
      }
      render();
    });
  }

  function render() {
    var container = document.getElementById('catalog-entries');
    if (!container) return;

    var filtered = activeCategory === 'all'
      ? catalog
      : catalog.filter(function (e) {
          if (e.categories) return e.categories.indexOf(activeCategory) !== -1;
          return e.category === activeCategory;
        });

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
        var hasImage = !!entry.image;
        var entryClass = 'entry';
        if (hasImage) entryClass += ' entry--with-image';
        if (isComingSoon) entryClass += ' entry--muted';
        html += '<div class="' + entryClass + '">';

        if (hasImage) {
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
        var displayCats = entry.categories ? entry.categories : [entry.category];
        for (var i = 0; i < displayCats.length; i++) {
          html += '<span class="entry-category">' + formatCategory(displayCats[i]) + '</span>';
        }
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
