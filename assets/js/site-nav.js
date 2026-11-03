/* ==========================================================================
   站点软导航 + 内容区初始化
   --------------------------------------------------------------------------
   1. 用 Swup 接管站内链接，只替换 .initial-content，其余 DOM（masthead、
      footer、播放器、光标 canvas）保持不动 → 音乐跨页面连续播放。
   2. main.min.js 里的初始化只在首次加载执行一次，软导航后新内容拿不到绑定，
      这里把「内容区相关」的那些补上：标题锚点、代码复制按钮、图片灯箱、
      details 收起按钮、返回顶部、文章目录高亮；另外收起软导航前残留的搜索面板。
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
    /* 按钮由 single.html 渲染在 .page__inner-wrap 内，其祖先的入场动画(intro)
       会创建层叠上下文/包含块：滚到页底时按钮会被页脚盖住、点不到。
       统一挂到 body 直接子级；非文章页（软导航进入）则移除残留按钮。 */
    document.querySelectorAll("body > #backToTop").forEach(function (el) {
      el.remove();
    });
    var host = document.querySelector(".initial-content #backToTop");
    if (!host) return;
    document.body.appendChild(host);
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
    if (!host.__bound) {
      host.__bound = true;
      host.addEventListener("click", function () {
        animateScrollTo(0);
      });
    }
  }

  /* 目录条目点击：接管主题 SmoothScroll 的默认处理。
     它的动画同样会被 gumshoe 的 scrollIntoView 打断（长目录点条目只滚一小段），
     这里统一走 animateScrollTo；用 getElementById 定位，也顺带绕开旧版插件对
     以数字开头的 id（如 141-jvm内存结构）在 querySelector 里的隐患。 */
  var TOC_OFFSET = 20;

  function initTocClick() {
    var nav = document.querySelector("nav.toc");
    if (!nav || nav.dataset.clickBound === "1") return;
    nav.dataset.clickBound = "1";
    nav.addEventListener(
      "click",
      function (e) {
        var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
        if (!a || !nav.contains(a)) return;
        var raw = a.getAttribute("href").slice(1);
        var el = raw ? document.getElementById(decodeURIComponent(raw)) : null;
        if (!el) return;
        e.preventDefault();
        e.stopPropagation();
        if (history.pushState) {
          history.pushState(null, "", "#" + raw);
        }
        animateScrollTo(el.getBoundingClientRect().top + window.pageYOffset - TOC_OFFSET);
      },
      true
    );
  }

  /* 逐帧动画滚动到目标位置（返回顶部、目录跳转共用）。
     两个关键点：
     1. 不用原生 scrollTo({behavior:"smooth"})：主题的「目录跟随正文滚动」
        (gumshoeActivate → target.scrollIntoView) 会取消浏览器平滑滚动。
     2. 动画期间把 html 的 scroll-behavior 临时改成 auto：否则每次 scrollTo
        都被当成新的平滑滚动，逐帧互相打断，表现为"只滚一点点就停"。 */
  var scrollAnimId = 0;

  function animateScrollTo(targetY) {
    targetY = Math.max(0, Math.round(targetY));
    var start = window.pageYOffset;
    var dist = targetY - start;
    var root = document.documentElement;
    var prevBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    if (Math.abs(dist) < 2) {
      window.scrollTo(0, targetY);
      root.style.scrollBehavior = prevBehavior;
      return;
    }
    var duration = Math.min(600, 200 + Math.abs(dist) * 0.06);
    var myId = ++scrollAnimId;
    var t0 = null;
    var cancelled = false;
    function cancel() {
      cancelled = true;
    }
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    function cleanup() {
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      root.style.scrollBehavior = prevBehavior;
    }
    function step(ts) {
      if (cancelled || myId !== scrollAnimId) return cleanup();
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      window.scrollTo(0, Math.round(start + dist * eased));
      if (p < 1) {
        window.requestAnimationFrame(step);
      } else {
        window.scrollTo(0, targetY);
        cleanup();
      }
    }
    window.requestAnimationFrame(step);
  }

  /* 拦下主题的「目录跟随正文滚动」(gumshoeActivate → target.scrollIntoView)。
     吸顶(sticky)目录里的元素被 scrollIntoView 时，Chrome 会按它在文档流中的位置
     计算，把整页拉回文章开头 —— 表现为点目录条目只滚一下又弹回、返回顶部停在半路。
     这里在 capture 阶段掐断冒泡，改为只调整目录容器自身的 scrollTop，主文档不受影响。 */
  function initTocSync() {
    if (window.__tocSyncBound) return;
    window.__tocSyncBound = true;
    document.addEventListener(
      "gumshoeActivate",
      function (e) {
        e.stopPropagation();
        var li = e.target;
        var menu = document.querySelector("nav.toc .toc__menu");
        if (!li || !menu) return;
        var lr = li.getBoundingClientRect();
        var mr = menu.getBoundingClientRect();
        if (lr.top < mr.top) {
          menu.scrollTop += lr.top - mr.top - 8;
        } else if (lr.bottom > mr.bottom) {
          menu.scrollTop += lr.bottom - mr.bottom + 8;
        }
      },
      true
    );
  }

  /* 文章目录高亮（Gumshoe scrollspy）。
     主题的 _main.js 只在首次加载时绑定 nav.toc，而 TOC 在 .initial-content 内、
     软导航后会被替换，新 nav 无人监听 → 高亮失效。此处为替换后的新 nav 重新绑定。
     注：该版 Gumshoe 无 destroy，旧实例的监听仍存在，但它持有的是已脱离文档的
     旧节点，不影响新内容；用 dataset 标记避免同一 nav 重复绑定。 */
  function initTocSpy() {
    if (typeof Gumshoe === "undefined") return;
    var nav = document.querySelector("nav.toc");
    if (!nav || nav.dataset.spyBound === "1") return;
    nav.dataset.spyBound = "1";
    initTocSync();
    new Gumshoe("nav.toc a", {
      navClass: "active",
      contentClass: "active",
      nested: false,
      nestedClass: "active",
      offset: 20,
      reflow: true,
      events: true,
    });
  }

  /* 软导航后收起搜索面板。
     .search-content 在 .initial-content 之外、不会被替换，而正文的 is--hidden
     会随容器替换消失 → 点搜索结果后面板仍盖在正文上，需手动再关一次。 */
  function closeSearchPanel() {
    var sc = document.querySelector(".search-content");
    if (!sc || !sc.classList.contains("is--visible")) return;
    sc.classList.remove("is--visible");
    var content = document.querySelector(".initial-content");
    if (content) content.classList.remove("is--hidden");
    var results = document.getElementById("results");
    if (results) results.innerHTML = "";
    var input = document.querySelector("input#search");
    if (input) input.value = "";
  }

  function initContent() {
    initDetailButtons();
    initBackToTop();
    initTocClick();
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
      initTocSpy();
      closeSearchPanel();
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
    initTocSync();
    initSwup();
  });
})();
