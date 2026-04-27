(function () {
  "use strict";

  const TYPE_ALL = "all";

  var state = {
    items: [],
    category: TYPE_ALL,
    activeTagList: [],
    searchQuery: ""
  };

  function parseMonth(ym) {
    if (!ym) return 0;
    var p = String(ym).split("-");
    if (p.length < 2) return 0;
    var y = parseInt(p[0], 10) || 0;
    var m = parseInt(p[1], 10) || 0;
    return y * 12 + (m - 1);
  }

  function formatRange(start, end) {
    if (!start && !end) return "Date TBA";
    var a = formatMonthLabel(start);
    if (!end) return a + " \u2013 Present";
    return a + " \u2013 " + formatMonthLabel(end);
  }

  function formatMonthLabel(ym) {
    if (!ym) return "";
    var p = String(ym).split("-");
    var y = parseInt(p[0], 10);
    var m = parseInt(p[1], 10) || 1;
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames[m - 1] + " " + y;
  }

  function getItemYear(item) {
    var s = item.end || item.start;
    if (!s) return 0;
    return parseInt(String(s).split("-")[0], 10) || 0;
  }

  function sortKey(item) {
    var endM = item.end ? parseMonth(item.end) : 9999 * 12;
    var startM = item.start ? parseMonth(item.start) : 0;
    return { end: endM, start: startM };
  }

  function sortedItems(list) {
    return list.slice().sort(function (a, b) {
      var ka = sortKey(a);
      var kb = sortKey(b);
      if (kb.end !== ka.end) return kb.end - ka.end;
      return kb.start - ka.start;
    });
  }

  function byCategory(item) {
    if (state.category === TYPE_ALL) return true;
    return item.type === state.category;
  }

  function itemHasAllTags(item) {
    if (state.activeTagList.length === 0) return true;
    var t = item.tags && item.tags.length ? item.tags : [];
    for (var i = 0; i < state.activeTagList.length; i++) {
      if (t.indexOf(state.activeTagList[i]) === -1) return false;
    }
    return true;
  }

  function buildSearchBlob(item) {
    var parts = [item.title, item.organization, item.summary];
    if (item.tags) parts = parts.concat(item.tags);
    return parts
      .filter(function (p) { return p != null && p !== ""; })
      .join(" \n ")
      .toLowerCase();
  }

  function bySearch(item) {
    var q = (state.searchQuery || "").trim().toLowerCase();
    if (!q) return true;
    return buildSearchBlob(item).indexOf(q) !== -1;
  }

  function typeLabel(t) {
    if (t === "work") return "Work";
    if (t === "project") return "Project";
    if (t === "game") return "Game";
    return t;
  }

  function esc(s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderCard(item) {
    var hasPreview = item.preview && item.preview.image;
    var draft = item.complete === false;
    var links = item.links || {};
    var extra = links.extra && Array.isArray(links.extra) ? links.extra : [];

    var body =
      '<article class="timeline-card' +
      (draft ? " timeline-card--draft" : "") +
      (hasPreview ? " timeline-card--has-preview" : "") +
      '">' +
      (hasPreview
        ? '<div class="timeline-card__media"><img class="timeline-card__img" src="' +
          esc(item.preview.image) +
          '" alt="' +
          esc(item.preview.alt || item.title) +
          '" loading="lazy"></div>'
        : "") +
      '<div class="timeline-card__body">' +
      '<span class="timeline-pill timeline-pill--' +
      esc(item.type) +
      '">' +
      typeLabel(item.type) +
      "</span>" +
      (draft
        ? '<span class="timeline-pill timeline-pill--draft">In progress</span>'
        : "") +
      "<h3>" +
      esc(item.title) +
      "</h3>" +
      (item.organization
        ? '<p class="timeline-card__org">' + esc(item.organization) + "</p>"
        : "") +
      '<p class="timeline-card__date">' +
      formatRange(item.start, item.end) +
      "</p>" +
      (item.summary ? '<p class="timeline-card__summary">' + esc(item.summary) + "</p>" : "") +
      '<ul class="timeline-chips" role="list">';

    var tags = item.tags || [];
    for (var i = 0; i < tags.length; i++) {
      var tag = tags[i];
      body +=
        '<li><button type="button" class="tag-chip" data-tag="' +
        esc(tag) +
        '">' +
        esc(tag) +
        "</button></li>";
    }
    body += '</ul><div class="timeline-card__actions">';

    if (links.play) {
      body +=
        '<a class="btn btn--small" href="' +
        esc(links.play) +
        '" target="_blank" rel="noopener">Play / Demo</a>';
    }
    if (links.github) {
      body +=
        '<a class="btn btn--outline btn--small" href="' +
        esc(links.github) +
        '" target="_blank" rel="noopener">GitHub</a>';
    }
    for (var j = 0; j < extra.length; j++) {
      var ex = extra[j];
      if (ex && ex.url) {
        body +=
          '<a class="btn btn--outline btn--small" href="' +
          esc(ex.url) +
          '" target="_blank" rel="noopener">' +
          esc(ex.label || "Link") +
          "</a>";
      }
    }
    body += "</div></div></article>";
    return body;
  }

  function collectAllTags(list) {
    var set = {};
    for (var i = 0; i < list.length; i++) {
      var tags = list[i].tags || [];
      for (var j = 0; j < tags.length; j++) set[tags[j]] = true;
    }
    return Object.keys(set).sort();
  }

  function renderActiveTagPills() {
    var el = document.getElementById("active-tag-pills");
    if (!el) return;
    if (state.activeTagList.length === 0) {
      el.innerHTML = "";
      el.setAttribute("hidden", "");
      return;
    }
    el.removeAttribute("hidden");
    var html = '<ul class="active-pills__list" role="list">';
    for (var i = 0; i < state.activeTagList.length; i++) {
      var t = state.activeTagList[i];
      html +=
        '<li class="active-pill">' +
        '<span class="active-pill__text">' +
        esc(t) +
        '</span><button type="button" class="active-pill__remove" data-remove-tag="' +
        esc(t) +
        '" aria-label="Remove ' +
        esc(t) +
        ' from filters">&times;</button></li>';
    }
    html += "</ul>";
    el.innerHTML = html;

    el.querySelectorAll("[data-remove-tag]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var tag = btn.getAttribute("data-remove-tag");
        var idx = state.activeTagList.indexOf(tag);
        if (idx !== -1) state.activeTagList.splice(idx, 1);
        render();
      });
    });
  }

  function updateTagFilterBar(allTags) {
    var el = document.getElementById("tag-filter");
    if (!el) return;
    if (allTags.length === 0) {
      el.innerHTML = "<p class=\"filter-empty\">No tags in this view.</p>";
      return;
    }
    var html = "";
    for (var k = 0; k < allTags.length; k++) {
      var t = allTags[k];
      var on = state.activeTagList.indexOf(t) !== -1;
      html +=
        "<button type=\"button\" class=\"filter-tag" +
        (on ? " is-active" : "") +
        "\" data-tag-filter=\"" +
        esc(t) +
        "\">" +
        esc(t) +
        "</button>";
    }
    el.innerHTML = html;

    el.querySelectorAll("[data-tag-filter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var tag = btn.getAttribute("data-tag-filter");
        state.activeTagList = state.activeTagList.filter(function (t) { return t !== tag; });
        state.activeTagList.push(tag);
        render();
      });
    });
  }

  function wireSearch() {
    var input = document.getElementById("timeline-search");
    if (!input) return;
    input.addEventListener("input", function () {
      state.searchQuery = input.value;
      render();
    });
  }

  function wireCategoryButtons() {
    var wrap = document.getElementById("type-filter");
    if (!wrap) return;
    wrap.querySelectorAll("[data-type]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.category = b.getAttribute("data-type");
        state.activeTagList = [];
        render();
        wrap.querySelectorAll("[data-type]").forEach(function (x) {
          x.classList.toggle("is-active", x.getAttribute("data-type") === state.category);
        });
      });
    });
  }

  function wireListDelegate() {
    var root = document.getElementById("timeline-list");
    if (root) {
      root.addEventListener("click", function (e) {
        var removeOnly = e.target.closest(".active-pill__remove");
        if (removeOnly) return;
        var tagBtn = e.target.closest(".tag-chip[data-tag]");
        if (tagBtn) {
          e.preventDefault();
          var t = tagBtn.getAttribute("data-tag");
          state.activeTagList = state.activeTagList.filter(function (x) { return x !== t; });
          state.activeTagList.push(t);
          render();
        }
      });
    }
  }

  function groupByYearDesc(items) {
    var byYear = {};
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var y = getItemYear(it) || 0;
      if (!byYear[y]) byYear[y] = [];
      byYear[y].push(it);
    }
    var years = Object.keys(byYear)
      .map(function (k) { return parseInt(k, 10); })
      .filter(function (y) { return y > 0; })
      .sort(function (a, b) { return b - a; });
    if (byYear[0] && byYear[0].length) {
      years.push(0);
    }
    return { byYear: byYear, years: years };
  }

  function renderHorizontalTimeline(filtered) {
    var g = groupByYearDesc(filtered);
    if (g.years.length === 0) {
      return '<p class="filter-empty" role="status">No results.</p>';
    }

    var out =
      '<div class="h-timeline__scroller" tabindex="0">' +
      '<div class="h-timeline__flow" role="presentation">';

    for (var yIdx = 0; yIdx < g.years.length; yIdx++) {
      var year = g.years[yIdx];
      var yearItems = sortedItems(g.byYear[year] || []);
      if (!yearItems.length) continue;
      if (yIdx > 0) {
        out += '<div class="h-timeline__between" aria-hidden="true"><div class="h-timeline__between-line"></div></div>';
      }

      var n = yearItems.length;
      var yLabel = year > 0 ? String(year) : "Other";

      out +=
        '<section class="h-year" data-year="' +
        esc(String(year)) +
        '" aria-label="' +
        esc(yLabel) +
        '">' +
        '<h3 class="h-year__label">' +
        esc(yLabel) +
        "</h3>" +
        '<div class="h-year__grid" style="grid-template-columns: repeat(' +
        n +
        ', minmax(200px, 1fr))">';

      for (var c = 0; c < n; c++) {
        var isUp = c % 2 === 0;
        if (isUp) {
          out += '<div class="h-year__cell h-year__cell--up">' + renderCard(yearItems[c]) + "</div>";
        } else {
          out += "<div class=\"h-year__cell h-year__cell--emp\"></div>";
        }
      }

      for (var t = 0; t < n; t++) {
        out += '<div class="h-year__trunk" aria-hidden="true"><span class="h-year__dot"></span></div>';
      }

      for (var b = 0; b < n; b++) {
        var isDown = b % 2 === 1;
        if (isDown) {
          out += '<div class="h-year__cell h-year__cell--down">' + renderCard(yearItems[b]) + "</div>";
        } else {
          out += "<div class=\"h-year__cell h-year__cell--emp\"></div>";
        }
      }

      out += "</div></section>";
    }

    out += "</div></div>";
    return out;
  }

  function render() {
    var listEl = document.getElementById("timeline-list");
    if (!listEl) return;

    var catFiltered = state.items.filter(byCategory);
    var tagsInView = collectAllTags(catFiltered);
    var valid = {};
    for (var vi = 0; vi < tagsInView.length; vi++) valid[tagsInView[vi]] = true;
    state.activeTagList = state.activeTagList.filter(function (t) {
      return valid[t];
    });

    var searchFiltered = catFiltered.filter(bySearch);
    var filtered = sortedItems(searchFiltered.filter(itemHasAllTags));
    updateTagFilterBar(tagsInView);
    renderActiveTagPills();

    if (filtered.length === 0) {
      listEl.innerHTML = '<p class="filter-empty" role="status">No results.</p>';
      return;
    }

    listEl.innerHTML = renderHorizontalTimeline(filtered);
  }

  function init(data) {
    if (!data || !data.items) return;
    state.items = data.items;
    wireSearch();
    wireCategoryButtons();
    wireListDelegate();
    render();
  }

  if (window.EXPERIENCES_DATA) {
    document.addEventListener("DOMContentLoaded", function () {
      init(window.EXPERIENCES_DATA);
    });
  } else {
    var path = document.body && document.body.getAttribute("data-experiences-url");
    if (path) {
      fetch(path)
        .then(function (r) {
          if (!r.ok) throw new Error("load");
          return r.json();
        })
        .then(init)
        .catch(function () {
          var el = document.getElementById("timeline-list");
          if (el) {
            el.innerHTML = '<p class="filter-empty">Unable to load projects.</p>';
          }
        });
    } else {
      document.addEventListener("DOMContentLoaded", function () {
        var el = document.getElementById("timeline-list");
        if (el) {
          el.innerHTML = '<p class="filter-empty">Unable to load projects.</p>';
        }
      });
    }
  }
})();
