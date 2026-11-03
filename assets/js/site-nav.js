/* ==========================================================================
   站点软导航 + 内容区初始化
   --------------------------------------------------------------------------
   1. 用 Swup 接管站内链接，只替换 .initial-content，其余 DOM（masthead、
      footer、播放器、光标 canvas）保持不动 → 音乐跨页面连续播放。
   2. main.min.js 里的初始化只在首次加载执行一次，软导航后新内容拿不到绑定，
      这里把「内容区相关」的那些补上：标题锚点、代码复制按钮、图片灯箱、
      details 收起按钮、返回顶部。
   3. masthead 不被替换，所以搜索、下拉菜单等原有绑定天然有效，无需处理。
   全局暴露 window.__siteInitContent()，便于后续扩展。
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------- 内容区幂等初始化 ---------------- */

  function copyText(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        function () {},
        function () {}
      );
      return true;
    }
    var ta = document.createElement("textarea");
    ta.className = "clipboard-helper";
    ta.style.left = "-9999px";
    ta.style.top = window.pageYOffset + "px";
    ta.setAttribute("readonly", "");
    ta.value = text;
    document.body.appendChild(ta);
    var ok = true;
    try {
      ta.select();
      ok = document.execCommand("copy");
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  function addHeadingAnchors() {
    var content = document.querySelector(".page__content");
    if (!content) return;
    content.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(function (h) {
      var id = h.getAttribute("id");
      if (!id || h.querySelector(".header-link")) return;
      var a = document.createElement("a");
      a.className = "header-link";
      a.href = "#" + id;
      a.innerHTML = '<span class="sr-only">Permalink</span><i class="fas fa-link"></i>';
      a.title = "Permalink";
      h.appendChild(a);
    });
  }

  function addCopyButtons() {
    if (!window.enable_copy_code_button) return;
    var content = document.querySelector(".page__content");
    if (!content) return;
    content.querySelectorAll("pre.highlight > code").forEach(function (code) {
      var pre = code.parentElement;
      if (!pre || pre.firstElementChild.tagName.toLowerCase() !== "code") return;
      if (pre.querySelector(".clipboard-copy-button")) return;
      var btn = document.createElement("button");
      btn.title = "Copy to clipboard";
      btn.className = "clipboard-copy-button";
      btn.innerHTML =
        '<span class="sr-only">Copy code</span><i class="far fa-fw fa-copy"></i><i class="fas fa-fw fa-check copied"></i>';
      btn.addEventListener("click", function () {
        var target = btn.nextElementSibling;
        while (target && target.tagName.toLowerCase() !== "code") {
          target = target.nextElementSibling;
        }
        if (!target) return;
        var inner = target.querySelector("td.code, td.rouge-code");
        if (copyText((inner || target).innerText)) {
          btn.classList.add("copied");
          clearTimeout(btn.__t);
          btn.__t = setTimeout(function () {
            btn.classList.remove("copied");
          }, 1500);
        }
      });
      pre.prepend(btn);
    });
  }

  function initImagePopups() {
    if (!window.jQuery || !jQuery.fn || !jQuery.fn.magnificPopup) return;
    var content = document.querySelector(".page__content");
    if (!content) return;
    jQuery(content)
      .find(
        "a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.gif'],a[href$='.webp']"
      )
      .not(".image-popup")
      .has("> img")
      .addClass("image-popup")
      .magnificPopup({
        type: "image",
        gallery: { enabled: true, navigateByImgClick: true, preload: [0, 1] },
        removalDelay: 500,
        mainClass: "mfp-zoom-in",
        closeOnContentClick: true,
        midClick: true,
      });
  }

  function initDetailButtons() {
    document.querySelectorAll("details").forEach(function (d) {
      if (d.querySelector(".collapse-btn")) return;
      var btn = document.createElement("button");
      btn.className = "collapse-btn";
      btn.textContent = "收起内容";
      btn.type = "button";
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        d.open = false;
        d.scrollIntoView({ block: "center" });
      });
      d.appendChild(btn);
    });
  }

  function initBackToTop() {
    if (!window.__bttScrollBound) {
      window.__bttScrollBound = true;
      window.addEventListener(
        "scroll",
        function () {
          var btn = document.getElementById("backToTop");
          if (!btn) return;
          btn.classList.toggle("show", window.pageYOffset > 300);
        },
        { passive: true }
      );
    }
    var b = document.getElementById("backToTop");
    if (b && !b.__bound) {
      b.__bound = true;
      b.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  function initContent() {
    initDetailButtons();
    initBackToTop();
    addHeadingAnchors();
    addCopyButtons();
    initImagePopups();
  }
  window.__siteInitContent = initContent;

  /* ---------------- 软导航 ---------------- */

  function instantScrollTo(y) {
    var root = document.documentElement;
    var prev = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, y);
    root.style.scrollBehavior = prev;
  }

  function initSwup() {
    if (typeof Swup === "undefined") return;
    if (!document.querySelector(".initial-content")) return;
    if (!window.fetch || !window.DOMParser || !window.history.pushState) return;

    var positions = {};
    var swup = new Swup({
      containers: [".initial-content"],
      linkSelector:
        'a[href]:not([target="_blank"]):not([download]):not([href^="#"]):not([href^="http"]):not([href^="mailto:"]):not([href^="tel:"]):not([data-no-swup])',
    });

    var on =
      swup.hooks && swup.hooks.on
        ? swup.hooks.on.bind(swup.hooks)
        : swup.on.bind(swup);

    on("visit:start", function () {
      positions[location.pathname + location.search] = window.scrollY;
    });

    on("page:view", function () {
      initContent();
      requestAnimationFrame(function () {
        var hash = location.hash;
        if (hash && hash.length > 1) {
          var el = document.getElementById(decodeURIComponent(hash.slice(1)));
          if (el) {
            el.scrollIntoView();
            return;
          }
        }
        var saved = positions[location.pathname + location.search];
        instantScrollTo(saved || 0);
      });
    });
  }

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    initContent();
    initSwup();
  });
})();
