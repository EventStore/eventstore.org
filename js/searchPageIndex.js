---
layout: null
---
function getPageIndex()
{
    console.log("GetPageIndex");
    window.store = {
        {% for page in site.pages %}
            {% if page.section == "CLI" %}
                {% assign version = site.latest_versions.cli %}
            {% else %}
                {% assign version = site.latest_versions.server %}
            {% endif %}
            {% if page.version == version and page.title != nil and page.content != nil %}
                "{{page.url | slugify}}" : {
                        "key"      : "{{page.url | slugify}}",
                        "title"    : "{{ page.title | escape }}",
                        "section"  : "{{ page.section }}",
                        "url"      : "{{ site.baseurl }}{{ page.url }}",
                        "content"  : {{ page.content | strip_html | strip_newlines | jsonify}}
                } 
            {% unless forloop.last %},{% endunless %}
            {% endif %}
        {% endfor %}
    };
}
getPageIndex();