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
<script src="https://unpkg.com/ibembed/dist/instabook.umd.js" type="text/javascript"></script>
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
yanr add ibembed
```

### Npm

```sh
npm install ibembed --save
```


## Usage

> The scheduler is designed to be fluid and will take full width and height of the container.

```js
import InstabookEmbed from 'ibembed';

const options = {
    id: 'id-to-element',
    businessID: 'easytiger',
    fitContent: true
}

const ibEmbed = new InstabookEmbed(options)

// Initiate a reload workflow in the scheduler.
ibEmbed.reload();

const onReady = function() {
    console.log('iframe is ready.');
}

// listen to events.
ibEmbed.addEventListener('iframe:ready', onReady);

ibEmbed.removeEventListener('iframe:ready', onReady);

...later

ibEmbed.reset(); // destroy the iframe.

```
To display a loading indicator while the scheduler is loading, insert a loading element with the ID 'ib-iframe-loader' into your container.

```html
<div id="your-scheduler-container">
    <div id="ib-iframe-loader">
        <!-- Your loading indicator content goes here -->
        Loading...
    </div>
</div>
```

Replace "your-scheduler-container" with the actual ID or class of your scheduler container. Adjust the loading indicator content within the ib-iframe-loader div according to your design preferences.

## Definitions

### Instance options

| Option       | Type        | Required | Default  | Description                                                                                                                                 |
|:-------------|:------------|----------|----------|:--------------------------------------------------------------------------------------------------------------------------------------------|
| `id`         | `string`    | Yes      |          | reload the scheduler                                                                                                                        |
| `businessID` | `string`    | Yes      |          | Business Identifier                                                                                                                         |
| `showLoader` | `boolean`   | No       | false    | Determines if loader element will be shown or not. Loader element should be inside the iframe container with class name ib-iframe-loader    |
| `fitContent` | `boolean`   | No       | false    | Automatically resize the container to fit the content                                                                                       |

### Instance methods

| Method                | Description                                                                    |
|:----------------------|:-------------------------------------------------------------------------------|
| `addEventListener`    | attaches a function that will be called whenever specified event is delivered. |
| `removeEventListener` | removes an event listener previously registered with addEventListener          |
| `reset`               | Reset the iframe element                                                       |

### Instance events

#### Scheduler Ready
This event is called when the scheduler is ready for use. 
```js
ibEmbed.addEventListener('iframe:ready', function () {
  console.log('iframe:ready');
});
```
#### Scheduler Loaded
This event is called when the scheduler is loaded into the iframe.
```js
ibEmbed.addEventListener('iframe:load', function () {
  console.log('iframe:load');
});
```
#### Scheduler Resized
This event is called when the scheduler size is changed inside the iframe.
```js
ibEmbed.addEventListener('iframe:resize', function (data: IframeResizeType) {
  const height = data.height;
  console.log('The updated height is ' + height);
});
```
#### Scheduler Error
This event is called when the iframe failed to load the scheduler
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
