(function () {
  "use strict";

  const TYPE_ALL = "all";

  var state = {
    items: [],
    category: TYPE_ALL,
    activeTags: new Set()
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

  function byTags(item) {
    if (state.activeTags.size === 0) return true;
    var t = item.tags && item.tags.length ? item.tags : [];
    var need = [];
    state.activeTags.forEach(function (tag) {
      need.push(tag);
    });
    for (var i = 0; i < need.length; i++) {
      if (t.indexOf(need[i]) === -1) return false;
    }
    return true;
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
      var on = state.activeTags.has(t);
      html +=
        "<button type=\"button\" class=\"filter-tag" +
        (on ? " is-active" : "") +
        "\" data-tag-filter=\"" +
        esc(t) +
        "\">" +
        esc(t) +
        "</button>";
    }
    if (state.activeTags.size) {
      html += "<button type=\"button\" class=\"filter-clear\" id=\"clear-tags\">Clear tag filters</button>";
    }
    el.innerHTML = html;

    el.querySelectorAll("[data-tag-filter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var tag = btn.getAttribute("data-tag-filter");
        if (state.activeTags.has(tag)) state.activeTags.delete(tag);
        else state.activeTags.add(tag);
        render();
      });
    });
    var clearBtn = el.querySelector("#clear-tags");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        state.activeTags.clear();
        render();
      });
    }
  }

  function wireCategoryButtons() {
    var wrap = document.getElementById("type-filter");
    if (!wrap) return;
    wrap.querySelectorAll("[data-type]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.category = b.getAttribute("data-type");
        state.activeTags.clear();
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
        var tagBtn = e.target.closest(".tag-chip[data-tag]");
        if (tagBtn) {
          e.preventDefault();
          var t = tagBtn.getAttribute("data-tag");
          state.activeTags.add(t);
          var catBtn = document.querySelector(
            "#type-filter [data-type='" + state.category + "']"
          );
          if (catBtn) {
            document.querySelectorAll("#type-filter [data-type]").forEach(function (x) {
              x.classList.toggle("is-active", x === catBtn);
            });
          }
          render();
        }
      });
    }
  }

  function render() {
    var listEl = document.getElementById("timeline-list");
    if (!listEl) return;

    var catFiltered = state.items.filter(byCategory);
    var tagsInView = collectAllTags(catFiltered);
    state.activeTags.forEach(function (t) {
      if (tagsInView.indexOf(t) === -1) state.activeTags.delete(t);
    });
    var filtered = sortedItems(catFiltered.filter(byTags));
    updateTagFilterBar(tagsInView);

    if (filtered.length === 0) {
      listEl.innerHTML =
        '<p class="filter-empty" role="status">No items match. Try a different type or clear tag filters.</p>';
      return;
    }

    var y = 0;
    var html = '<div class="timeline-rail" aria-hidden="true"></div><ol class="timeline-ol">';
    for (var i = 0; i < filtered.length; i++) {
      var it = filtered[i];
      y = (it.end || it.start || "")
        .split("-")
        .map(function (n) { return parseInt(n, 10) || 0; })[0] || y;
      var dateStr = formatRange(it.start, it.end);
      html +=
        '<li class="timeline-item"><div class="timeline-item__date">' +
        esc(dateStr) +
        '</div><div class="timeline-item__line" aria-hidden="true"></div><div class="timeline-item__dot" aria-hidden="true"></div>' +
        renderCard(it) +
        "</li>";
    }
    html += "</ol>";
    listEl.innerHTML = html;
  }

  function init(data) {
    if (!data || !data.items) return;
    state.items = data.items;
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
            el.innerHTML =
              '<p class="filter-empty">Could not load experiences. Open this site from a local or hosted URL (JSON fetch).</p>';
          }
        });
    } else {
      document.addEventListener("DOMContentLoaded", function () {
        var el = document.getElementById("timeline-list");
        if (el) {
          el.innerHTML =
            '<p class="filter-empty">Set data in data/experiences.json or use static hosting to see the full timeline.</p>';
        }
      });
    }
  }
})();
