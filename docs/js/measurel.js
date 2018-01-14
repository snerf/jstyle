$(function(){
    $("#measurel-call").bind("click", function(){
        var nm = $("#name").val(),
            em = $("#email").val(),
            ph = $("#phone").val(),
            cn = $("#company").val(),
            ad = $("#address").val(),
            tx = $("#text").val();

        if(em.length == 0)
        {
            alert("Вы не ввели email");
            return false;
        }
        else if(ph.length == 0)
        {
            alert("Вы не ввели номер телефона");
            return false;
        }
        else
        {
            $.ajax({url: "/interface.php",
                type: "GET",
                data:
                {
                    type   : "mcall",
                    name   : nm,
                    email  : em,
                    phone  : ph,
                    company: cn,
                    address: ad,
                    text   : tx
                },
                beforeSend:function(){
                    $("#measurel-call").addClass("disabled");
                },
                success:function(data){
                    alert(data);
                    $("#measurel-call").removeClass("disabled");
                }
            });
        }
        return false;
    });
});