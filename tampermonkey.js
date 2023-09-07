// ==UserScript==
// @name         SmartFrame Downloader
// @namespace    hoixw
// @version      1.0
// @description  SmartFrame Downloader
// @author       hoixw
// @match        *://*/*
// @grant        none
// ==/UserScript==

if (document.querySelector('smart-frame')) {
    'use strict';

    // Create a button element
    var executeButton = document.createElement('button');
    executeButton.textContent = 'Download Hi-Res';

    // Apply CSS styles
    executeButton.style.padding = '10px 20px';
    executeButton.style.backgroundColor = '#007BFF';
    executeButton.style.color = 'white';
    executeButton.style.border = 'none';
    executeButton.style.borderRadius = '5px';
    executeButton.style.cursor = 'pointer';
    executeButton.style.fontWeight = 'bold';
    executeButton.style.margin = '10px';

    // Attach a click event listener to the button
    executeButton.addEventListener('click', function() {
        var smartFrame = document.querySelector('smart-frame');
        var styles = getComputedStyle(smartFrame);
        // Actual width and height of image are stored here
        var width = smartFrame.style.getPropertyValue('--sf-original-width');
        var height = smartFrame.style.getPropertyValue('--sf-original-height');

        // Correct width and height variables
        smartFrame.style.width = width + "px";
        smartFrame.style.maxWidth = width + "px";
        smartFrame.style.height = height + "px";
        smartFrame.style.maxHeight = height + "px";

        setTimeout(function() {
            var stage = document.querySelector("canvas.stage");
            var url = document.createElement("canvas").toDataURL.call(stage);
            var a = document.createElement("a");
            var t = smartFrame.getAttribute("image-id").replace(/\s/g,'-') + ".png";
            a.href = url;
            a.download = t;
            a.click();
        }, 4000);
    });

    // Find the parent element of the query-selected element and append the button to it
    var smartFrameParent = document.querySelector('smart-frame').parentElement;
    smartFrameParent.appendChild(executeButton);
}
