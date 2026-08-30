# Some experiments

Small browser experiments in exact mathematics, visual reasoning and useful models. The repository began in 2019 as a demonstration of JavaScript talking to GeoGebra. The current version keeps that idea and makes the boundary between the page, the mathematics and the applet explicit.

The function trainer generates only linear functions that can be read exactly from the displayed grid. Its parser accepts equivalent notation, identifies syntax errors before they reach GeoGebra, and can distinguish an incorrect slope from an incorrect intercept. A local SVG renderer is the reliable base; GeoGebra adds the full construction environment when it is available.

## Run

Serve the directory over HTTP: `python3 -m http.server 8080`

Run the domain tests with Node.js 22 or newer: `npm test && npm run check`

There is no runtime package dependency and no build step. Modern evergreen browsers are supported. The HTML remains readable without JavaScript; the interactive elements progressively enhance it.

## Structure

- `js/math/` contains exact rational arithmetic, the readable-function bank and the input parser.
- `js/components/` contains framework-free custom elements.
- `test/` exhaustively checks the generator and representative parser cases.
- `ggb/` retains the original construction files for historical examples.

## Licensing

Authored source code is available under the MIT License. GeoGebra is loaded as a separately licensed third-party service for the teaching experiment and is not covered by this repository's MIT License. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
