// ==UserScript==
// @name         SmartFrame Downloader
// @namespace    hoixw
// @version      1.0
// @description  SmartFrame Downloader
// @author       hoixw
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

// Check if the flag is set in localStorage (uses run-at document start)
if (localStorage.getItem('runCodeAfterRefresh') === 'true') {
    // Remove the flag from localStorage
    localStorage.removeItem('runCodeAfterRefresh');

    /* 
    This forces all shadow-roots created to be open. Closed shadow-roots, as used by the
    smartFrame, cannot be accessed through JS. That's why they exist. 
    Open shadow-roots can, so this means we can just access it and grab the image.
    */
    Element.prototype._attachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function() {
        return this._attachShadow({
            mode: "open"
        });
    };

    var checkForSmartFrame = setInterval(function() {
        if (document.querySelector('smart-frame')) {
            clearInterval(checkForSmartFrame); // Stop checking once the element is found

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

            setTimeout(() => {
                var stage = smartFrame.shadowRoot.querySelector("canvas.stage");
                var url = document.createElement("canvas").toDataURL.call(stage);
                var a = document.createElement("a");
                var t = smartFrame.getAttribute("image-id").replace(/\s/g, '-') + ".png";
                a.href = url;
                a.download = t;
                a.click();
            }, 3000);
        }
    }, 1000);
} else {
    // Wait for the page to load completely (otherwise smart-frame won't exist)
    window.addEventListener('load', function() {
        if (document.querySelector('smart-frame')) {
            'use strict';

            var executeButton = document.createElement('button');
            executeButton.textContent = 'Download Hi-Res';

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
                // Sets localStorage flag for code to be run after refresh immediately
                localStorage.setItem('runCodeAfterRefresh', 'true');

                location.reload();
            });

            var smartFrameParent = document.querySelector('smart-frame').parentElement;
            smartFrameParent.appendChild(executeButton);
        }
    });
}
