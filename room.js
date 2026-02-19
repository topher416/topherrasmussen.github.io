(function () {
  'use strict';

  var roomFilters = {
    theater: function (e) {
      return getCats(e).indexOf('theater') !== -1;
    },
    writing: function (e) {
      return getCats(e).indexOf('writing') !== -1;
    },
    music: function (e) {
      return getCats(e).indexOf('music') !== -1;
    },
    visual: function (e) {
      var c = getCats(e);
      return c.indexOf('visual-art') !== -1 || c.indexOf('video') !== -1;
    },
    experiments: function (e) {
      var c = getCats(e);
      return c.indexOf('web-design') !== -1 || c.indexOf('experiments') !== -1 || c.indexOf('concept') !== -1;
    }
  };

  function getCats(entry) {
    return entry.categories || [entry.category];
  }

  window.initRoom = function (roomKey, renderFn) {
    fetch('/catalog.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var entries = data.filter(roomFilters[roomKey]);
        entries.sort(function (a, b) { return b.year - a.year; });
        renderFn(entries);
      })
      .catch(function () {
        var el = document.getElementById('room-entries');
        if (el) el.innerHTML = '<p class="room-placeholder__text">Could not load entries.</p>';
      });
  };

  window.displayCount = function (count) {
    var el = document.querySelector('.counter-display');
    if (el) el.textContent = count.toString().padStart(8, '0');
  };

  // Group entries by year, return ordered array of { year, entries }
  window.groupByYear = function (entries) {
    var map = new Map();
    entries.forEach(function (e) {
      if (!map.has(e.year)) map.set(e.year, []);
      map.get(e.year).push(e);
    });
    var groups = [];
    map.forEach(function (items, year) {
      groups.push({ year: year, entries: items });
    });
    return groups;
  };

  // Extract review quote from description (text between first "" pair)
  window.extractQuote = function (desc) {
    if (!desc) return null;
    var match = desc.match(/"([^"]+)"/);
    if (!match) match = desc.match(/\u201c([^\u201d]+)\u201d/);
    return match ? match[1] : null;
  };

  // Strip the quote portion from a description to get the role/context info
  window.stripQuote = function (desc) {
    if (!desc) return '';
    return desc.replace(/\s*"[^"]*"\s*—\s*[^"]*$/, '')
               .replace(/\s*\u201c[^\u201d]*\u201d\s*\u2014\s*.*$/, '')
               .replace(/\s*$/, '');
  };
})();
