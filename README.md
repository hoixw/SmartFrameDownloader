# SmartFrame Downloader
Enables the download of high-resolution PNG images from a DRM-protected SmartFrame image. 

### This should not be used to bypass copyright restrictions. 
That being said, many SmartFrame-protected images - such as many of those in the [coventry.digital](https://coventry.digital/) archive and in Historic England's [Aerial Photo Explorer](https://historicengland.org.uk/images-books/archive/collections/aerial-photos/) remain under no copyright, yet are protected. 

I am not responsible if you do something illegal (in whatever jurisdiction you live in) with this code. I am merely underlining the ineffectiveness of any DRM like this, and underlining the fact that many copyright-free photos are arbitrarily protected. 

## Contents
- `console.js` - a piece of code, which, when copied and ran in a browser's console, will download the image
- `tampermonkey.js` - code for a tampermonkey script. addss a nice button which, when clicked, will download the image. automatically detects if a smartframe exists, so can run in background.

## Attributions
`console.js` is a bugfix of anoynmous script posted online. `tampermonkey.js` is my own work, building off the prior file. 
