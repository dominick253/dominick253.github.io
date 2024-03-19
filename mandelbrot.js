document.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById("mandelbrotCanvas");
    var ctx = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;
    var timeout = 20;
    function mandelbrotSet(x, y) {
        var maxIter = 1000;
        var z = {x: 0, y: 0};
        var c = {x: x, y: y};
        var iter = 0;

        while ((z.x * z.x + z.y * z.y < 4) && (iter < maxIter)) {
            var xtemp = z.x * z.x - z.y * z.y + c.x;
            z.y = 2 * z.x * z.y + c.y;
            z.x = xtemp;
            iter++;
        }

        return iter;
    }

    function getColor(iter) {
        var maxIter = 1000;
        if (iter === maxIter) {
            return {r: 0, g: 0, b: 0}; // Black for points inside the Mandelbrot set
        } else {
            // Create a gradient effect for points that escape
            var hue = iter % 256; // Cycle through 256 hues
            var saturation = 100; // Full saturation
            var lightness = 50; // Medium lightness
            var color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            var rgb = hslToRgb(hue / 256, saturation / 100, lightness / 100);
            return {r: rgb[0], g: rgb[1], b: rgb[2]};
        }
    }

    // Convert HSL to RGB (helper function)
    // Source: https://stackoverflow.com/a/9493060
    function hslToRgb(h, s, l) {
        var r, g, b;
        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            var hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    function drawMandelbrot() {
        var img = ctx.createImageData(width, height);
        var iy = 0;

        function drawRow() {
            if (iy < height) {
                for (var ix = 0; ix < width; ix++) {
                    var x = (ix - width / 2) * 4 / width;
                    var y = (iy - height / 2) * 4 / height;
                    var iter = mandelbrotSet(x, y);
                    var color = getColor(iter);

                    img.data[(ix + iy * width) * 4] = color.r;
                    img.data[(ix + iy * width) * 4 + 1] = color.g;
                    img.data[(ix + iy * width) * 4 + 2] = color.b;
                    img.data[(ix + iy * width) * 4 + 3] = 255; // Alpha
                }
                ctx.putImageData(img, 0, 0);
                iy++;
                setTimeout(drawRow, timeout); // Adjust the delay as needed
            }
        }

        drawRow();
    }

    drawMandelbrot();
});
