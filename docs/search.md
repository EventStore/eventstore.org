---
exclude_from_sidebar: false
pinned: false
layout: docs
title: "Search"
---

<form action="/docs/search" method="get">
  <label for="search-box">Search</label>
  <input type="text" id="search-box" name="query">
  <input type="submit" value="Go">
</form>

<ul id="search-results"></ul>

<script src="/js/lunr.min.js"></script>
<script src="/js/searchPageIndex.js"></script>
<script src="/js/search.js"></script>