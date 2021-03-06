/** Forces scroll position to top of page */
/*  Prevents loading to a blank section until ScrollMagic kicks in */
$(window).on('beforeunload', function() {
    $(window).scrollTop(0);
});

/** Returns width of scrollbar if present */
function getScrollbarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";

    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);        

    var widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
}

/** Converts numeric radians to degrees */
if (typeof(Number.prototype.toDeg) === "undefined") {
    Number.prototype.toDeg = function() {
        return this * 180 / Math.PI;
    }
}

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}

/** Converts CSS rgb() to object */
if (typeof(String.prototype.toRGB) === "undefined") {
    String.prototype.toRGB = function() {
        var rgb = this.match(/\d+/g);
        return {r: +rgb[0], g: +rgb[1], b: +rgb[2]};
    }
}
