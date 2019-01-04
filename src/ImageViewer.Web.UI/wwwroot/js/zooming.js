Zooming = function (image) {
    this._image = $(image);

    this._lastScale = 0;
    this._image.bind('touchy-pinch', this._OnPinch.bind(this));

    var onImageChanged = this.OnImageChanged.bind(this);
    image.addEventListener("load", onImageChanged, false);
    window.addEventListener("resize", onImageChanged, false);
};

Zooming.prototype._OnPinch = function (e, $target, data) {
    this._lastScale = data.previousScale + data.scale;

    $target.css({ 'webkitTransform': 'scale(' + this._lastScale + ',' + this._lastScale + ')' });
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
        this._image.css("top", offsetY);
    } else if (offsetY <= 0) {
        this._image.css("top", 0);
        offsetY = Math.abs(offsetY);
        $(document).scrollTop(offsetY);
    }
};