# jq-arcs
Interactive arcs

## Dependencies
- jquery
- jQuery UI:
    - jQuery UI widget
- SVG.js


## Features
- Typescript sources
- All the css classes are configurable. See [css classes](https://davinchi-finsi.github.io/jq-arcs/interfaces/jqarcs.arcsoptions.html#classes)
- Extensible with Widget. See [jQuery UI widget docs](http://api.jqueryui.com/jQuery.widget/)
- Customizable using css
- Uses [SVG.js](http://svgjs.com/)

## Docs
For more info, please check the [docs](https://davinchi-finsi.github.io/jq-arcs)

## Playground
[Demo in jsfiddle](https://jsfiddle.net/Haztivity/wzy8a4kx/)

## Usage
Install with `npm i jq-arcs`
or download the [latest release](https://github.com/davinchi-finsi/jq-arcs/releases)

### Import as module
#### Typescript:
```typescript
import * as $ from "jquery";
//choose one of the follow options
//for jquery-ui package
import "jq-arcs/esm2015/jquery-ui-deps";
//for jquery-ui-dist package
import "jquery-ui-dist/jquery-ui";
import {ArcsOptions} from "jq-arcs";
$("someSelector").arcs(<ArcsOptions>{
    //options
});
```
#### Vanilla ES2015
```javascript
import * as $ from "jquery";
//choose one of the follow options
//for jquery-ui package
import "jq-arcs/esm2015/jquery-ui-deps";
//for jquery-ui-dist package
import "jquery-ui-dist/jquery-ui";
import "jq-arcs";
$("someSelector").arcs({
    //options
});
```
**Please note** that depending of the bundler you are using other configurations may be necessary. For example, shimming JQuery and jQuery UI.
### Traditional way
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Some Title</title>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/svg.js/2.6.5/svg.min.js"></script>
        <script type="text/javascript" src="path/to/jquery.arcs"></script>
    </head>
    <body>
       <div id="arcs">
           <div data-arcs-item="">
               <p>Some text 1</p>
           </div>
           <div data-arcs-item="">
               <<p>Some text 2</p>
           </div>
           <div data-arcs-item="">
              <p>Some text 3</p>
           </div>
       </div>
        <script type="text/javascript">
            $("img").arcs();
        </script>
    </body>
</html>
```
## jQuery UI
jQuery UI could be included in the projects in many different ways and with different packages, instead
of force you to use one, we leave up to you how to include it:

### Modularized
Using `npm i jquery-ui` that install the package allowing to import the widgets you want.

We provided a file with the imports of the required dependencies:
```typescript
import "jq-arcs/esm2015/jquery-ui-deps";
```

### dist package
In npm is available the package [jquery-ui-dist](https://www.npmjs.com/package/jquery-ui-dist). Recommended if you will use the most of the framework.

### Downloading a custom bundle
Go to the [jQuery UI download page](https://jqueryui.com/download) and checks:
- Core

or use [this configuration](https://jqueryui.com/download/#!version=1.12.1&components=101000000001000000000000000000000000000000000000)

### Options
Please go to [docs](https://davinchi-finsi.github.io/jq-arcs/interfaces/jqarcs.arcsoptions.html)

### Events
Please go to [docs](https://davinchi-finsi.github.io/jq-arcs/enums/jqarcs.arcsevents.html)

### Methods
For more info, please go to [docs](https://davinchi-finsi.github.io/jq-arcs/classes/jqarcs.arcs.html)
**Please note** that only public methods are available using `$("selector").arcs("methodName","methodParams");`