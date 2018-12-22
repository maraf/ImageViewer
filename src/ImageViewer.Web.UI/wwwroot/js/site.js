// globals
var reloadLink = document.getElementById("lnk-reload");
var contentImage = document.getElementById("img-content");
var loadingPlaceholder = document.getElementById("spn-loading");
var titlePlaceholder = document.getElementById("spn-title");

var originalUrl = document.body.dataset['imageUrl'];
var lastEtag = null;

// sets current loading status.
function setLoading(isLoading) {
    if (loadingPlaceholder !== null) {
        loadingPlaceholder.style.display = isLoading ? 'block' : 'none';
    }
}

// load new version of image
function loadImage() {
    setLoading(true);

    var xhr = new XMLHttpRequest();
    xhr.open("GET", originalUrl, true);
    xhr.responseType = "arraybuffer";

    if (lastEtag !== null) {
        xhr.setRequestHeader("If-None-Match", lastEtag);
    }

    xhr.onload = function (e) {
        var arrayBuffer = xhr.response;
        if (arrayBuffer) {
            var etag = xhr.getResponseHeader("ETag");
            if (etag === null || lastEtag !== etag) {
                lastEtag = etag;

                var bytes = new Uint8Array(arrayBuffer);
                var date = xhr.getResponseHeader("Last-Modified");
                contentImage.src = 'data:image/png;base64,' + encode(bytes);
                titlePlaceholder.innerHTML = 'Taken: ' + date;
            }
        }

        setLoading(false);
    };
    xhr.onerror = function (e) {
        alert(e);
    };

    xhr.send(null);
}

// public method for encoding an Uint8Array to base64
function encode(input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
        chr1 = input[i++];
        chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
        chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
            keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
}

// initialization

reloadLink.addEventListener("click", function (e) {
    loadImage();
    e.preventDefault();
});

loadImage();