String.prototype.removeSpace = function() {
    return this.replace(/\s+/g, '');
};
function  getPageSize(){
    var xScroll, yScroll;

    if (window.innerHeight && window.scrollMaxY) {
        xScroll = document.body.scrollWidth;
        yScroll = window.innerHeight + window.scrollMaxY;
    } else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
        xScroll = document.body.scrollWidth;
        yScroll = document.body.scrollHeight;
    } else if (document.documentElement && document.documentElement.scrollHeight > document.documentElement.offsetHeight){ // Explorer 6 strict mode
        xScroll = document.documentElement.scrollWidth;
        yScroll = document.documentElement.scrollHeight;
    } else { // Explorer Mac...would also work in Mozilla and Safari
        xScroll = document.body.offsetWidth;
        yScroll = document.body.offsetHeight;
    }

    var windowWidth, windowHeight;
    if (self.innerHeight) { // all except Explorer
        windowWidth = self.innerWidth;
        windowHeight = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
        windowWidth = document.documentElement.clientWidth;
        windowHeight = document.documentElement.clientHeight;
    } else if (document.body) { // other Explorers
        windowWidth = document.body.clientWidth;
        windowHeight = document.body.clientHeight;
    }

    // for small pages with total height less then height of the viewport
    if(yScroll < windowHeight){
        pageHeight = windowHeight;
    } else {
        pageHeight = yScroll;
    }

    // for small pages with total width less then width of the viewport
    if(xScroll < windowWidth){
        pageWidth = windowWidth;
    } else {
        pageWidth = xScroll;
    }

    return [pageWidth,pageHeight,windowWidth,windowHeight];
};

function empty(value)
{
    if(typeof value == undefined || value == null || value == "" || value === false){
        return true;
    }
    return false;
};
var productbuy = false
$(function(){
var currp = 1;
	$(".pagination a").die().live("click", function(){
		var a = $(this), pg = a.attr("page") != undefined ? a.attr("page") : currp;
		//alert($(".pagination  li.list").last().children("a").attr("page"));
		if(a.parent("li").hasClass("prev")){
			if(pg == 1){
				pg = $(".pagination li.list").last().children("a").attr("page");
			}
			else{
				pg = Number(currp) - 1;
			}
		}
		if(a.parent("li").hasClass("next")){
			if(pg == $(".pagination  li.list").last().children("a").attr("page")){
				pg = 1;
			}
			else{
				pg = Number(currp) + 1;
			}
		}
		
		$.ajax({url: "/interface.php",
            type: "GET",
            data: {type: "pager",
                   id: pg,
                   catid:$("#catid").val()
            },
            success:function(data){
                $(".wrap-products").html(data);
                $(".pagination li").removeClass("active");
                a.parent("li").addClass("active");
                currp = pg;
                //
                if(a.parent("li").hasClass("prev") || a.parent("li").hasClass("next")){
                    $(".pagination li.active").removeClass("active");
                    $("a[page="+pg+"]").parent("li").addClass("active");
                }
            }
        });
			
			return false;
	});
	
	$(".lmenu-child li").hover(function(){
        $(this).addClass("active");
    },function(){
		$(this).removeClass("active");
	});
		
	$("#searchsub").die().live("click",function(){
		var sval = $("#search").val();
		if(sval.length < 3){
			alert("Для поиска необходимо 3 символа");
				
			return false;
		}
		else{
			/*$.ajax({url: "/interface.php",
                type: "GET",
                data: {type: "search",
                       id: sval
				},
                success:function(data){
                    $("#wrap-products").html(data);
				}
            });*/
			return true;
		}
	});
        
    $("a.menuroll").die().live("click",function(){
            var a = $(this), ul = a.nextAll("ul"), an = a.next("a");
            
            if(ul.is(":hidden"))
            {
                ul.show();
                a.html("&ndash;");
                //
                $.ajax({url: "/interface.php",
                    type: "GET",
                    data: {type: "catalog",
                           rel: an.attr("rel")
                    },
                    success:function(data){
                            $("#wrap-products").html(data);
                    }
		});
            }
            else
            {
                ul.hide();
                a.html("&#43;");
            }
        });
    
    $("a[product]").die().live("click",function(){
        var a = $(this), 
            price = Number(a.attr("price").removeSpace()), 
            product = a.attr("product"), 
            currprice = Number($("span.price").html().removeSpace()),
            quantity = (a.attr("rel") == "product-buy") ? parseInt($("#quantity").val()) : 1,
            clr = a.prevAll("div.wrap-colors").children("select.good-color").val(),
            color = clr == undefined ? 999 : clr;

        if(empty(color) || isNaN(color) || color == 0)
        {
            alert("Вы не выбрали цвет");
        }
        else
        {
            $("span.price").html(currprice+(price*quantity));

            $.ajax({url: "/interface.php",
                    type: "GET",
                    data:
                    {
                        type: "cart",
                        ind : product + "-" + color,
                        prc : price,
                        prd : product,
                        quan: quantity,
                        ttl : currprice+(price*quantity),
                        clr : color
                    },
                    success:function(data)
                    {
                        if(a.attr("class") == "product-buy")
                        {
                            location.pathname = "/cart/";
                        }
                    }
            });
        }
        return false;
    });

    $("#quantity").die().live("focusin",function(){
        $(this).val("");
    }).live("focusout",function(){
        if($(this).val() == ""){
            $(this).val("1");
        }
    });
    
    $("#ordsubmit").die().live("click", function(){
        var fio = $("#ordfio").val(),
            phone = $("#ordphone").val(),
            email = $("#ordemail").val(),
            dlvr = 0,
            dlvrs = 0,
            errors = "";
        if(fio.length == 0)
        {
            errors = errors + "Вы не ввели название организации или Ф.И.О\n";
        }
        if(phone.length == 0)
        {
            errors = errors + "Вы не ввели номер телефона\n";
        }
        if(email.length == 0)
        {
            errors = errors + "Вы не ввели адрем электронной почты\n";
        }
        //
        if($("#orddelivery").attr("checked") == "checked" || $("#orddelivery").attr("checked") == true){
            dlvr = 1;
        }
        if($("#ordselfextr").attr("checked") == "checked" || $("#ordselfextr").attr("checked") == true){
            dlvrs = 1;
        }
        //
        if(errors.length > 0){
            alert(errors);
            return false;
        }
        else{
            $.ajax({url: "/interface.php",
                type: "GET",
                data: {type: "deliveryorder",
                       name: fio,
                       phn: phone,
                       em:email ,
                       delivery: dlvr,
                       self: dlvrs
                },
                success:function(data){
                    $.fancybox({content:data});
                }
        });
        }
    });
    $("#clearcart").die().live("click",function(){
        if(confirm("Вы уверенны что хотите очистить корзину?")){
            return true;
        }
        return false;
    });

    $(".delete img").click(function(e) {
        e.preventDefault();
        var a = $(this), tr = a.parents('tr'),
        par = tr.find("span.pricevalue"),
        parc = Number(par.text().removeSpace()),
        col = tr.find('span.quantity'),
        col_val = Number(col.text().removeSpace()),
        quant = Number($(".cart-title span").text().removeSpace());
        tr.remove();
        //
        $("span.price").html((Number($("span.price").text().removeSpace())-(parc*col_val)).toFixed(2));
        $(".cart-title span").text(quant-1);
        //
        $.ajax({url: "/interface.php",
            type: "GET",
            data: {type: "cartdel",
                prd: tr.find("input.productid").val()
            },
            success:function(data){
            }
        });
    });

    $("div.calculate a").click(function(){
        var total = 0;

        $("table.cart-tab tr.trproduct").each(function(){
            var a = $(this),
                price = Number(a.find("span.pricevalue").text().removeSpace()),
                col = Number(a.find("input.quantity").val().removeSpace());

            total = Number(total + (price*col));
        });

        $(".main-total span").html(total);

        return false;
    });

    $(".preset li").hover(function(){
        $(this).addClass("active");
    },function(){
        $(this).removeClass("active");
    });

    $(".lmenu span.menuroll").click(function(){
        var a = $(this), par = a.parents("li");

        if(par.hasClass("active"))
        {
            par.removeClass("active");
        }
        else
        {
            par.addClass("active");
        }
    });

    $(".trade-marks-img").die().live("click", function(){
        var a = $(this);

        if(a.hasClass("active"))
        {
            a.removeClass("active");
        }
        else
        {
            a.addClass("active");
        }
    });

    $("#params-query-submit").die().live("click", function(){
        var sendArr = new Object(),
            fr = $("#filter_price_from").val(),
            to = $("#filter_price_to").val();

        if(fr.length > 0 && !isNaN(fr))
        {
            sendArr["from"] = fr;
        }

        if(to.length > 0 && !isNaN(to))
        {
            sendArr["to"] = to;
        }

        $(".trade-marks-img.active").each(function()
        {
            if(!empty(sendArr["tm"]))
            {
                sendArr["tm"] = sendArr["tm"].toString() + "," + $(this).attr("rel");
            }
            else
            {
                sendArr["tm"] = $(this).attr("rel");
            }
        });

        $("p.class input").each(function()
        {
            var a = $(this);

            if(a.attr("checked") == "checked" || a.checked == true)
            {
                if(!empty(sendArr["class"]))
                {
                    sendArr["class"] = sendArr["class"].toString() + "," + $(this).val() + "";
                }
                else
                {
                    sendArr["class"] = $(this).val();
                }
            }
        });

        $("p.sizes input").each(function()
        {
            var a = $(this);

            if(a.attr("checked") == "checked" || a.checked == true)
            {
                if(!empty(sendArr["sizes"]))
                {
                    sendArr["sizes"] = sendArr["sizes"].toString() + "," + $(this).val();
                }
                else
                {
                    sendArr["sizes"] = $(this).val();
                }
            }
        });

        sendArr["id"] = $("#catid").val();

        $.ajax({url: "/interface.php",
            type: "GET",
            data:
            {
                type: "detailed-choose",
                params: sendArr
            },
            success:function(data)
            {
                $(".wrap-products").html(data);
                $(".pagination").hide();
            }
        });
    });

    $("input.quantity").die().live("focusout",function(){
        var a        = $(this),
            quantity = a.val(),
            indctr   = a.parents("tr.trproduct").children("input.productid").val();

        $.ajax({url: "/interface.php",
            type: "GET",
            data:
            {
                type: "cart-fin",
                ind : indctr,
                quan: quantity
            },
            success:function(data)
            {

            }
        });

        return false;
    });
});