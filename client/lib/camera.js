Camarasharpen=function(imgObj, mix) {
    console.log("sharpen init");
    var canvas = document.createElement('canvas');
    var canvasContext = canvas.getContext('2d');
    var w = imgObj.width, imgW = imgObj.width;
    var h = imgObj.height, imgH = imgObj.height;
    canvas.width = imgW;
    canvas.height = imgH;

    canvasContext.drawImage(imgObj, 0, 0);
    //console.log("sharpen drawImage w:" + w + ',h:' + h);
    var x, sx, sy, r, g, b, a, dstOff, srcOff, wt, cx, cy, scy, scx,
        weights = [0, -1, 0, -1, 5, -1, 0, -1, 0],
        katet = Math.round(Math.sqrt(weights.length)),
        half = (katet * 0.5) | 0;
    var srcBuff = canvasContext.getImageData(0, 0, imgObj.width, imgObj.height);
    //console.log("sharpen srcBuff after w:" + w + ',h:' + h);
    var dstData = canvasContext.createImageData(imgObj.width, imgObj.height);

    //console.log("sharpen dstData after w:" + w + ',h:' + h);
    var dstBuff = dstData;
    var y = imgObj.height;
    //console.log("sharpen while w:" + w + ',h:' + h);
    while (y--) {
        x = w;
        while (x--) {
            sy = y;
            sx = x;
            dstOff = (y * w + x) * 4;
            r = 0;
            g = 0;
            b = 0;
            a = 0;

            for (cy = 0; cy < katet; cy++) {
                for (cx = 0; cx < katet; cx++) {
                    scy = sy + cy - half;
                    scx = sx + cx - half;

                    if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
                        srcOff = (scy * w + scx) * 4;
                        wt = weights[cy * katet + cx];

                        r += srcBuff.data[srcOff] * wt;
                        g += srcBuff.data[srcOff + 1] * wt;
                        b += srcBuff.data[srcOff + 2] * wt;
                        a += srcBuff.data[srcOff + 3] * wt;
                    }
                }
            }

            dstBuff.data[dstOff] = r * mix + srcBuff.data[dstOff] * (1 - mix);
            dstBuff.data[dstOff + 1] = g * mix + srcBuff.data[dstOff + 1] * (1 - mix);
            dstBuff.data[dstOff + 2] = b * mix + srcBuff.data[dstOff + 2] * (1 - mix);
            dstBuff.data[dstOff + 3] = srcBuff.data[dstOff + 3];
        }
    }

    canvasContext.putImageData(dstData, 0, 0);
    // console.log("sharpen end");
    // console.log("canvas.toDataURL():", canvas.toDataURL());
    return canvas.toDataURL();
}

Camaragray=function(imgObj) {
    var canvas = document.createElement('canvas');
    var canvasContext = canvas.getContext('2d');

    var imgW = imgObj.width;
    var imgH = imgObj.height;
    canvas.width = imgW;
    canvas.height = imgH;

    canvasContext.drawImage(imgObj, 0, 0);
    var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);

    for (var y = 0; y < imgPixels.height; y++) {
        for (var x = 0; x < imgPixels.width; x++) {
            var i = (y * 4) * imgPixels.width + x * 4;
            var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
           /*
            if (avg>90){
                imgPixels.data[i] = 255;
                imgPixels.data[i + 1] = 255;
                imgPixels.data[i + 2] = 255;

            } else {
                imgPixels.data[i] = 0;
                imgPixels.data[i + 1] = 0;
                imgPixels.data[i + 2] = 0;
            }
            */

            imgPixels.data[i] = avg;
            imgPixels.data[i + 1] = avg;
            imgPixels.data[i + 2] = avg;

        }
    }
    canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
    return canvas.toDataURL();
}
