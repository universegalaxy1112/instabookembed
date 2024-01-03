Instabook Scheduler Embed JavaScript SDK
======================================================================

Official JavaScript SDK (browser) for embedding instabook scheduler.


## Installation

### Browser (manually via script tag)

```html
<script src="/path/to/dist/instabook.umd.js"></script>
<script type="text/javascript">
    const ibEmbed = new InstabookEmbed(options)
    ...
</script>
```

_OR if you are using ES modules:_
```html
<script type="module">
    import InstabookEmbed from '/path/to/dist/instabook.es.mjs'

    const ibEmbed = new InstabookEmbed(options)
    ...
</script>
```

#### Minified JS

```html
<script src="https://unpkg.com/ibembed@version/dist/instabook.umd.js" type="text/javascript"></script>
<script type="text/javascript">
    const ibEmbed = new InstabookEmbed(options)
    ...
</script>

Es module
<script type="module">
    import InstabookEmbed from 'https://unpkg.com/ibembed/dist/instabook.es.mjs'

    const ibEmbed = new InstabookEmbed(options)
    ...
</script>
```

### Yarn

```sh
yarn add ibembed
```

### Npm

```sh
npm install ibembed --save
```


## Usage

> The widget is designed to be fluid and will take full width and height of the container.

```js
import InstabookEmbed from 'ibembed';

const options = {
    id: 'id-to-element',
    businessID: 'easytiger',
    fitContent: true
}

// create a new widget
const ibEmbed = new InstabookEmbed(options)

// initialize the widget
ibEmbed.init();

const onReady = function() {
    console.log('iframe is ready.');
}

// listen to events.
ibEmbed.addEventListener('iframe:ready', onReady);

ibEmbed.removeEventListener('iframe:ready', onReady);

...later

ibEmbed.reset(); // destroy the iframe.

```
To display a loading indicator while the widget is loading, insert a loading element with the ID 'ib-iframe-loader' into your container.

```html
<div id="your-widget-container">
    <div class="ib-iframe-loader">
        <!-- Your loading indicator content goes here -->
        Loading...
    </div>
</div>
```

Replace "your-widget-container" with the actual ID or class of your widget container. Adjust the loading indicator content within the ib-iframe-loader div according to your design preferences.

## Definitions

### Instance options

| Option       | Type        | Required | Default | Description                                                                                                                              |
|:-------------|:------------|----------|---------|:-----------------------------------------------------------------------------------------------------------------------------------------|
| `id`         | `string`    | Yes      |         | The widget container ID                                                                                                                  |
| `businessID` | `string`    | Yes      |         | Business Identifier                                                                                                                      |
| `version`    | `string`    | No       | live    | App Version                                                                                                                              |
| `showLoader` | `boolean`   | No       | false   | Determines if loader element will be shown or not. Loader element should be inside the iframe container with class name ib-iframe-loader |
| `fitContent` | `boolean`   | No       | false   | Automatically resize the container to fit the content                                                                                    |

### Instance methods

| Method                | Description                                                                    |
|:----------------------|:-------------------------------------------------------------------------------|
| `addEventListener`    | Attaches a function that will be called whenever specified event is delivered. |
| `removeEventListener` | Removes an event listener previously registered with addEventListener          |
| `reset`               | Reset the iframe element                                                       |

### Instance events

#### Widget Ready
This event is called when the widget is ready for use. 
```js
ibEmbed.addEventListener('iframe:ready', function () {
  console.log('iframe:ready');
});
```
#### Widget Loaded
This event is called when the widget is loaded into the iframe.
```js
ibEmbed.addEventListener('iframe:load', function () {
  console.log('iframe:load');
});
```
#### Widget Resized
This event is called when the widget size is changed inside the iframe.
```js
ibEmbed.addEventListener('iframe:resize', function (data: IframeResizeType) {
  const height = data.height;
  console.log('The updated height is ' + height);
});
```
#### Widget Error
This event is called when the iframe failed to load the widget
```js
ibEmbed.addEventListener('iframe:error', function (e) {
  console.log('error: ' + e);
});
```

## Development
```sh
# run unit tests
npm test

# build and minify for production
npm run build
```
