# Contributing to socrates-source

Thank you for your interest in improving this corpus. Contributions are welcome in several areas.

## What We Accept

### Text Corrections
If you find an error in the Greek text (a typo, missing passage, incorrect Stephanus reference), please open an issue or PR with:
- The file path and section number
- The incorrect text
- The correct text, with a reference to the critical edition

### Metadata Improvements
- Corrections to dating, character lists, or thematic tags
- Additional cross-references between texts
- Improved descriptions or characterizations

### Script Improvements
- Bug fixes in the Python scripts
- Performance improvements
- New export formats

## What We Don't Accept

- **Translations**: This corpus is Greek-only by design
- **Secondary sources**: No Aristotle, Diogenes Laërtius, or modern scholarship
- **Texts where Socrates does not appear**: The scope is strictly texts featuring Socrates as a character

## How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `python scripts/validate_metadata.py` to ensure metadata integrity
5. Open a pull request with a clear description of your changes

## Style Guide

### Greek Text
- Use Unicode polytonic Greek (NFC normalized)
- Preserve Stephanus pagination as `### 17a` headers
- No transliteration

### Metadata
- Follow the JSON schema in the existing `metadata.json` files
- All cross-references must be bidirectional
- Use ISO date format for dates where applicable

## License

By contributing, you agree that your contributions will be licensed under CC BY-SA 4.0.
