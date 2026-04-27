(function () {
  "use strict";

  var data = window.TIMELINE_EXPERIENCES || [];
  var TYPE_LABELS = { work: "Work", project: "Project", game: "Game" };
  var TYPE_CLASS = { work: "type-work", project: "type-project", game: "type-game" };

  function byDateDesc(a, b) {
    var as = a.dateStart || "";
    var bs = b.dateStart || "";
    if (as !== bs) return bs.localeCompare(as);
    var ae = a.dateEnd || "\uffff";
    var be = b.dateEnd || "\uffff";
    return be.localeCompare(ae);
  }

  function formatRange(item) {
    var start = item.dateStart || "—";
    var end = item.dateEnd == null ? "Present" : item.dateEnd;
    return start + " — " + end;
  }

  function uniqueTags(list) {
    var set = {};
    var reserved = { all: true };
    list.forEach(function (item) {
      (item.tags || []).forEach(function (t) {
        var n = (t || "").trim();
        if (!n) return;
        if (reserved[n.toLowerCase()]) return;
        set[n.toLowerCase()] = t;
      });
    });
    return Object.keys(set)
      .map(function (k) {
        return set[k];
      })
      .sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      });
  }

  var state = { category: "all", tagQuery: "" };

  function el(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text != null) n.textContent = text;
    return n;
  }

  function matchesCategory(item) {
    if (state.category === "all") return true;
    return item.type === state.category;
  }

  function matchesTagQuery(item) {
    var q = (state.tagQuery || "").trim().toLowerCase();
    if (!q) return true;
    var tags = item.tags || [];
    return tags.some(function (t) {
      return (t || "").toLowerCase().indexOf(q) !== -1;
    });
  }

  function filtered() {
    return data
      .filter(matchesCategory)
      .filter(matchesTagQuery)
      .sort(byDateDesc);
  }

  function renderTagChips(container) {
    container.innerHTML = "";
    var allTags = uniqueTags(data);
    var clearBtn = el("button", "tag-chip tag-chip-clear", "All tags");
    clearBtn.type = "button";
    clearBtn.setAttribute("aria-pressed", state.tagQuery ? "false" : "true");
    if (!state.tagQuery) clearBtn.classList.add("is-active");
    clearBtn.addEventListener("click", function () {
      var input = document.getElementById("timeline-tag-search");
      if (input) input.value = "";
      state.tagQuery = "";
      render();
    });
    container.appendChild(clearBtn);
    allTags.forEach(function (tag) {
      var btn = el("button", "tag-chip", tag);
      btn.type = "button";
      var active = state.tagQuery && tag.toLowerCase() === state.tagQuery.toLowerCase();
      if (active) {
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
      } else btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("click", function () {
        var input = document.getElementById("timeline-tag-search");
        var next = active ? "" : tag;
        if (input) input.value = next;
        state.tagQuery = next;
        render();
      });
    });
  }

  function setCategoryFilter(cat) {
    state.category = cat;
    document.querySelectorAll(".filter-btn").forEach(function (btn) {
      var c = btn.getAttribute("data-filter");
      var on = c === cat;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    render();
  }

  function buildActionsBlock(item) {
    var actions = item.actions;
    if (!actions || !actions.length) return null;
    var wrap = el("div", "timeline-actions");
    actions.forEach(function (a) {
      if (!a || !a.url) return;
      var v = a.variant || "link";
      var className = "action-btn action-" + v;
      var link = el("a", className, a.label);
      link.href = a.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      wrap.appendChild(link);
    });
    return wrap.children.length ? wrap : null;
  }

  function buildCard(item) {
    var card = el("article", "timeline-card");
    if (item.previewImage) card.classList.add("img-fade-card");
    if (item.draft) card.classList.add("is-draft");
    if (item.previewImage) {
      var img = document.createElement("img");
      img.src = item.previewImage;
      img.alt = "";
      img.className = "card-bgimg";
      img.setAttribute("aria-hidden", "true");
      card.appendChild(img);
    }
    var inner = el("div", "timeline-card-inner");
    var meta = el("div", "timeline-card-meta");
    var typePill = el("span", "type-pill " + (TYPE_CLASS[item.type] || "type-project"), TYPE_LABELS[item.type] || item.type);
    meta.appendChild(typePill);
    if (item.draft) meta.appendChild(el("span", "draft-pill", "Draft — fill in details later"));
    inner.appendChild(meta);
    inner.appendChild(el("h3", "timeline-title", item.title));
    inner.appendChild(el("p", "timeline-dates", formatRange(item)));
    inner.appendChild(el("p", "timeline-summary", item.summary || ""));
    var tags = item.tags || [];
    if (tags.length) {
      var row = el("div", "tag-row");
      tags.forEach(function (t) {
        row.appendChild(el("span", "chip", t));
      });
      inner.appendChild(row);
    }
    var ab = buildActionsBlock(item);
    if (ab) inner.appendChild(ab);
    card.appendChild(inner);
    return card;
  }

  function render() {
    var listEl = document.getElementById("timeline-list");
    var emptyEl = document.getElementById("timeline-empty");
    var tagBar = document.getElementById("timeline-tag-chips");
    if (!listEl) return;
    listEl.innerHTML = "";
    if (tagBar) renderTagChips(tagBar);
    var items = filtered();
    if (emptyEl) emptyEl.hidden = items.length > 0;
    items.forEach(function (item) {
      var li = el("li", "timeline-item");
      var linePart = el("div", "timeline-line-part");
      linePart.appendChild(el("span", "timeline-dot", ""));
      li.appendChild(linePart);
      li.appendChild(buildCard(item));
      listEl.appendChild(li);
    });
  }

  function init() {
    var form = document.getElementById("filter-form");
    if (form) {
      form.addEventListener("click", function (e) {
        var t = e.target;
        if (t && t.classList && t.classList.contains("filter-btn")) {
          e.preventDefault();
          setCategoryFilter(t.getAttribute("data-filter") || "all");
        }
      });
    }
    var search = document.getElementById("timeline-tag-search");
    if (search) {
      var deb;
      search.addEventListener("input", function () {
        clearTimeout(deb);
        deb = setTimeout(function () {
          state.tagQuery = search.value;
          render();
        }, 120);
      });
    }
    setCategoryFilter("all");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
