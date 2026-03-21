# Sources & Provenance

## Primary Source: Perseus Digital Library

The Greek texts in this corpus are sourced from the [Perseus Digital Library](https://www.perseus.tufts.edu/) at Tufts University, which provides TEI XML editions of the standard critical editions.

### Editions Used

| Author | Edition | Date | Standard |
|--------|---------|------|----------|
| **Plato** | John Burnet, *Platonis Opera*, Oxford Classical Texts | 1900–1907 | The standard critical edition for over a century |
| **Xenophon** | E.C. Marchant, *Xenophontis Opera Omnia*, Oxford Classical Texts | 1900–1920 | Standard critical edition |
| **Aristophanes** | F.W. Hall & W.M. Geldart, *Aristophanis Comoediae*, Oxford Classical Texts | 1906–1907 | Standard critical edition |

### Perseus License

Perseus Digital Library texts are available under **Creative Commons Attribution-ShareAlike 3.0 United States (CC BY-SA 3.0 US)**.

## Fallback Source: First1KGreek

The [First1KGreek Project](https://github.com/OpenGreekAndLatin/First1KGreek) (Open Greek and Latin Project) provides openly licensed Greek texts on GitHub. Used as a fallback source where Perseus texts required additional processing.

- License: CC BY-SA 4.0
- Repository: https://github.com/OpenGreekAndLatin/First1KGreek

## Text Processing

The raw source files (TEI XML) were processed as follows:

1. TEI XML markup stripped, preserving only the Greek text
2. Stephanus pagination (for Plato) or standard section numbering preserved as Markdown headers
3. Editorial apparatus criticus removed (this corpus provides the main text only)
4. Unicode normalized to NFC (polytonic Greek)
5. Line breaks preserved where meaningful from the critical edition

## What Is Not Included

- **Apparatus criticus**: Variant readings from manuscripts are not included. Consult the critical editions directly for textual variants.
- **Editorial footnotes**: Scholarly annotations from the editors are not reproduced.
- **Translations**: No translations are included. The corpus provides original Greek only.

## How to Verify

Every text can be verified against the freely available Perseus Digital Library:
- https://www.perseus.tufts.edu/hopper/collection?collection=Perseus:collection:Greco-Roman
