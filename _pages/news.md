---
layout: page
title: News
permalink: /news/
nav: false
---

{% assign news_by_year = site.news | sort: 'date' | reverse | group_by_exp: 'item', 'item.date | date: "%Y"' %}

{% for year in news_by_year %}

## {{ year.name }}

<div class="news">
  <div class="table-responsive">
    <table class="table table-sm table-borderless">
      <tbody>
        {% for item in year.items %}
          <tr>
            <th scope="row" style="width: 20%">
              <time datetime="{{ item.date | date_to_xmlschema }}">{{ item.date | date: '%b %d, %Y' }}</time>
            </th>
            <td>
              {% if item.inline %}
                {{ item.content | markdownify | remove: '<p>' | remove: '</p>' }}
              {% else %}
                <a href="{{ item.url | relative_url }}">{{ item.title }}</a>
              {% endif %}
            </td>
          </tr>
        {% endfor %}
      </tbody>
    </table>
  </div>
</div>

{% endfor %}
