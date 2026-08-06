---
layout: default
permalink: /blog/
title: Blog
nav: true
nav_order: 6
pagination:
  enabled: true
  collection: posts
  permalink: /page/:num/
  per_page: 5
  sort_field: date
  sort_reverse: true
  trail:
    before: 1
    after: 3
---

<div class="post">
  <div class="header-bar">
    <h1>{{ site.blog_name }}</h1>
    <h2>{{ site.blog_description }}</h2>
  </div>

  <ul class="post-list">
    {% if page.pagination.enabled %}
      {% assign postlist = paginator.posts %}
    {% else %}
      {% assign postlist = site.posts %}
    {% endif %}

    {% for post in postlist %}
      {% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
      {% assign year = post.date | date: "%Y" %}
      {% assign tags = post.tags | join: "" %}

      <li>
        <h3><a class="post-title" href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
        <p>{{ post.description }}</p>
        <p class="post-meta">
          {{ read_time }} min read &nbsp; &middot; &nbsp;
          {{ post.date | date: "%B %d, %Y" }}
        </p>
        <p class="post-tags">
          <a href="{{ year | prepend: '/blog/' | relative_url }}"><i class="fa-solid fa-calendar fa-sm"></i> {{ year }}</a>
          {% if tags != "" %}
            &nbsp; &middot; &nbsp;
            {% for tag in post.tags %}
              <a href="{{ tag | slugify | prepend: '/blog/tag/' | relative_url }}"><i class="fa-solid fa-hashtag fa-sm"></i> {{ tag }}</a>{% unless forloop.last %}&nbsp;{% endunless %}
            {% endfor %}
          {% endif %}
        </p>
      </li>
    {% endfor %}

  </ul>

{% if page.pagination.enabled %}
{% include pagination.liquid %}
{% endif %}

</div>
