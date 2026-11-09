---
title: "最新文章"
title_key: recent_posts
layout: archive
permalink: /timeline/
author_profile: false
---

{% comment %}
  全部文章按发布时间倒序（与首页的 order 排序互补）。
  site.posts 天然按日期倒序，group_by_exp 按首次出现顺序分年 → 新年份在最前。
{% endcomment %}
{% assign locale = page.locale | default: layout.locale | default: site.locale %}
{% assign all_posts = site.posts | where_exp: "p", "p.hidden != true" %}
{% assign posts_by_year = all_posts | group_by_exp: "p", "p.date | date: '%Y'" %}

<p class="archive__lead">
  <a href="{{ '/' | relative_url }}">&larr; {{ site.data.ui-text[locale].browse_by_order | default: "按学习顺序浏览" }}</a>
</p>

{% for year in posts_by_year %}
<h3 class="archive__subtitle">{{ year.name }} <span class="timeline-count">{{ year.items.size }} 篇</span></h3>
<ul class="timeline-list">
  {% for post in year.items %}
  <li class="timeline-item">
    <time class="timeline-date" datetime="{{ post.date | date: '%Y-%m-%d' }}">{{ post.date | date: "%m-%d" }}</time>
    <a class="timeline-title" href="{{ post.url | relative_url }}">{{ post.title }}</a>
  </li>
  {% endfor %}
</ul>
{% endfor %}
