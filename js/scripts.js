$(document).ready(function() {
    $(".site-navigation-toggle").click(function() {
        $(".site-navigation").slideToggle();
    });
    $(".docs-toc-toggle").click(function() {
        $(".docs-sidebar").slideToggle();
    });
    $(".pastevents-toggle").click(function() {
        $(".events__item--past").slideToggle();
        if($(".pastevents-toggle__label").html() === "Show") {
            $(".pastevents-toggle__label").html("Hide");
        } else {
            $(".pastevents-toggle__label").html("Show");
        }
    });
});