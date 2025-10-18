// ==UserScript==
// @name         SmartFrame Downloader
// @namespace    hoixw
// @version      1.2
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

    // Stores reference to shadow root so that we can access it later
    let smartFrameShadowRoot = null;
    const nativeAttachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function(init) {
    const shadowRoot = nativeAttachShadow.call(this, init);
        if (this.tagName.toLowerCase() === 'smartframe-embed') {
            smartFrameShadowRoot = shadowRoot;
            console.log('SMARTFRAME-EMBED shadow root stored:', smartFrameShadowRoot);
        }
        return shadowRoot;
    };

    // NOT NEEDED: Mask the override by patching toString so it returns a benign string
    /*Object.defineProperty(Element.prototype.attachShadow, 'toString', {
        value: function() {
            return "function attachShadow() { [native code] }";
        },
        writable: false,
    });*/

    var checkForSmartFrame = setInterval(function() {
        if (document.querySelector('smartframe-embed')) {
            clearInterval(checkForSmartFrame); // Stop checking once the element is found

            var smartFrame = document.querySelector('smartframe-embed');
            // Actual width and height of image are stored here
            var width = smartFrame.style.getPropertyValue('--sf-original-width');
            var height = smartFrame.style.getPropertyValue('--sf-original-height');

            // Correct width and height variables
            smartFrame.style.width = width + "px";
            smartFrame.style.maxWidth = width + "px";
            smartFrame.style.height = height + "px";
            smartFrame.style.maxHeight = height + "px";

            setTimeout(() => {
                if (smartFrameShadowRoot) {
                    var stage = smartFrameShadowRoot.querySelector("canvas.stage");
                    var url = document.createElement("canvas").toDataURL.call(stage);
                    var t = smartFrame.getAttribute("image-id").replace(/\s/g, '-') + ".png";
                    var a = document.createElement("a");
                    a.href = url;
                    a.download = t;
                    a.click();
                } else {
                    console.error("smartFrameShadowRoot not available");
                }
            }, 3000);
        }
    }, 1000);
} else {
    // Wait for the page to load completely (otherwise smart-frame won't exist)
    window.addEventListener('load', function() {
        if (document.querySelector('smartframe-embed')) {
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

            var smartFrameParent = document.querySelector('smartframe-embed').parentElement;
            smartFrameParent.appendChild(executeButton);
        }
    });
}
