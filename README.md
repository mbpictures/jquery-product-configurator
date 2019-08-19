# jquery-product-configurator
With this project you can add a simple, lightweight and responsive product configure to your online shop. It allows customers to combine a product
of several predefined parts. [Live Demo](http://projects.marius-butz.de/product-configurator)

## usage
The only thing you need to do is to include the ```jquery.product-configure.css``` and ```jquery.product-configure.js``` in your html file.
After that, initialize the product configurator with:
```JavaScript
$("body").productConfigurator(...);
```
All the html will generated automatically by the plugin. The plugin is concepted to work only with one product configurator each site.

## options
* name (default: ```undefined```): the name of the product
* buyDestinationUrl (```undefined```): destination file where the results of the configuration should be sent to (when the user clicks on buy)
* currency (```€```): the currency of your prices. you should use the html strings, instead of ```€``` you would write ```&euro;```
* categories (```[]```): this is a array of JSON objects which describes the item parts of your product, further information at the [categories](#categories) part
* loading (```false```): should a loading screen be displayed until the html has been rendered?
  * ```true```: loading screen
  * ```false```: no loading screen
* loadingHtml (```<h1>Loading</h1><div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div>```): inner html of the loading screen (e.g. for the css animation or some text)
* additionalControls (```true```): ability to zoom the product in or out (top left corner)
  * ```true```: yes, show the buttons
  * ```false```: no zoom buttons
* localization (```JSON```)
  * buy (```Buy```)
  * decline (```Not now```)
  * privacy (```With buying this product you accept our <a href='#'>Privacies</a>```)
  * total (```Total```)
  
## categories
An array of JSON objects. Each object with the following keys:
* ```name```: the name of the category (the part of the product)
* ```thumbnail```: thumbnail of the category (only displayed, when the user didn't choose an other item)
* ```items```: an array of JSON objects. Each object with the following keys
  * ```name```: the name of the item (e.g. the color)
  * ```price```: the price of the product (float)
  * ```image```: the image to update the preview and the thumbnail of the category
  * ```default```: is this item the default item when the page loads
If you want categories without changing preview or images overall (e.g. for the shoe size) don't define the ```thumbnail``` and ```image``` keys.

Example for a possible item:
```JSON
{
  "name": "case",
  "thumbnail": "img/thumbnail-case.png",
	"items": [{
      "name": "default",
			"price": 10.99,
			"image": "img/thumbnail-case.png",
      "default": true
		},
		{
		  "name": "red",
			"price": 14.99,
			"image": "img/case/case-red.png"
		},
		{
			"name": "green",
			"price": 14.99,
			"image": "img/case/case-green.png"
		},
		{
			"name": "blue",
			"price": 14.99,
			"image": "img/case/case-blue.png"
		}
	]
}
```
## plugin values and functions
* ```$.fn.productConfigurator.internal.openedSub``` (```undefined```): opened submenu by the user
* ```$.fn.productConfigurator.internal.currentSelection``` (```{}```): the current constellation of the product configuration
* ```$.fn.productConfigurator.internal.categories``` (```{}```): copy of the categories array you provided in the options
* ```$.fn.productConfigurator.internal.currency``` (```&euro;```): copy of the string you provided in the options
* ```$.fn.productConfigurator.redirectPost(location, data)```: method to send ```data``` (json object) via post to ```location```
* ```$.fn.productConfigurator.updateTotalPrice()```: method to update the total price in the summary and the buy dialog. Usually called when the customer changes an item
* ```$.fn.productConfigurator.resize()```: method to resize all responsive and not css sizeable elements. Usually called when the page renders for the first time or gets resized.

## credentials
You have the credit me on your main page and you aren't allowed to remove the footer in the plugin. Thanks for your appreciation.

## contribution
Feel free to report bugs or create pull requests.
