var smartFrame = document.querySelector('smart-frame');
var width = smartFrame.style.getPropertyValue('--sf-original-width');
var height = smartFrame.style.getPropertyValue('--sf-original-height');

smartFrame.style.width = width + "px";
smartFrame.style.maxWidth = width + "px";
smartFrame.style.height = height + "px";
smartFrame.style.maxHeight = height + "px";

setTimeout(()=>{
    var stage = document.querySelector("canvas.stage");
    var url = document.createElement("canvas").toDataURL.call(stage);
    var a = document.createElement("a");
    var t = smartFrame.getAttribute("image-id").replace(/\s/g,'-') + ".png";
    a.href = url;
    a.download = t;
    a.click();
}, 4000);
