/*
 * jQuery product configurator
 * https://github.com/mbpictures/jquery-product-configurator
 *
 * Copyright © 2019 Marius Butz <contact@marius-butz.de>
 * Licensed under MIT License
 */

(function( $ ) {
 	"use strict";
    $.fn.productConfigurator = function(options) {
	 	
		var settings = $.extend( {}, $.fn.productConfigurator.defaults, options );
		
		$.fn.productConfigurator.internal.currency = settings.currency;
		//register resize event
		$(window).resize(function (){
			$.fn.productConfigurator.resize();
		});
		
		return this.each(function() {
			// loading screen! at first, so it gets displayed before the other stuff loads
			if(settings.loading){
				var loadingScreen = $("<div></div>").addClass("loading").html(settings.loadingHtml);
				$(this).append(loadingScreen);
			}
			
			var overallImages = 0;
			jQuery.each(settings.categories, function(i, val){
				jQuery.each(val.items, function (i2, val2){
					overallImages += val2.image !== undefined ? 1 : 0;
				});
			});
			$.fn.productConfigurator.internal.images.overall = overallImages;
			
			
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
				buyBtn = $("<div></div>").addClass("buy-button").html("Buy"),
				credits = $("<div></div>").addClass("credits").html("jQuery Plugin developed by <a href='http://marius-butz.de' target='_blank'>Marius Butz</a> &copy; 2019"),
				additionalControlDiv, additionalControlOpener, controlZoomin, controlZoomout;
			
			// additional control buttons
			if(settings.additionalControls){
				additionalControlDiv = $("<div></div>").addClass("additional-controls");
				additionalControlOpener = $("<div></div>").addClass("additional-controls-opener controls-button").html('<div class="plus"><span></span><span></span></div>');
				// zoom-in and out buttons
				controlZoomin = $("<div></div>").addClass("controls-zoomin controls-button").html('<div class="plus"><span></span><span></span></div>');
				controlZoomout = $("<div></div>").addClass("controls-zoomout controls-button").html('<div class="plus"><span></span><span></span></div>');
				additionalControlDiv.append(additionalControlOpener).append(controlZoomin).append(controlZoomout);
				configuratorDiv.append(additionalControlDiv);
				
				
				// event to open/close the additional control buttons
				additionalControlOpener.click(function(){
					var heightMain = $(".additional-controls-opener").height();
					var heightExtend = 0;
					$([additionalControlOpener, controlZoomin, controlZoomout]).each(function(){
						heightExtend += $(this).height();
					});
					$(this).find(".plus").toggleClass("active");
					var newHeight = Math.floor($(this).parent().height()) === Math.floor(heightExtend) ? heightMain+"px" : heightExtend+"px";
					$(this).parent().animate({height: newHeight}, 200);
				});
				// events for zoom-in and out
				var zoomStep = 3;
				controlZoomin.click(function(){
					zoomStep += zoomStep < 5 ? 1 : 0;
					$(".configurator .preview .preview-image").removeClass("scaled-1 scaled-2 scaled-3 scaled-4 scaled-5").addClass("scaled-"+zoomStep);
				});
				controlZoomout.click(function(){
					zoomStep -= zoomStep > 1 ? 1 : 0;
					$(".configurator .preview .preview-image").removeClass("scaled-1 scaled-2 scaled-3 scaled-4 scaled-5").addClass("scaled-"+zoomStep);
				});
			}
			
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
			//Back to main categories screen
			backDiv.click(function (){
				if($(this).css("opacity") == 0) return;
				$('#category-'+$.fn.productConfigurator.internal.openedSub).animate({left: $('.main-category').parent().width() + "px"}, 300, function (){
					$('.main-category').css("left", "-" + $('.main-category').parent().width() + "px").animate({left: "0"}, 300);
					$('.settings .back').animate({opacity: "0"}, 300).css("cursor", "auto");
					$.fn.productConfigurator.internal.openedSub = undefined;
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
			// user clicks outside of the buy dialog
			buyDiv.click(function(e){
				if(e.target.getAttribute("class") === "buy"){
					$(this).fadeOut(500);
				}
			});
			
			// generate main and sub category entries
			jQuery.each(settings.categories, function(index, value){
				var mainCategoryEntry = $("<li></li>").attr("data-category", value.name);
				var defaultItem = {};
				var subCategoryList = $("<ul></ul>").addClass("sub-category").attr("id", "category-"+value.name);
				
				// sub categories
				jQuery.each(value.items, function(index2, value2){
					if(settings.buffer && value2.image !== undefined) $("<img>").attr("src", value2.image).on("load", imgLoaded(loadingScreen));
					
					if(value2.default){ defaultItem.val = value2; defaultItem.index = index2; } //assign default item of category
					var subCategoryEntry = $("<li></li>").attr("data-item", value2.name).addClass(value2.default ? "active" : "");
					subCategoryEntry.empty().html('<div class="thumbnail"></div>'+
							'<div class="name">'+
								value2.name+
							'</div>'+
							'<div class="price">'+
								value2.price+settings.currency+
							'</div>');
					
					var thumbnailUrl = value2.image !== undefined ? (value2.thumbnail !== undefined ? value2.thumbnail : value2.image) : "";
					var subImg = thumbnailUrl !== "" ? $("<img>").attr("src", thumbnailUrl) : "";
					subCategoryEntry.find(".thumbnail").append(subImg);
					
					
					subCategoryList.append(subCategoryEntry);
					
					subCategoryEntry.click(function(){
						$('.preview-' + value.name).attr("src", value2.image);
						$('.main-category li').each(function () {
							if($(this).data("category") !== value.name){ return; }
							$(this).find("img").attr("src", thumbnailUrl);
							$(this).find(".name div:last-child").html(value2.name);
							$(this).find(".price").html(value2.price + settings.currency);
						});
						$.fn.productConfigurator.internal.currentSelection[index] = index2;
						$(".summary .price div:last-child").removeClass("price-anim");
						$.fn.productConfigurator.updateTotalPrice(settings.categories);
						
						$(this).parent().find("li").removeClass("active");
						$(this).addClass("active");
					});
				});
				
				mainCategoryEntry.html('<div class="thumbnail"></div>'+
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
				
				var mainImg = defaultItem.val.image !== undefined ? (defaultItem.val.thumbnail !== undefined ? $("<img>").attr("src", defaultItem.val.thumbnail) : $("<img>").attr("src", defaultItem.val.image)) : "";
				mainCategoryEntry.find(".thumbnail").append(mainImg); 
				
				// build preview image
				if(defaultItem.val.image !== undefined) {
					$(previewImageDiv).append(defaultItem.val.image !== undefined ? $("<img>").attr("src", defaultItem.val.image).addClass("preview-" + value.name) : "");
				}
				
				
				//eventHandler for mainCategory
				mainCategoryEntry.click(function(){
					var object = $(this);
					$('.main-category').animate({left: "-" + $('.main-category').parent().width() + "px"}, 300, function (){
						$('#category-'+object.data("category")).css("left", $('.main-category').parent().width() + "px").animate({left: "0px"}, 300);
						$('.settings .back').animate({opacity: "1"}, 300).css("cursor", "pointer");
						$.fn.productConfigurator.internal.openedSub = object.data("category");
					});
				});
				
				// initialize currentSelection object with the default items
				$.fn.productConfigurator.internal.currentSelection[index] = defaultItem.index;
			
				mainCategoryList.append(mainCategoryEntry);
				categoriesDiv.append(subCategoryList);
			});
			// put all together
			previewDiv.append(previewImageDiv);
			var secondPreviewDiv = previewDiv.clone();
			categoriesDiv.append(mainCategoryList);
			settingsDiv.append(categoriesDiv).append(summaryDiv);
			
			previewDiv.append(credits);
			buyInnerDiv.append(secondPreviewDiv).append(buyInfoDiv);
			buyDiv.append(buyInnerDiv);
			
			configuratorDiv.append(buyDiv).append(mobileConfigButtonDiv).append(previewDiv).append(settingsDiv);
			
			$(this).append(configuratorDiv);
			
			// resize all necessary responsive stuff
			$.fn.productConfigurator.resize();
			// initialize categories and finally write the price for the default items
			$.fn.productConfigurator.internal.categories = settings.categories;
			$.fn.productConfigurator.updateTotalPrice();
			
			// fade out loading screen, after everything has been generated
			if(settings.loading && !settings.buffer){
				loadingScreen.fadeOut(300);
			}
		});
 
    };
	
	function imgLoaded(loadingScreen) {
		$.fn.productConfigurator.internal.images.loaded += 1;
		if($.fn.productConfigurator.internal.images.loaded >= $.fn.productConfigurator.internal.images.overall) loadingScreen.fadeOut(300);
	}
	
	// plugin default settings
	$.fn.productConfigurator.defaults = {
		"name": undefined,
		"buyDestinationUrl": undefined,
		"currency": "&euro;",
		"categories": [],
		"buffer": true,
		"localization": {
			"buy": "Buy",
			"decline": "Not now",
			"privacy": "With buying this product you accept our <a href='#'>Privacies</a>",
			"total": "Total"
		},
		"loading": false,
		"loadingHtml": "<h1>Loading</h1><div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div>",
		"additionalControls": true
	};
	$.fn.productConfigurator.internal = {"openedSub": undefined, "currentSelection": {}, "categories": undefined, "currency": "&euro;", "images": {loaded: 0, overall: 0}};
	
	// send data (json object) via post to location
	$.fn.productConfigurator.redirectPost = function(location, data){
        var form = '';
        $.each(data, function( key, value ) {
            form += '<input type="hidden" name="'+key+'" value="'+value+'">';
        });
        $('<form action="'+location+'" method="POST">'+form+'</form>').appendTo('body').submit();
	};
	// update the total price, called when the customers changes an item
	$.fn.productConfigurator.updateTotalPrice = function (){
		var price = 0;
		jQuery.each($.fn.productConfigurator.internal.currentSelection, function(i, val){
			price += $.fn.productConfigurator.internal.categories[i].items[val].price;
		});
				
		$(".summary .price div:last-child, .buy .inner .info .price div:last-child").html(price.toPrecision(4) + $.fn.productConfigurator.internal.currency);
		var el     = $(".summary .price div:last-child"),  
			newone = el.clone(true).addClass("price-anim");

		el.before(newone);

		el.remove();
	};
	// resize responsive but not css scaled elements
	$.fn.productConfigurator.resize = function (){
		var size = $('.configurator .settings .name .back').css("height");
		$('.width-as-height').each(function(){
			$(this).css("width", $(this).css("height"));
		});
		$('.mobile-config-button').css({
			width: size,
			height: size
		});
		$(".additional-controls .controls-button, .additional-controls").each(function(){
			$(this).css({
				width: size,
				height: size
			});
		});
		
		var categoriesHeight = $(".settings").height() - ($(".settings .name").outerHeight() + $(".settings .summary").height());
		$(".settings .categories").css("height", categoriesHeight + "px");
	};
}( jQuery ));