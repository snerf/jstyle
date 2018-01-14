$(function(){
    $(".tab-cont .title").toggle(function(){
        var a = $(this);
        a.parents("div.parent").addClass("h300");
        a.addClass("active");
    }, function(){
        var a = $(this);
        a.parents("div.parent").removeClass("h300");
        a.removeClass("active");
    });

    $(".for-img a").bind("click", function(){return false;});
});