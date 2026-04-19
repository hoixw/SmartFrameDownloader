// ==UserScript==
// @name         SmartFrame Downloader
// @namespace    hoixw
// @version      2.1
// @description  Allows for the download of SmartFrame images, using a TamperMonkey script
// @author       hoixw
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// ==/UserScript==

// Stores reference to shadow root so that we can access it later
let smartFrameShadowRoot = null;
const nativeAttachShadow = Element.prototype.attachShadow;
Element.prototype.attachShadow = function(init) {
    const shadowRoot = nativeAttachShadow.call(this, init);
    if (this.tagName.toLowerCase() === 'smartframe-embed') {
        smartFrameShadowRoot = shadowRoot;
    }
    return shadowRoot;
};

// Wait for the page to load completely (otherwise smart-frame won't exist)
window.addEventListener('load', () => {
    const smartFrame = document.querySelector('smartframe-embed');

    // Proceed only if a SmartFrame embed exists on the page.
    if (smartFrame) {
        const executeButton = document.createElement('button');
        executeButton.textContent = 'Download Hi-Res';

        // Apply the original styling to the button.
        Object.assign(executeButton.style, {
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            margin: '10px',
            position: 'relative',
        });

        executeButton.addEventListener('click', () => {
            // Actual width and height of image are stored here
            const width = smartFrame.style.getPropertyValue('--sf-original-width');
            const height = smartFrame.style.getPropertyValue('--sf-original-height');

            // Correct width and height variables
            smartFrame.style.width = width + "px";
            smartFrame.style.maxWidth = width + "px";
            smartFrame.style.height = height + "px";
            smartFrame.style.maxHeight = height + "px";

            const start = performance.now();
            const MAX_WAIT = 60000; // bail out after 60s

            const waitForRender = (resolve, reject) => {
                if (performance.now() - start > MAX_WAIT) {
                    reject(new Error("Timed out waiting for canvas to render"));
                    return;
                }

                if (smartFrameShadowRoot) {
                    const stage = smartFrameShadowRoot.querySelector("canvas.stage");
                    if (stage && stage.width >= width && stage.height >= height) {
                        resolve(stage);
                        return;
                    }
                }

                requestAnimationFrame(() => waitForRender(resolve, reject));
            };

            new Promise(waitForRender)
                .then((stage) => {
                const url = document.createElement("canvas").toDataURL.call(stage);
                const t = smartFrame.getAttribute("image-id").replace(/\s/g, '-') + ".png";
                const a = document.createElement("a");
                a.href = url;
                a.download = t;
                a.click();
            })
                .catch((err) => console.error("SmartFrame Downloader:", err));
        });

        if (smartFrame.parentElement) {
            smartFrame.parentElement.appendChild(executeButton);
        }
    }
});
