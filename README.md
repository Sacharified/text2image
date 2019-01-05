# Summary

This is a simple JS application which uses GraphicsMagick to produce an image of text. GraphicsMagick runs on a Node backend which the client requests images from via websocket. Rendering text this way ensures consistent rendering across platforms.

## Installation

This application relies on GraphicsMagick for image creation and GhostScript for text

`brew install imagemagick && brew install graphicsmagick && brew install ghostscript && npm install`


## Usage

This starts the server and the client

`npm start`