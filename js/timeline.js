(function () {
  "use strict";

  var LS_KEY = "timeline_extra_v1";
  var TYPE_LABEL = { work: "Work", project: "Project", game: "Game" };
  var TYPE_CLASS = { work: "is-work", project: "is-project", game: "is-game" };

  function monthIndex(s) {
    if (!s) return 0;
    var p = String(s).trim();
    if (/^\d{4}$/.test(p)) {
      return parseInt(p, 10) * 12;
    }
    var m = p.match(/^(\d{4})-(\d{2})$/);
    if (m) return parseInt(m[1], 10) * 12 + parseInt(m[2], 10) - 1;
    return 0;
  }

  function formatRange(start, end) {
    var s = (start == null || String(start).trim() === "") ? "" : String(start).trim();
    if (!s && (end === undefined || end === null || end === "")) return "Date TBD";
    var a = s || "…";
    if (end === null) return a + " — present";
    if (end === undefined || end === "") return a + " — (add end date)";
    return a + " — " + end;
  }

  function allExperiences() {
    var base = typeof TIMELINE_EXPERIENCES !== "undefined" && TIMELINE_EXPERIENCES
      ? TIMELINE_EXPERIENCES
      : [];
    var extra = Array.isArray(TIMELINE_EXTRA) ? TIMELINE_EXTRA : [];
    var fromLs = [];
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (raw) fromLs = JSON.parse(raw);
    } catch (e) {
      fromLs = [];
    }
    if (!Array.isArray(fromLs)) fromLs = [];
    return base.concat(extra, fromLs);
  }

  function uniqueTags(items) {
    var set = {};
    items.forEach(function (i) {
      (i.tags || []).forEach(function (t) {
        var u = String(t).trim();
        if (u) set[u] = 1;
      });
    });
    return Object.keys(set).sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
  }

  function sortChronology(items) {
    return items.slice().sort(function (a, b) {
      return monthIndex(b.endDate || b.startDate) - monthIndex(a.endDate || a.startDate);
    });
  }

  function el(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text != null) n.appendChild(document.createTextNode(String(text)));
    return n;
  }

  function buildCard(x) {
    var type = x.type === "work" || x.type === "project" || x.type === "game" ? x.type : "project";
    var card = el("article", "timeline-card " + (TYPE_CLASS[type] || ""));

    var hasPreview = x.preview && x.preview.image;
    if (hasPreview) {
      var media = el("div", "timeline-card__media");
      var img = document.createElement("img");
      img.src = x.preview.image;
      img.alt = x.preview.alt || x.title || "";
      img.className = "timeline-card__img";
      img.loading = "lazy";
      media.appendChild(img);
      card.appendChild(media);
    } else {
      var placeholder = el("div", "timeline-card__media timeline-card__media--empty");
      placeholder.setAttribute("aria-hidden", "true");
      card.appendChild(placeholder);
    }

    var body = el("div", "timeline-card__body");

    var typeRow = el("div", "timeline-card__type");
    var pill = el("span", "timeline-pill", TYPE_LABEL[type] || "Project");
    typeRow.appendChild(pill);
    if (x.draft) {
      var draft = el("span", "timeline-draft", "Draft");
      typeRow.appendChild(draft);
    }
    body.appendChild(typeRow);

    var h3 = el("h3", "timeline-card__title", x.title || "Untitled");
    body.appendChild(h3);
    var date = el("p", "timeline-card__dates", formatRange(x.startDate, x.endDate));
    body.appendChild(date);
    if (x.summary) {
      var p = el("p", "timeline-card__summary", x.summary);
      body.appendChild(p);
    }

    var tagRow = el("div", "timeline-card__tags");
    (x.tags || []).forEach(function (t) {
      var chip = el("span", "chip tag-chip", String(t).trim());
      chip.setAttribute("data-tag", String(t).trim().toLowerCase());
      tagRow.appendChild(chip);
    });
    body.appendChild(tagRow);

    var actions = el("div", "timeline-card__actions");
    if (x.playUrl) {
      var a1 = el("a", "btn", x.playLabel || "Play now");
      a1.href = x.playUrl;
      a1.target = "_blank";
      a1.rel = "noopener noreferrer";
      actions.appendChild(a1);
    }
    if (x.githubUrl) {
      var a2 = el("a", "btn btn-ghost", "GitHub");
      a2.href = x.githubUrl;
      a2.target = "_blank";
      a2.rel = "noopener noreferrer";
      actions.appendChild(a2);
    }
    if (x.otherUrl) {
      var a3 = el("a", "btn btn-ghost", x.otherLabel || "Link");
      a3.href = x.otherUrl;
      a3.target = "_blank";
      a3.rel = "noopener noreferrer";
      actions.appendChild(a3);
    }
    if (actions.children.length) body.appendChild(actions);

    card.appendChild(body);
    return card;
  }

  var state = { type: "all", tagSet: {}, tagText: "" };

  function matchesType(x) {
    if (state.type === "all") return true;
    return (x.type || "project") === state.type;
  }

  function matchesTag(x) {
    var q = (state.tagText || "").trim().toLowerCase();
    var itemTags = (x.tags || []).map(function (t) {
      return String(t).trim();
    });
    if (q) {
      var hit = false;
      for (var j = 0; j < itemTags.length; j++) {
        if (itemTags[j].toLowerCase().indexOf(q) >= 0) {
          hit = true;
          break;
        }
      }
      if (!hit) return false;
    }
    var keys = Object.keys(state.tagSet);
    if (keys.length === 0) return true;
    var itemTagsLower = itemTags.map(function (t) { return t.toLowerCase(); });
    for (var i = 0; i < keys.length; i++) {
      if (itemTagsLower.indexOf(keys[i]) >= 0) return true;
    }
    return false;
  }

  function render() {
    var listEl = document.getElementById("timeline-list");
    if (!listEl) return;
    var items = sortChronology(allExperiences().filter(function (x) {
      return matchesType(x) && matchesTag(x);
    }));

    listEl.innerHTML = "";
    if (items.length === 0) {
      var emptyP = el("p", "timeline-empty", "");
      emptyP.appendChild(document.createTextNode("No entries match your filters. Try "));
      var strong = document.createElement("strong");
      strong.appendChild(document.createTextNode("All types"));
      emptyP.appendChild(strong);
      emptyP.appendChild(document.createTextNode(" or clear tag filters."));
      listEl.appendChild(emptyP);
      return;
    }

    items.forEach(function (x) {
      var li = el("li", "timeline__item");
      li.appendChild(buildCard(x));
      listEl.appendChild(li);
    });

    renderTagBar();
  }

  function renderTagBar() {
    var bar = document.getElementById("timeline-filter-tags");
    if (!bar) return;
    while (bar.firstChild) bar.removeChild(bar.firstChild);
    var allItems = allExperiences();
    var tags = uniqueTags(allItems);
    var lab = el("span", "filter-label", "Tags");
    bar.appendChild(lab);
    var allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = "tag-pill";
    allBtn.setAttribute("data-all-tags", "1");
    allBtn.appendChild(document.createTextNode("All tags"));
    allBtn.addEventListener("click", function () {
      state.tagSet = {};
      render();
    });
    bar.appendChild(allBtn);
    tags.forEach(function (t) {
      var low = t.toLowerCase();
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tag-pill" + (state.tagSet[low] ? " tag-pill--on" : "");
      b.setAttribute("data-tag-key", t);
      b.appendChild(document.createTextNode("#" + t));
      b.addEventListener("click", function () {
        var k = (b.getAttribute("data-tag-key") || "").toLowerCase();
        if (state.tagSet[k]) delete state.tagSet[k];
        else state.tagSet[k] = 1;
        render();
      });
      bar.appendChild(b);
    });
  }

  function setType(t) {
    state.type = t;
    var wrap = document.getElementById("filter-type");
    if (wrap) {
      wrap.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-type") === t ? "true" : "false");
        b.classList.toggle("is-active", b.getAttribute("data-type") === t);
      });
    }
    render();
  }

  function addFromForm(ev) {
    if (ev) ev.preventDefault();
    var f = document.getElementById("form-add-experience");
    if (!f) return;

    var get = function (id) {
      var n = f.querySelector("#" + id);
      return n ? String(n.value || "").trim() : "";
    };

    var type = get("ex-type") || "project";
    if (type !== "work" && type !== "project" && type !== "game") type = "project";

    var id =
      "local-" + Date.now() + "-" + Math.random().toString(16).slice(2);
    var endRaw = get("ex-end");
    var ongoing = f.querySelector("#ex-ongoing");
    var isOngoing = ongoing && ongoing.checked;
    var endDate;
    if (isOngoing) endDate = null;
    else if (endRaw) endDate = endRaw;
    else endDate = undefined;

    var entry = {
      id: id,
      type: type,
      title: get("ex-title") || "New experience",
      startDate: get("ex-start") || undefined,
      endDate: endDate,
      summary: get("ex-summary") || "",
      draft: true
    };
    if (get("ex-tags")) {
      entry.tags = get("ex-tags")
        .split(/[,;]/)
        .map(function (s) { return s.trim(); })
        .filter(Boolean);
    } else {
      entry.tags = [];
    }
    if (get("ex-preview")) {
      entry.preview = { image: get("ex-preview"), alt: get("ex-title") || "Preview" };
    }
    if (get("ex-play")) {
      entry.playUrl = get("ex-play");
      if (get("ex-playlabel")) entry.playLabel = get("ex-playlabel");
    }
    if (get("ex-gh")) entry.githubUrl = get("ex-gh");
    if (get("ex-otherurl")) {
      entry.otherUrl = get("ex-otherurl");
      entry.otherLabel = get("ex-otherlabel") || "Link";
    }

    var arr;
    try {
      arr = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    } catch (e) {
      arr = [];
    }
    if (!Array.isArray(arr)) arr = [];
    arr.push(entry);
    localStorage.setItem(LS_KEY, JSON.stringify(arr));
    f.reset();
    var o = f.querySelector("#ex-ongoing");
    if (o) o.checked = false;
    setType(state.type);
    var note = document.getElementById("add-saved-hint");
    if (note) {
      note.hidden = false;
      clearTimeout(addSavedTO);
      addSavedTO = setTimeout(function () { note.hidden = true; }, 5000);
    }
  }

  var addSavedTO;

  function exportLocal() {
    var raw;
    try {
      raw = localStorage.getItem(LS_KEY) || "[]";
      JSON.parse(raw);
    } catch (e) {
      raw = "[]";
    }
    var pre = document.getElementById("add-export");
    if (pre) {
      pre.hidden = !pre;
      if (!pre.hidden) pre.value = raw;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var wrap = document.getElementById("filter-type");
    if (wrap) {
      wrap.querySelectorAll("button[data-type]").forEach(function (b) {
        b.addEventListener("click", function () {
          setType(b.getAttribute("data-type") || "all");
        });
      });
    }
    var tagInput = document.getElementById("tag-search");
    if (tagInput) {
      tagInput.addEventListener("input", function () {
        state.tagText = tagInput.value;
        render();
      });
    }

    var f = document.getElementById("form-add-experience");
    if (f) f.addEventListener("submit", addFromForm);
    var exportEl = document.getElementById("export-local-btn");
    if (exportEl) {
      exportEl.addEventListener("click", function () {
        exportLocal();
      });
    }

    setType("all");
  });
})();
