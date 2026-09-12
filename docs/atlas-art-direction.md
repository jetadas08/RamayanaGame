# Reference palette and atlas artwork

The supplied Hanumān map is the art-direction reference. The interface uses ocean blue (#0e4b65), rosewood (#2b1d15), parchment (#efd9af), antique gold (#e8bd69), forest green (#637a3b), and cream (#f6e3b7). The shared implementation is in app/theme.scss. Atlas-specific presentation is in app/atlas.scss.

## Terrain asset

File: public/images/atlas-terrain.png

Generated with the built-in image-generation tool, using the supplied image as a style reference. The asset is clipped inside Natural Earth coastline polygons; decorative mountains, rivers, temples, and forests are not surveyed geography.

Final generation prompt:

> Use case: illustration-story. Create a square 1536x1536 painterly terrain texture asset for a sacred Ramayana adventure atlas. The attached image is STYLE AND PALETTE reference only. Fill the entire image edge to edge with top-down illustrated South Asian inland terrain: moss olive forests, warm golden grassland, scattered palm groves, small beautifully painted rocky mountain ridges, meandering thin rivers, tiny temple roof details. Detailed hand-painted antique storybook cartography, soft dimensional relief, warm sunlit ochre and rich forest green exactly like the map reference. This is an INLAND TERRAIN TEXTURE which will be clipped inside accurate coastline polygons by application code. No coastline, no ocean, no island silhouettes, no borders, no panels, no characters, no lettering, no labels, no pins, no dotted routes. Lots of delicate varied terrain detail at small scale. Avoid flat vector look. Save generated asset locally and return its file path.

## Geography and narrative layout

Coastlines: Natural Earth via world-atlas/countries-50m.json (generalized 1:50m). Mercator projection, north up, equal geographic scale for India and Sri Lanka.

Modern reference positions:

- Rāmeśvaram: approximately 79.313° E, 9.288° N. [Coordinate reference](https://www.geodatos.net/en/coordinates/india/rameswaram).
- Seetha Eliya region: approximately 80.804° E, 6.936° N. [Coordinate reference](https://mapcarta.com/14801414). The modern location is a reference anchor for a traditional association, not proof of an epic site.

Other encounter markers use explicit story-layout positions. Mahendra is a debated southern candidate region; ocean encounters and Laṅkā city events are symbolic. The ring encounter uses an offset with a leader line to the same traditional region as Aśoka Vātikā. The bridge line is approximate and labelled as a traditional reference.
