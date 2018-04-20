const url_base = "/feature-policy/experimental-features/resources/";
window.messageResponseCallback = null;

function getUrl(fileName) {
  return url_base + fileName;
}

function rectMaxY(rect) {
  return rect.height + rect.y;
}

function rectMaxX(rect) {
  return rect.width + rect.x;
}

function rect_contains(rect, x, y) {
  return (rect.x <= x)  && (rectMaxX(rect) > x) &&
         (rect.y <= y) && (rectMaxY(rect) > y);
}

// Returns true if the given rectangles intersect.
function rects_intersect(rect1, rect2) {
  return rect_contains(rect1, rect2.x, rect2.y) ||
         rect_contains(rect1, rect2.x, rectMaxY(rect2)) ||
         rect_contains(rect1, rectMaxX(rect2), rect2.y) ||
         rect_contains(rect1, rectMaxX(rect2), rectMaxY(rect2)) ||
         rect_contains(rect2, rect1.x, rect1.y) ||
         rect_contains(rect2, rect1.x, rectMaxY(rect1)) ||
         rect_contains(rect2, rectMaxX(rect1), rect1.y) ||
         rect_contains(rect2, rectMaxX(rect1), rectMaxY(rect1));
}

// Returns a promise which is resolved when the <iframe> is navigated to |url|
// and "load" handler has been called.
function loadUrlInIframe(iframe, url) {
  return new Promise((resolve) => {
    iframe.addEventListener("load", resolve);
    iframe.src = url;
  });
}

// Posts |message| to |target| and resolves the promise with the response coming
// back from |target|.
function sendMessageAndGetResponse(target, message) {
  return new Promise((resolve) => {
    window.messageResponseCallback = resolve;
    target.postMessage(message, "*");
  });
}

function rectToString(rect) {
  return `Location: (${rect.x}, ${rect.y}) Size: (${rect.width}, ${rect.height})`;
}

function onMessage(e) {
  if (window.messageResponseCallback) {
    window.messageResponseCallback(e.data);
    window.messageResponseCallback = null;
  }
}

window.addEventListener("message", onMessage);
