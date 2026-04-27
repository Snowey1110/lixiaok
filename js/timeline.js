(function () {
  "use strict";

  var data = window.TIMELINE_EXPERIENCES || [];
  var container = document.getElementById("timeline-root");
  var typeSelected = { work: true, project: true, game: true };
  var typeButtons = document.querySelectorAll(
    "button.seg-btn[data-timeline-type]"
  );
  var tagInput = document.getElementById("timeline-tag-filter");
  var clearTagBtn = document.getElementById("timeline-tag-clear");
  var emptyState = document.getElementById("timeline-empty");
  var tagChips = document.getElementById("timeline-suggested-tags");
  var activeTagBar = document.getElementById("timeline-active-tags");

  /** @type {string[]} normalized lowercase */
  var activeFilterTags = [];

  var SPINE_MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  function parseSortKey(item) {
    var s = String(item.sortKey || "").trim();
    if (!s) return 0;
    if (/^\d{4}(-\d{2}(-\d{2})?)?$/.test(s)) {
      if (s.length === 4) s += "-01-01";
      else if (s.length === 7) s += "-01";
      return new Date(s + "T12:00:00").getTime();
    }
    return 0;
  }

  function getItemSortDate(item) {
    var n = parseSortKey(item);
    if (!n) return null;
    return new Date(n);
  }

  function formatSpineMonthYear(d) {
    if (!d || isNaN(d.getTime())) return "—";
    return SPINE_MONTHS[d.getMonth()] + " " + d.getFullYear();
  }

  function getSelectedTypes() {
    var out = [];
    if (typeSelected.work) out.push("work");
    if (typeSelected.project) out.push("project");
    if (typeSelected.game) out.push("game");
    return out;
  }

  function syncTypeButtons() {
    typeButtons.forEach(function (btn) {
      var v = btn.getAttribute("data-timeline-type");
      if (!v || !Object.prototype.hasOwnProperty.call(typeSelected, v)) return;
      var on = typeSelected[v];
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function getSearchQuery() {
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

  function tagListLower(item) {
    return (item.tags || []).map(function (t) {
      return String(t).toLowerCase();
    });
  }

  function itemHasTagToken(item, tokenLower) {
    if (tagListLower(item).indexOf(tokenLower) !== -1) return true;
    return false;
  }

  function itemMatchesAllActiveTags(item) {
    for (var i = 0; i < activeFilterTags.length; i++) {
      var t = activeFilterTags[i];
      if (!itemHasTagToken(item, t)) return false;
    }
    return true;
  }

  function itemMatchesSearch(item) {
    var q = getSearchQuery();
    if (!q) return true;
    var blob =
      (item.title || "") +
      " " +
      (item.summary || "") +
      " " +
      (item.role || "") +
      " " +
      (item.tags || []).join(" ");
    return blob.toLowerCase().indexOf(q) !== -1;
  }

  function itemMatchesFilter(item) {
    var types = getSelectedTypes();
    if (types.length === 0) return false;
    if (item.type && types.indexOf(item.type) === -1) return false;
    if (!itemMatchesAllActiveTags(item)) return false;
    if (!itemMatchesSearch(item)) return false;
    return true;
  }

  function linkClass(kind) {
    if (kind === "play") return "btn btn-timeline btn-play";
    if (kind === "github") return "btn btn-timeline btn-github";
    return "btn btn-timeline";
  }

  function typeLabel(t) {
    if (t === "work") return "Work";
    if (t === "game") return "Game Dev";
    if (t === "project") return "Experiences";
    return t || "";
  }

  function itemCategoryBadgeText(item) {
    if (Object.prototype.hasOwnProperty.call(item, "badge")) {
      if (item.badge === null || item.badge === "") return null;
      return String(item.badge);
    }
    return typeLabel(item.type);
  }

  function addFilterTagFromCanonical(canonical) {
    var key = String(canonical).trim().toLowerCase();
    if (!key) return;
    if (activeFilterTags.indexOf(key) !== -1) return;
    activeFilterTags.push(key);
  }

  function removeFilterTagAt(i) {
    activeFilterTags.splice(i, 1);
  }

  function renderActiveTagBar() {
    if (!activeTagBar) return;
    activeTagBar.innerHTML = "";
    if (!activeFilterTags.length) {
      activeTagBar.hidden = true;
      return;
    }
    activeTagBar.hidden = false;
    activeFilterTags.forEach(function (key, index) {
      var display;
      var canonicals = allTags();
      for (var ci = 0; ci < canonicals.length; ci++) {
        if (canonicals[ci].toLowerCase() === key) {
          display = canonicals[ci];
          break;
        }
      }
      if (display == null) display = key;
      var wrap = document.createElement("span");
      wrap.className = "active-filter-chip";
      var label = document.createElement("span");
      label.className = "active-filter-chip__text";
      label.textContent = display;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "active-filter-chip__remove";
      btn.setAttribute("aria-label", "Remove filter " + display);
      btn.innerHTML = "&times;";
      btn.addEventListener("click", function () {
        removeFilterTagAt(index);
        renderActiveTagBar();
        render();
        renderSuggestedTags();
      });
      wrap.appendChild(label);
      wrap.appendChild(btn);
      activeTagBar.appendChild(wrap);
    });
  }

  function render() {
    if (!container) return;

    var sorted = data.slice().sort(function (a, b) {
      var pinA = a.pinFirst ? 1 : 0;
      var pinB = b.pinFirst ? 1 : 0;
      if (pinA !== pinB) return pinB - pinA;
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
      article.classList.add("timeline-card--with-spine");

      var d = getItemSortDate(item);
      var dPrev = i > 0 ? getItemSortDate(list[i - 1]) : null;
      var isYearPeg = false;
      if (d) {
        if (i > 0 && dPrev) {
          isYearPeg = d.getFullYear() !== dPrev.getFullYear();
        } else if (i === 0) {
          isYearPeg = true;
        }
      }
      if (isYearPeg) {
        article.classList.add("timeline-card--with-year-peg");
      }

      var isLeft = i % 2 === 0;
      if (isLeft) {
        article.classList.add("timeline-card--spine-outside-right");
      } else {
        article.classList.add("timeline-card--spine-outside-left");
      }

      var spine = document.createElement("div");
      spine.className = "timeline__spine";
      spine.setAttribute("aria-hidden", "true");
      if (isYearPeg) {
        var ypeg = document.createElement("div");
        ypeg.className = "timeline__year-peg";
        var ydot = document.createElement("span");
        ydot.className = "timeline__year-peg__dot";
        ypeg.appendChild(ydot);
        var ytxt = document.createElement("span");
        ytxt.className = "timeline__year-peg__text";
        ytxt.textContent = d ? String(d.getFullYear()) : "—";
        ypeg.appendChild(ytxt);
        spine.appendChild(ypeg);
      }
      var mpeg = document.createElement("div");
      mpeg.className = "timeline__month-peg";
      if (d) {
        mpeg.textContent = isYearPeg
          ? SPINE_MONTHS[d.getMonth()]
          : formatSpineMonthYear(d);
      } else {
        mpeg.textContent = "—";
      }
      spine.appendChild(mpeg);
      article.appendChild(spine);

      var inner = document.createElement("div");
      var hasPreview = item.preview && String(item.preview).trim();
      var posClass = isLeft ? " timeline-card__inner--left" : " timeline-card__inner--right";
      if (hasPreview) {
        inner.className = "timeline-card__inner" + posClass;
        if (item.topRightLabel) inner.classList.add("timeline-card__inner--pos");
        var media = document.createElement("div");
        media.className = "timeline-card__media" + (item.id === "tech-academy-intern" ? " timeline-card__media--tech-academy" : "");
        var img = document.createElement("img");
        img.className = "timeline-card__preview";
        img.src = item.preview;
        img.alt = "";
        img.loading = "lazy";
        img.decoding = "async";
        media.appendChild(img);
        inner.appendChild(media);
      } else {
        inner.className = "timeline-card__inner timeline-card__inner--text-only" + posClass;
        if (item.topRightLabel) inner.classList.add("timeline-card__inner--pos");
      }

      if (item.topRightLabel) {
        var corner = document.createElement("span");
        corner.className = "timeline-card__top-right";
        corner.textContent = String(item.topRightLabel);
        corner.setAttribute("aria-label", "Label: " + String(item.topRightLabel));
        inner.appendChild(corner);
      }

      var body = document.createElement("div");
      body.className = "timeline-card__body";

      var meta = document.createElement("div");
      meta.className = "timeline-card__meta";
      var timeEl = document.createElement("time");
      timeEl.setAttribute("datetime", item.sortKey || "");
      timeEl.textContent = item.dateLabel || "—";
      meta.appendChild(timeEl);
      var catText = itemCategoryBadgeText(item);
      if (catText) {
        var badge = document.createElement("span");
        badge.className = "timeline-type timeline-type--" + (item.type || "other");
        badge.textContent = catText;
        meta.appendChild(badge);
      }

      var h3 = document.createElement("h3");
      h3.className = "timeline-card__title";
      h3.textContent = item.title || "Untitled";

      if (item.role) {
        var sub = document.createElement("p");
        sub.className = "timeline-card__role";
        sub.textContent = item.role;
        body.appendChild(meta);
        body.appendChild(h3);
        body.appendChild(sub);
      } else {
        body.appendChild(meta);
        body.appendChild(h3);
      }

      if (item.summary) {
        var p = document.createElement("p");
        p.className = "timeline-card__summary";
        p.textContent = item.summary;
        body.appendChild(p);
      }

      if (item.highlights && item.highlights.length) {
        var ul = document.createElement("ul");
        ul.className = "timeline-highlights";
        item.highlights.forEach(function (line) {
          var li = document.createElement("li");
          li.textContent = line;
          ul.appendChild(li);
        });
        body.appendChild(ul);
      }

      if (item.status === "draft") {
        var note = document.createElement("p");
        note.className = "timeline-draft-note";
        note.textContent = "Work in progress — add details in js/timeline-data.js when you’re ready.";
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
      var tLower = t.toLowerCase();
      var on = activeFilterTags.indexOf(tLower) !== -1;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.addEventListener("click", function () {
        if (activeFilterTags.indexOf(tLower) === -1) {
          addFilterTagFromCanonical(t);
        }
        renderActiveTagBar();
        render();
        renderSuggestedTags();
      });
      tagChips.appendChild(b);
    });
  }

  function onTypeButtonClick() {
    var v = this.getAttribute("data-timeline-type");
    if (!v || !Object.prototype.hasOwnProperty.call(typeSelected, v)) return;
    var allOn =
      typeSelected.work && typeSelected.project && typeSelected.game;
    if (allOn) {
      typeSelected.work = v === "work";
      typeSelected.project = v === "project";
      typeSelected.game = v === "game";
    } else {
      typeSelected[v] = !typeSelected[v];
    }
    syncTypeButtons();
    render();
  }
  typeButtons.forEach(function (btn) {
    btn.addEventListener("click", onTypeButtonClick);
  });
  syncTypeButtons();
  if (tagInput) {
    tagInput.addEventListener("input", function () {
      render();
    });
  }
  if (clearTagBtn) {
    clearTagBtn.addEventListener("click", function () {
      if (tagInput) tagInput.value = "";
      activeFilterTags = [];
      renderActiveTagBar();
      render();
      renderSuggestedTags();
    });
  }

  renderActiveTagBar();
  renderSuggestedTags();
  render();
})();
