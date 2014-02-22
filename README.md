Pandora: A Virtual Learning Environment
===

For years upon years the British education sector has been served with substandard teachnology to do its job. The most abismal part of this fiasco is the millions wasted on cloud-based available-everywhere custom-per-school user-authenticated content management systems. *Prima Facie* it seems very innovative. After all the notion of *the cloud* is very new compared to that of a *computer*. It seems that schools are embracing forward using state-of-the-art technology to create a more interactive experience: settings homework online; putting revision materials online; making student resources available online. **However** in reality the virtual learning environment is clunky, inefficent, slow, verbose, etc. To actually view something you must download it. Donwloading requires *Java* or *Adobe Flash* that must be installed onto your computer to actually do something. There is no concept of extensibility. Metaphors such as that of *rooms* are poorly implemented. Some no names mentioned *cough* Fronter *cough* lack any concept of interactivity to make it worthwhile.  

### Pandora seeks to solve these problems by

#### Simple no-gimmics design
Falling the trend from Windows Phone 7 & 8 as well as iOS 7, we endeavour to use straight-forward flat design. No gimmics, no gradients.

#### Mobile-first development
Following a new industry trend, to build experiences that work on mobiles, tablets & desktops, we create a working version for mobile, then work ourselves up to tablet and then to desktop.

#### No more stupid metaphors
Pandora uses no metaphors save that of files and folders. There is no concept of rooms: only subjects and clubs, which provide the bulk of the UX (User experience)

#### Progressive enhancement
Rather than the likes of many VLEs where the installation of program X is assumed (Java, Adobe Flash, JavaScript) we use the technique of progressive enhancement. We first assume that the client (i.e. Internet Explorer, Google Chrome, etc) has no support for any of these, and we send to the client a copy of a website fit for a JavaScript-less environment. After the page is loaded onto the client, if JavaScript is enabled scripts are run to enhance the website experience through the use of animations and transitions to load new content rather than an entire page load, etc.

### Run locally
Clone the project, and then type the following commands into the terminal:
```bash
# Install dependencies
npm install
# Build project
npm run build
# Test
npm test
# Start project
npm start
```
