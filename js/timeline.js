(function () {
  "use strict";

  var data = window.TIMELINE_EXPERIENCES || [];
  var container = document.getElementById("timeline-root");
  var typeFilters = document.querySelectorAll("input[name='timeline-type']");
  var tagInput = document.getElementById("timeline-tag-filter");
  var clearTagBtn = document.getElementById("timeline-tag-clear");
  var emptyState = document.getElementById("timeline-empty");
  var tagChips = document.getElementById("timeline-suggested-tags");

  function parseSortKey(item) {
    if (item.sortKey && /^\d{4}(-\d{2})?$/.test(String(item.sortKey).trim())) {
      return new Date(String(item.sortKey) + (String(item.sortKey).length === 4 ? "-01" : "")).getTime();
    }
    return 0;
  }

  function getSelectedTypes() {
    var selected = [];
    typeFilters.forEach(function (input) {
      if (input.checked) selected.push(input.value);
    });
    return selected;
  }

  function getTagQuery() {
    if (!tagInput) return "";
    return tagInput.value.trim().toLowerCase();
  }

  function allTags() {
    var set = new Map();
    data.forEach(function (item) {
      (item.tags || []).forEach(function (t) {
        var s = String(t).trim();
        if (s) set.set(s.toLowerCase(), s);
      });
    });
    return Array.from(set.values()).sort(function (a, b) {
      return a.localeCompare(b, undefined, { sensitivity: "base" });
    });
  }

  function itemMatchesFilter(item) {
    var types = getSelectedTypes();
    if (types.length && item.type && types.indexOf(item.type) === -1) return false;

    var q = getTagQuery();
    if (q) {
      var tagStr = (item.tags || [])
        .join(" ")
        .toLowerCase();
      var inTitle = (item.title || "").toLowerCase().indexOf(q) !== -1;
      var inSummary = (item.summary || "").toLowerCase().indexOf(q) !== -1;
      var tagMatch = (item.tags || []).some(function (t) {
        return String(t).toLowerCase().indexOf(q) !== -1;
      });
      if (!inTitle && !inSummary && !tagMatch) return false;
    }
    return true;
  }

  function linkClass(kind) {
    if (kind === "play") return "btn btn-timeline btn-play";
    if (kind === "github") return "btn btn-timeline btn-github";
    return "btn btn-timeline";
  }

  function typeLabel(t) {
    if (t === "work") return "Work";
    if (t === "game") return "Game";
    if (t === "project") return "Project";
    return t || "";
  }

  function render() {
    if (!container) return;

    var sorted = data
      .slice()
      .sort(function (a, b) {
        return parseSortKey(b) - parseSortKey(a);
      });

    var list = sorted.filter(itemMatchesFilter);

    container.innerHTML = "";
    if (emptyState) emptyState.hidden = list.length > 0;

    list.forEach(function (item, i) {
      var article = document.createElement("article");
      article.className = "timeline-card" + (item.status === "draft" ? " timeline-card--draft" : "");
      article.setAttribute("data-id", item.id || "");
      article.setAttribute("role", "listitem");

      var isLeft = i % 2 === 0;
      var inner = document.createElement("div");
      inner.className = "timeline-card__inner" + (isLeft ? " timeline-card__inner--left" : " timeline-card__inner--right");

      var hasPreview = item.preview && String(item.preview).trim();
      if (hasPreview) {
        var media = document.createElement("div");
        media.className = "timeline-card__media";
        var img = document.createElement("img");
        img.className = "timeline-card__preview";
        img.src = item.preview;
        img.alt = "";
        img.loading = "lazy";
        img.decoding = "async";
        media.appendChild(img);
        inner.appendChild(media);
      }

      var body = document.createElement("div");
      body.className = "timeline-card__body";

      var meta = document.createElement("div");
      meta.className = "timeline-card__meta";
      var timeEl = document.createElement("time");
      timeEl.setAttribute("datetime", item.sortKey || "");
      timeEl.textContent = item.dateLabel || "—";
      var badge = document.createElement("span");
      badge.className = "timeline-type timeline-type--" + (item.type || "other");
      badge.textContent = typeLabel(item.type);
      meta.appendChild(timeEl);
      meta.appendChild(badge);

      var h3 = document.createElement("h3");
      h3.className = "timeline-card__title";
      h3.textContent = item.title || "Untitled";

      var p = document.createElement("p");
      p.className = "timeline-card__summary";
      p.textContent = item.summary || "";

      body.appendChild(meta);
      body.appendChild(h3);
      body.appendChild(p);

      if (item.status === "draft") {
        var note = document.createElement("p");
        note.className = "timeline-draft-note";
        note.textContent = "Work in progress — add more detail in js/timeline-data.js when you’re ready.";
        body.appendChild(note);
      }

      var tagRow = document.createElement("div");
      tagRow.className = "timeline-card__tags";
      (item.tags || []).forEach(function (t) {
        var chip = document.createElement("span");
        chip.className = "chip timeline-chip";
        chip.textContent = t;
        chip.setAttribute("role", "listitem");
        tagRow.appendChild(chip);
      });
      if (tagRow.children.length) body.appendChild(tagRow);

      if (item.links && item.links.length) {
        var actions = document.createElement("div");
        actions.className = "timeline-actions";
        item.links.forEach(function (link) {
          var a = document.createElement("a");
          a.className = linkClass(link.kind);
          a.href = link.url;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.textContent = link.label || "Link";
          actions.appendChild(a);
        });
        body.appendChild(actions);
      }

      if (!hasPreview) {
        inner.classList.add("timeline-card__inner--text-only");
      }
      inner.appendChild(body);
      article.appendChild(inner);
      container.appendChild(article);
    });
  }

  function renderSuggestedTags() {
    if (!tagChips) return;
    tagChips.innerHTML = "";
    allTags().forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tag-suggestion";
      b.textContent = t;
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () {
        if (!tagInput) return;
        if (b.getAttribute("aria-pressed") === "true") {
          tagInput.value = "";
          b.setAttribute("aria-pressed", "false");
        } else {
          tagChips.querySelectorAll(".tag-suggestion").forEach(function (x) {
            x.setAttribute("aria-pressed", "false");
          });
          tagInput.value = t;
          b.setAttribute("aria-pressed", "true");
        }
        render();
      });
      tagChips.appendChild(b);
    });
  }

  typeFilters.forEach(function (input) {
    input.addEventListener("change", render);
  });
  if (tagInput) {
    tagInput.addEventListener("input", function () {
      render();
    });
  }
  if (clearTagBtn && tagInput) {
    clearTagBtn.addEventListener("click", function () {
      tagInput.value = "";
      if (tagChips) {
        tagChips.querySelectorAll(".tag-suggestion").forEach(function (x) {
          x.setAttribute("aria-pressed", "false");
        });
      }
      render();
    });
  }

  renderSuggestedTags();
  render();
})();
