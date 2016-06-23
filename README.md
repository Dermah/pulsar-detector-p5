# pulsar-detector-p5
Detect pulses and render them with p5.js

## Make your own drawings

Making your own drawings is a bit like making a [p5.js](http://p5js.org/)/[Processing](https://processing.org/) sketch. There is a setup function (called when the drawing is activated initially), and a draw function (called every frame). Additionally, PULSAR drawings expose another function that indicate whether or not they have finished drawing, allowing the whole drawing to be garbage collected.

To make your own drawings, you need to build an object with prototype like this:

```JavaScript
// This prototype must be saved at src/pulses/name-of-drawing.js
var Drawing = function (p5, pulse, config) {
  this.pulse = pulse;
  // The pulse object contains information to customise the drawing.
  // You should mere it with some defaults
  // This drawing will only be used if pulse.name === name-of-drawing
  // Do your setup stuff here. For example, set up a frame counter to
  // track how many frames this has been run for.
  this.framesLeft = 50;
};
Drawing.prototype.draw = function (p5) {
  // This function is called every frame.
  // Do all your frame by frame drawing using the p5 object here.
  // If you wanted to draw a rectangle in the middle of the screen
  // you would do the following:
  p5.rect(p5.windowWidth/2, p5.windowHeight/2, 50, 50);
  this.framesLeft--;
};
Drawing.prototype.done = function () {
  // Return true if this drawing is finished. It will then be cleaned up by
  // the drawing manager. Otherwise return false if you want to keep drawing frames
  if (this.framesLeft <= 0) {
    return true;
  } else {
    return false;
  }
}
module.exports = Drawing;
```
If you want your drawing to be updatable, add an update function. Usually you would merge the original `pulse` object that created the drawing with the update `pulse`. PULSAR provides a function on the p5 object to do this easily.

```JavaScript
Drawing.prototype.update = function (p5, pulse, config) {
  p5.pulsar.merge(this.pulse, pulse);
}
```

Place your drawing in the `src/pulses/` directory.

Then, to have the drawing activated on client machines, get `lib/transmitter/key-processor.js` to emit a `pulsar` `io` event when you press a key on the keyboard.

```JavaScript
io.emit('pulse', {
  name: 'name-of-drawing',
  // Other configuration options here.
  // This whole object is passed to the
  // drawing constructor
});
```
