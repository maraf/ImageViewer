Zooming = function (image) {
    this._image = $(image);

    this._lastScale = 0;
    this._image.bind('touchy-pinch', this._OnPinch.bind(this));
};

Zooming.prototype._OnPinch = function (e, $target, data) {
    this._lastScale = data.previousScale + data.scale;

    $target.css({ 'webkitTransform': 'scale(' + this._lastScale + ',' + this._lastScale + ')' });
};