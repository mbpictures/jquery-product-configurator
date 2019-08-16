(function( $ ) {
 	"use strict";
    $.fn.productConfigurator = function(options) {
	 	
		var settings = $.extend( {}, $.fn.productConfigurator.defaults, options );
		
		$.fn.productConfigurator.internal.settings = settings;
		
		return this.each(function() {
			//init all main static elements
			var configuratorDiv = $("<div></div>").addClass("configurator"), 
				buyDiv = $("<div></div>").addClass("buy"), buyInnerDiv = $("<div></div>").addClass("inner"),
				mobileConfigButtonDiv = $("<div></div>").addClass("mobile-config-button").html('<div class="hamburg"><span class="line"></span><span class="line"></span><span class="line"></span></div>'),
				previewDiv = $("<div></div>").addClass("preview"),
				settingsDiv = $("<div></div>").addClass("settings"),
				categoriesDiv = $("<div></div>").addClass("categories"),
				mainCategoryList = $("<ul></ul>").addClass("main-category"),
				previewImageDiv = $("<div></div>").addClass("preview-image"),
				summaryDiv = $("<div></div>").addClass("summary"),
				buyBtn = $("<div></div>").addClass("buy-button").html("Buy");
			
			//mobile button
			mobileConfigButtonDiv.click(function(){
				$('.configurator .settings').toggleClass("open");
				$(this).find(".hamburg").toggleClass("active");
			});
			
			//settings top bar
			var nameDiv = $("<div></div>").addClass("name");
			var backDiv = $("<div></div>").addClass("back width-as-height").attr('data-submenu', "none").html('<i class="icon ion-ios-arrow-back"></i>');
			
			nameDiv.append(backDiv).append(settings.name);
			settingsDiv.append(nameDiv);
			backDiv.click(function (){
				if($(this).css("opacity") == 0) return;
				$('#category-'+$.fn.productConfigurator.internal.openedSub).animate({left: $('.main-category').parent().width() + "px"}, 300, function (){
					$('.main-category').css("left", "-" + $('.main-category').parent().width() + "px").animate({left: "0"}, 300);
					$('.settings .back').animate({opacity: "0"}, 300).css("cursor", "auto");
					$.fn.productConfigurator.internal.openedSub = "none";
				});
			});
			
			//settings summary
			summaryDiv.append('<div class="price"><div>'+settings.localization.total+'</div><div></div></div>').append(buyBtn);
			buyBtn.click(function(){
				$('.buy').fadeIn(500);
			});
			
			
			//buy popup
			var buyInfoDiv = $("<div></div>").addClass("info"), buyCheckDiv = $("<div></div>").addClass("buy-check");
			var buyAcceptBtn = $("<div></div>").addClass("accept").html(settings.localization.buy), buyDeclineBtn = $("<div></div>").addClass("decline").html(settings.localization.decline); 
			buyCheckDiv.append(buyAcceptBtn).append(buyDeclineBtn);
			buyInfoDiv.append("<h1>"+settings.localization.buy+"</h1>").append('<div class="price"><div>'+settings.localization.total+'</div><div></div></div>').append(buyCheckDiv).append("<p>"+settings.localization.privacy+"</p>");
			buyAcceptBtn.click(function(){
				//translate internal representation of the current selection (as ids) in a more useful one
				var data = {};
				jQuery.each($.fn.productConfigurator.internal.currentSelection, function (key, val){
					data[$.fn.productConfigurator.internal.categories[key].name] = $.fn.productConfigurator.internal.categories[key].items[val].name;
				});
				$.fn.productConfigurator.redirectPost(settings.buyDestinationUrl, data);
			});
			buyDeclineBtn.click(function(){
				$('.buy').fadeOut(500);
			});
			buyDiv.click(function(e){
				if(e.target.getAttribute("class") === "buy"){
					$(this).fadeOut(500);
				}
			});
			
			
			jQuery.each(settings.categories, function(index, value){
				var mainCategoryEntry = $("<li></li>").attr("data-category", value.name);
				var defaultItem = {};
				var subCategoryList = $("<ul></ul>").addClass("sub-category").attr("id", "category-"+value.name);
				
				jQuery.each(value.items, function(index2, value2){
					if(value2.default){ defaultItem.val = value2; defaultItem.index = index2; } //assign default item of category
					var subCategoryEntry = $("<li></li>").attr("data-item", value2.name);
					subCategoryEntry.empty().html('<div class="thumbnail"><img src="'+value2.image+'"></div>'+
							'<div class="name">'+
								value2.name+
							'</div>'+
							'<div class="price">'+
								value2.price+settings.currency+
							'</div>');
					
					subCategoryList.append(subCategoryEntry);
					
					subCategoryEntry.click(function(){
						$('.preview-' + value.name).attr("src", value2.image);
						$('.main-category li').each(function () {
							if($(this).data("category") !== value.name){ return; }
							$(this).find("img").attr("src", value2.image);
							$(this).find(".name div:last-child").html(value2.name);
							$(this).find(".price").html(value2.price + settings.currency);
						});
						$.fn.productConfigurator.internal.currentSelection[index] = index2;
						$(".summary .price div:last-child").removeClass("price-anim");
						$.fn.productConfigurator.updateTotalPrice(settings.categories);
					});
				});
				
				mainCategoryEntry.html('<div class="thumbnail"><img src="'+defaultItem.val.image+'"></div>'+
					'<div class="name">'+
						'<div>'+value.name+'</div>'+
						'<div>'+defaultItem.val.name+'</div>'+
					'</div>'+
					'<div class="price">'+
						defaultItem.val.price+settings.currency+
					'</div>'+
					'<div class="enter">'+
						'<i class="icon ion-ios-arrow-forward"></i>'+
					'</div>'); //build list item for main-category list
				
				// build preview image
				$(previewImageDiv).append("<img src='"+defaultItem.val.image+"' class='preview-"+value.name+"'>");
				
				//eventHandler for mainCategory
				mainCategoryEntry.click(function(){
					var object = $(this);
					$('.main-category').animate({left: "-" + $('.main-category').parent().width() + "px"}, 300, function (){
						$('#category-'+object.data("category")).css("left", $('.main-category').parent().width() + "px").animate({left: "0px"}, 300);
						$('.settings .back').animate({opacity: "1"}, 300).css("cursor", "pointer");
						$.fn.productConfigurator.internal.openedSub = object.data("category");
					});
				});
				
				$.fn.productConfigurator.internal.currentSelection[index] = defaultItem.index;
			
				mainCategoryList.append(mainCategoryEntry);
				categoriesDiv.append(subCategoryList);
			});
			previewDiv.append(previewImageDiv);
			var secondPreviewDiv = previewDiv.clone();
			categoriesDiv.append(mainCategoryList);
			settingsDiv.append(categoriesDiv).append(summaryDiv);
			
			buyInnerDiv.append(secondPreviewDiv).append(buyInfoDiv);
			buyDiv.append(buyInnerDiv);
			
			configuratorDiv.append(buyDiv).append(mobileConfigButtonDiv).append(previewDiv).append(settingsDiv);
			
			$(this).append(configuratorDiv);
			
			backDiv.css("width", backDiv.css("height"));
			
			$.fn.productConfigurator.internal.categories = settings.categories;
			$.fn.productConfigurator.updateTotalPrice();
		});
 
    };
	
	$.fn.productConfigurator.defaults = {
		"name": undefined,
		"buyDestinationUrl": undefined,
		"currency": "&euro;",
		"categories": [],
		"localization": {
			"buy": "Buy",
			"decline": "Not now",
			"privacy": "With buying this product you accept our <a href='#'>Privacies</a>",
			"total": "Total"
		}
	};
	$.fn.productConfigurator.internal = {"openedSub": undefined, "currentSelection": {}, "categories": undefined, "settings": undefined};
	
	$.fn.productConfigurator.redirectPost = function(location, data){
        var form = '';
        $.each(data, function( key, value ) {
            form += '<input type="hidden" name="'+key+'" value="'+value+'">';
        });
        $('<form action="'+location+'" method="POST">'+form+'</form>').appendTo('body').submit();
	};
	
	$.fn.productConfigurator.updateTotalPrice = function (){
		var price = 0;
		jQuery.each($.fn.productConfigurator.internal.currentSelection, function(i, val){
			price += $.fn.productConfigurator.internal.categories[i].items[val].price;
		});
				
		$(".summary .price div:last-child, .buy .inner .info .price div:last-child").html(price + $.fn.productConfigurator.internal.settings.currency);
		var el     = $(".summary .price div:last-child"),  
			newone = el.clone(true).addClass("price-anim");

		el.before(newone);

		el.remove();
	};
}( jQuery ));