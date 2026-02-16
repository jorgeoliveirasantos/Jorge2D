# Jorge2D Library Documentation

The **Jorge2D** library provides an abstraction layer over the HTML5 Canvas API, facilitating the creation of geometric shapes, images, text, and scene structuring for games or 2D animations. It includes classes for managing the canvas, drawing static objects, loading resources, and creating an update loop (game loop).

---

## Table of Contents

1. [Installation and Basic Usage](#installation-and-basic-usage)
2. [`Drawing` Class](#drawing-class)
   - [Constructor](#constructor)
   - [Properties](#properties)
   - [Static drawing methods](#static-drawing-methods)
   - [Image loading](#image-loading)
   - [Text writing](#text-writing)
3. [`Game` Class and Game Loop](#game-class-and-game-loop)
4. [Renderable Objects](#renderable-objects)
   - [`Path`](#path)
   - [`Picture`](#picture)
   - [`Text`](#text)
5. [Scene Hierarchy (Experimental)](#scene-hierarchy-experimental)
6. [Observations and Limitations](#observations-and-limitations)

---

## Installation and Basic Usage

The library is provided as an ES6 module. To use it in your project, import the necessary classes:

```javascript
import { Drawing, Game, Path, Picture, Text } from './Jorge2D.js';
```

Then, create a `Drawing` instance to obtain the canvas and, optionally, a `Game` object to control the animation loop.

```javascript
const canvasApp = new Drawing('black'); // black background
document.body.appendChild(canvasApp.canvas); // already attached automatically
```

---

## `Drawing` Class

The `Drawing` class is responsible for creating and managing the `<canvas>` element, as well as providing methods for drawing static shapes and loading resources.

### Constructor

```javascript
new Drawing(backgroundColor)
```

- **backgroundColor** (string): canvas background color (any valid CSS value).

The constructor creates the canvas, sets its size to `window.innerWidth` x `window.innerHeight`, applies positional styles, and attaches it to `document.body`. It also registers resize and mouse movement events.

### Properties

- `canvas` – reference to the `<canvas>` element.
- `context` – canvas 2D context.
- `width`, `height` – canvas dimensions (note: in the current code there's a swap between width/height, see [Observations](#observations-and-limitations)).
- `cursor` – `{ x, y }` object containing mouse position relative to the canvas.
- `blendModes` – object with supported composition modes (values for use with `ctx.globalCompositeOperation`).
- `filters` – object with helper methods for filters (only `linearGradient` outlined).

### Static drawing methods

All methods below return a [`Path`](#path) instance. Drawing only occurs when the object's `render()` method is called (typically inside the game loop).

#### `drawPath(svgData, fillColor, strokeColor, lineWidth, lineDash)`
Draws an arbitrary SVG path.
- **svgData** (string): path data in SVG format (e.g., `"M20 20 l200 0 l0 100 l-200 0 Z"`).
- **fillColor**, **strokeColor** (string): CSS colors.
- **lineWidth** (number): stroke thickness.
- **lineDash** (array): dash pattern (e.g., `[15,5]`).

#### `drawPolygon(sides, radius, x, y, fillColor, strokeColor, lineWidth, lineDash)`
Draws a regular polygon.
- **sides** (number): number of sides.
- **radius** (number): distance from center to vertices.
- **x, y** (number): center coordinates.

#### `drawStar(points, radius, aperture, x, y, fillColor, strokeColor, lineWidth, lineDash)`
Draws a star.
- **points** (number): number of points.
- **radius** (number): outer radius.
- **aperture** (number): aperture factor (0 → bold, 1 → thin, 0.5 → normal).
- **x, y** (number): center.

#### `drawRectangle(width, height, x, y, fillColor, strokeColor, lineWidth, lineDash)`
Draws a rectangle.
- **width, height** (number): dimensions.
- **x, y** (number): top-left corner.

#### `drawCircle(radius, x, y, fillColor, strokeColor, lineWidth, lineDash)`
Draws a circle.
- **radius** (number): radius.
- **x, y** (number): center.

#### `drawEllipse(width, height, x, y, fillColor, strokeColor, lineWidth, lineDash)`
Draws an ellipse.
- **width, height** (number): total width and height.
- **x, y** (number): center.

### Image loading

#### `loadImage(url, posX, posY, width, height)`
Asynchronously loads an image and returns a `Promise` that resolves to a [`Picture`](#picture) object.
- **url** (string): image path.
- **posX, posY** (number): position on canvas.
- **width, height** (number): display dimensions (if omitted, uses original dimensions).

Example:
```javascript
const myImg = await drawing.loadImage('photo.jpg', 100, 50, 200, 150);
```

### Text writing

#### `writeText(text, textStyle, fontSize, fontFamily, fontColor, posX, posY)`
Creates a [`Text`](#text) object that can be rendered.
- **text** (string): content.
- **textStyle** (string): `"normal"`, `"bold"`, `"italic"`.
- **fontSize** (string): size in CSS format (e.g., `"12pt"`, `"16px"`).
- **fontFamily** (string): font family.
- **fontColor** (string): CSS color.
- **posX, posY** (number): text center position.

---

## `Game` Class and Game Loop

The `Game` class implements a basic animation loop.

```javascript
const game = new Game(drawing.canvas);
game.onUpdate((deltaTime) => {
    // automatic canvas clearing is already done
    // draw your objects here
});
```

### Constructor

```javascript
new Game(canvas)
```
- **canvas** – reference to the `<canvas>` element (obtained from `Drawing.canvas`).

### Methods

#### `onUpdate(gameLoopCallback)`
Starts the animation loop. The callback receives `deltaTime` (difference in ms since the last frame) and executes each frame. Before calling the callback, the canvas is completely cleared (`clearRect`).

---

## Renderable Objects

Objects returned by drawing methods must be explicitly rendered using the `render()` method. They can be stored and reused each frame.

### `Path`

Represents a geometric shape defined by an SVG path.

#### Properties
- `canvas`, `svgData`, `fillColor`, `strokeColor`, `lineWidth`, `lineDash`.

#### Methods
- `render()` – draws the path on the canvas.

### `Picture`

Represents an image.

#### Constructor (not used directly)
Typically created via `Drawing.loadImage()`.

#### Properties
- `img` – loaded `Image` object.
- `posX`, `posY`, `width`, `height`.

#### Methods
- `render()` – draws the image.
- `replace(url)` – replaces the image with another (asynchronous loading).

### `Text`

Represents text.

#### Constructor (not used directly)
Created via `Drawing.writeText()`.

#### Properties
- `text`, `textStyle`, `fontSize`, `fontFamily`, `fontColor`, `posX`, `posY`.
- `properties` – object for future transformations/animations.

#### Methods
- `render()` – draws the text centered at the specified position.

---

## Scene Hierarchy (Experimental)

The `Scene`, `Node`, and `GameObject` classes are partially implemented and suggest a tree structure for organizing game elements. In the current state, only `Picture` inherits from `GameObject`, but transformation methods (`transform`, `animate`) are empty or incomplete. It is recommended not to use them until properly implemented.

---

## Observations and Limitations

1. **Canvas dimensions**  
   In the `Drawing` constructor, the `width` and `height` properties are inverted:  
   `this.height = window.innerWidth;` and `this.width = window.innerHeight;`.  
   This may cause unexpected behavior when using coordinates based on these properties. It is suggested to correct to:  
   ```javascript
   this.width = window.innerWidth;
   this.height = window.innerHeight;
   ```

2. **Transformations and animations**  
   The `transform` and `animate` methods in `GameObject`, `Picture`, and `Text` classes are only outlined (empty bodies or incomplete implementation). There is no real support for rotation, scaling, etc. at the moment.

3. **Filters and blend modes**  
   The `filters` object contains only a `linearGradient` method that is not functional (uses undefined `ctx`). Blend modes are listed but not automatically applied.

4. **Audio/content loading**  
   The `loadAudio` and `loadContent` methods are present but not implemented.

5. **UI Class**  
   It is defined but empty.

6. **Use of `scale` in `Picture.render` and `Text.render`**  
   There is a `ctx.scale(this.canvas.width / 100, this.canvas.height / 100)` that seems to attempt creating a normalized coordinate system (0‑100), but this interferes with the provided coordinates. If not intentional, remove or adjust it.

7. **`resize` event**  
   When resizing the window, the canvas is resized, but the internal `width`/`height` dimensions remain swapped.

---

## Complete Example

```javascript
import { Drawing, Game } from './Jorge2D.js';

(async () => {
    // Create the canvas
    const drawing = new Drawing('#111');
    
    // Wait for image loading
    const logo = await drawing.loadImage('logo.png', 50, 50, 100, 100);
    
    // Create static shapes
    const rectangle = drawing.drawRectangle(200, 100, 150, 200, 'rgba(255,0,0,0.5)', 'white', 2);
    const circle = drawing.drawCircle(60, 400, 250, 'blue', 'yellow', 4, [10,5]);
    const text = drawing.writeText('Hello, Jorge2D!', 'bold', '24pt', 'Arial', 'lime', 300, 100);
    
    // Start the game loop
    const game = new Game(drawing.canvas);
    game.onUpdate((dt) => {
        // Render all objects (canvas clearing is automatic)
        logo.render();
        rectangle.render();
        circle.render();
        text.render();
    });
})();
```

---

This documentation covers the current state of the library. For contributions or corrections, consider adjusting the points listed in [Observations](#observations-and-limitations).
