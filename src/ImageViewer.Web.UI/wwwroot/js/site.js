// globals
var reloadLink = document.getElementById("lnk-reload");
var contentImage = document.getElementById("img-content");
var loadingPlaceholder = document.getElementById("spn-loading");
var titlePlaceholder = document.getElementById("spn-title");
var prevButton = document.getElementById("lnk-prev");
var nextButton = document.getElementById("lnk-next");

var originalUrl = document.body.dataset['imageUrl'];
var locale = document.body.dataset['locale'];
var lastEtag = null;

var authentication = new Authentication();
var zooming = new Zooming(contentImage);
var imageHistory = [];
var imageHistoryIndex = 0;

// sets current loading status.
function setLoading(isLoading) {
    if (loadingPlaceholder !== null) {
        loadingPlaceholder.style.display = isLoading ? 'block' : 'none';
    }
}

function formatDate(dateString) {
    var timestamp = Date.parse(dateString);
    if (!Number.isNaN(timestamp)) {
        var date = new Date(timestamp);

        if (locale != null && locale != '') {
            dateString = date.toLocaleString(locale);
        } else {
            dateString = date.toLocaleString();
        }
    }

    return dateString;
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

    var authenticationToken = authentication.GetCurrentToken();
    if (authenticationToken !== null) {
        xhr.setRequestHeader("X-Authentication-Token", authenticationToken);
    }

    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 304) {
            var arrayBuffer = xhr.response;
            if (arrayBuffer) {
                var etag = xhr.getResponseHeader("ETag");
                if (etag === null || !showImageFromHistoryWithEtag(etag)) {
                    var bytes = new Uint8Array(arrayBuffer);
                    var date = formatDate(xhr.getResponseHeader("Last-Modified"));
                    var imageSrc = 'data:image/png;base64,' + encode(bytes);

                    lastEtag = etag;
                    saveImage(imageSrc, date, etag);
                    renderImage(imageSrc, date);
                    ensurePrevNextButton();
                }
            }

        } else if (xhr.status === 401) {
            authentication.Show();
        } else if (xhr.status === 500) {
            alert('The remote server responded with an internal error (' + xhr.status + '). Please try it again later.');
        } else if (xhr.status === 503) {
            alert('The remote server is not running (' + xhr.status + '). Please try it again later.');
        } else {
            alert('An unexpected response came from the remote server (' + xhr.status + '). Please try it again later.');
        }

        setLoading(false);
    };
    xhr.onerror = function (e) {
        alert('The remote server is not responding. Please check your internet connection.');
    };

    xhr.send(null);
}

function showImageFromHistoryWithEtag(etag) {
    for (var i = imageHistory.length - 1; i >= 0; i--) {
        if (imageHistory[i].etag === etag) {
            if (i !== imageHistoryIndex) {
                imageHistoryIndex = i;
                showImageFromHistory();
            }

            ensurePrevNextButton();
            return true;
        }
    }

    return false;
}

function renderImage(src, date) {
    zooming.SaveCurrentScroll();

    contentImage.src = src;
    titlePlaceholder.innerHTML = 'Taken on <strong>' + date + '</strong>';
}

function saveImage(src, date, etag) {
    if (imageHistory.length > 10) {
        imageHistory = imageHistory.slice(1);
    }

    imageHistory.push({ src: src, date: date, etag: etag });
    imageHistoryIndex = imageHistory.length - 1;
    ensurePrevNextButton();
}

function ensurePrevNextButton() {
    prevButton.style.display = imageHistoryIndex > 0 ? '' : 'none';
    nextButton.style.display = imageHistoryIndex < imageHistory.length - 1 ? '' : 'none';
}

function showPrevImage() {
    if (imageHistoryIndex > 0) {
        imageHistoryIndex--;
        showImageFromHistory();
    }

    ensurePrevNextButton();
}

function showNextImage() {
    if (imageHistoryIndex < imageHistory.length - 1) {
        imageHistoryIndex++;
        showImageFromHistory();
    }

    ensurePrevNextButton();
}

function showImageFromHistory() {
    var image = imageHistory[imageHistoryIndex];
    lastEtag = image.etag;
    renderImage(image.src, image.date);
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

prevButton.addEventListener("click", function (e) {
    showPrevImage();
    e.preventDefault();
});

nextButton.addEventListener("click", function (e) {
    showNextImage();
    e.preventDefault();
});

loadImage();

authentication.OnCurrentTokenChanged = loadImage;