$(function(){
    $("#checkcallback").die().live("click",function(){
        $.ajax({url: "/interface.php",
            type: "GET",
            data: {type: "checkcallback"
            },
            success:function(data){
                $(".main-block").html(data);
            }
        });
        return false;
    });

    $(".callback a").die().live("click",function(){
        $.ajax({url: "/interface.php",
            type: "GET",
            data: {type: "callbackdone",
                id: $(this).attr("rel")
            },
            success:function(data){
                $.fancybox({content:data});
            }
        });

        return false;
    });
    $("#all-call").die().live("click",function(){
        $.ajax({url: "/interface.php",
            type: "GET",
            data: {type: "all-call"
            },
            success:function(data){
                $(".main-block").html(data);
            }
        });
        return false;
    });
});