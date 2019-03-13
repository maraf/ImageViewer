Zooming = function (image) {
    this._lastScale = 1;

    this._image = $(image);
    this._image.bind('touchy-pinch', this._OnPinch.bind(this));

    var onImageChanged = this.OnImageChanged.bind(this);
    image.addEventListener("load", onImageChanged, false);
    window.addEventListener("resize", onImageChanged, false);
};

Zooming.prototype._OnPinch = function (e, $target, data) {
    var delta = data.scale - data.previousScale;
    if (data.scale > 1 || this._lastScale <= 1) {
        this._lastScale += delta;
    } else {
        this._lastScale += delta * this._lastScale;
    }

    $target.css({ 'webkitTransform': 'scale(' + this._lastScale + ',' + this._lastScale + ')' });



    titlePlaceholder.innerHTML = "Scale: " + data.scale.toFixed(2) + "; Previous: " + data.previousScale.toFixed(2) + "; Last: " + this._lastScale.toFixed(2) + "; Delta: " + delta.toFixed(2);
};

Zooming.prototype.OnImageChanged = function () {
    var imageWidth = this._image[0].width;
    var imageHeight = this._image[0].height;

    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;

    var offsetX = (screenWidth - imageWidth) / 2;
    var offsetY = (screenHeight - imageHeight) / 2;

    if (offsetX > 0) {
        this._image.css("left", offsetX);
    } else if (offsetX <= 0) {
        this._image.css("left", 0);
        offsetX = Math.abs(offsetX);
        $(document).scrollLeft(offsetX);
    }

    if (offsetY > 0) {
        this._image.css("top", offsetY).removeClass("overlapping");
    } else if (offsetY <= 0) {
        this._image.css("top", 0).addClass("overlapping");
        offsetY = Math.abs(offsetY);
        $(document).scrollTop(offsetY);
    }
};