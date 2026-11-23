---
layout: none
---

/* 中英混排搜索（文件名沿用 lunr-en.js，实际中英通用）
 *
 * 背景：lunr 2.x 的分词器只按「空格 / 连字符」切词，中文段落没有空格，
 * 整段会变成一个巨型 token，导致正文里的中文短语搜不到（还会被查询端的
 * 前缀通配与编辑距离误命中）。这里在「建索引」和「查询」两侧都做
 * CJK 二元切分（bigram）：连续汉字切成相邻双字，用空格连接；英文/数字原样
 * 保留，因此「HTTP协议」这类中英粘连也会被空格拆开。
 *
 * 关键：查询时中文二元组必须设为 REQUIRED（AND）。只加切分不改查询会退化成
 * 「搜什么都命中全部文章」——二元组默认是 OR，且单字标签几乎每篇都有。
 * 英文仍沿用主题原有的「前缀通配 + 编辑距离」容错逻辑。
 *
 * store 里的原文不动，只用于渲染搜索结果。
 */

var CJK_RANGE = "\\u3400-\\u4dbf\\u4e00-\\u9fff\\uf900-\\ufaff";
var cjkSegRe = new RegExp("[" + CJK_RANGE + "]+", "g");
var cjkOnlyRe = new RegExp("^[" + CJK_RANGE + "]+$");
var REQUIRED = (lunr.Query.presence && lunr.Query.presence.REQUIRED) || "required";

function cjkBigram(value) {
  if (value == null) return "";
  return String(value).replace(cjkSegRe, function (seg) {
    if (seg.length === 1) return " " + seg + " ";
    var parts = [];
    for (var i = 0; i < seg.length - 1; i++) {
      parts.push(seg.slice(i, i + 2));
    }
    return " " + parts.join(" ") + " ";
  });
}

/* categories / tags 在 store 里是数组，先摊平成空格分隔的文本 */
function fieldText(value) {
  if (value == null) return "";
  if (Array.isArray(value)) return value.join(" ");
  return String(value);
}

var idx = lunr(function () {
  this.field("title");
  this.field("excerpt");
  this.field("categories");
  this.field("tags");
  this.ref("id");

  this.pipeline.remove(lunr.trimmer);

  for (var item in store) {
    this.add({
      title: cjkBigram(store[item].title),
      excerpt: cjkBigram(store[item].excerpt),
      categories: cjkBigram(fieldText(store[item].categories)),
      tags: cjkBigram(fieldText(store[item].tags)),
      id: item,
    });
  }
});

function buildQuery(rawQuery) {
  var raw = String(rawQuery).toLowerCase();
  var terms = cjkBigram(raw).trim().split(/\s+/).filter(function (t) {
    return t !== "";
  });
  var trailingSpace = /\s$/.test(raw);
  /* 中英混合查询（如「Docker 部署」）：英文词必须参与约束。
     否则只有中文是 REQUIRED、英文是 OPTIONAL，「部署」会把所有含该词的
     文章都捞回来，英文条件等于失效（结果反而比单搜 Docker 更多）。 */
  var hasCjk = terms.some(function (t) {
    return cjkOnlyRe.test(t);
  });

  return function (q) {
    terms.forEach(function (term) {
      if (cjkOnlyRe.test(term)) {
        if (term.length === 1) {
          /* 单字：索引里只有双字 token，用前缀通配兜底；
             限定标题/标签/分类，避免单字在全文里命中几乎所有文章 */
          q.term(term, {
            presence: REQUIRED,
            usePipeline: false,
            wildcard: lunr.Query.wildcard.TRAILING,
            fields: ["title", "tags", "categories"],
            boost: 50,
          });
        } else {
          /* 多字二元组：全部必须命中，保证精确 */
          q.term(term, { presence: REQUIRED, boost: 100 });
        }
        return;
      }

      if (hasCjk) {
        /* 混合查询：英文只用精确 term（AND），不与通配/模糊变体互相冲突 */
        q.term(term, { presence: REQUIRED, boost: 100 });
        return;
      }

      /* 纯英文：保持主题原有逻辑（OR + 前缀通配 + 编辑距离容错） */
      q.term(term, { boost: 100 });
      if (!trailingSpace) {
        q.term(term, { usePipeline: false, wildcard: lunr.Query.wildcard.TRAILING, boost: 10 });
      }
      /* 短词不做模糊匹配：3 个字符以内、编辑距离 1 会命中大量无关词 */
      if (term.length >= 4) {
        q.term(term, { usePipeline: false, editDistance: 1, boost: 1 });
      }
    });
  };
}

/* 摘要按字符截断。中文没有空格，按空格切词会把整篇吐出来 */
function makeExcerpt(text) {
  var s = String(text == null ? "" : text)
    .replace(/\s+/g, " ")
    .trim();
  return s.length > 120 ? s.slice(0, 120) + "…" : s;
}

function escapeHtml(text) {
  return String(text == null ? "" : text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

$(document).ready(function () {
  var resultdiv = $("#results");
  var input = $("input#search");
  if (!input.length) return;

  var resultsFoundText =
    "{{ site.data.ui-text[site.locale].results_found | default: 'Result(s) found' }}";
  var noResultsText =
    "{{ site.data.ui-text[site.locale].search_no_results | default: 'No matching results' }}";

  function render(result) {
    resultdiv.empty();

    if (!result.length) {
      resultdiv.prepend(
        '<p class="results__not-found">' + escapeHtml(noResultsText) + "</p>"
      );
      return;
    }

    resultdiv.prepend(
      '<p class="results__found">' +
        result.length +
        " " +
        escapeHtml(resultsFoundText) +
        "</p>"
    );

    for (var i = 0; i < result.length; i++) {
      var ref = result[i].ref;
      var post = store[ref];
      if (!post) continue;
      var teaserHtml = post.teaser
        ? '<div class="archive__item-teaser"><img src="' +
          escapeHtml(post.teaser) +
          '" alt=""></div>'
        : "";

      resultdiv.append(
        '<div class="list__item">' +
          '<article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">' +
            '<h2 class="archive__item-title" itemprop="headline">' +
              '<a href="' + escapeHtml(post.url) + '" rel="permalink">' +
                escapeHtml(post.title) +
              "</a>" +
            "</h2>" +
            teaserHtml +
            '<p class="archive__item-excerpt" itemprop="description">' +
              escapeHtml(makeExcerpt(post.excerpt)) +
            "</p>" +
          "</article>" +
        "</div>"
      );
    }
  }

  /* 用 input 事件：中文输入法选字、粘贴、点清除按钮都能触发（keyup 不行） */
  input.on("input", function () {
    var query = $(this).val();
    if (!query || !query.trim()) {
      resultdiv.empty();
      return;
    }
    render(idx.query(buildQuery(query)));
  });
});
