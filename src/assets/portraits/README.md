# Character Portraits

This directory will contain character portrait images extracted and optimized from the FFXI Character Creation spreadsheet.

## Organization Structure

```
portraits/
├── hume/
│   ├── male/
│   └── female/
├── elvaan/
│   ├── male/
│   └── female/
├── tarutaru/
│   ├── male/
│   └── female/
├── mithra/
│   └── female/
└── galka/
    └── male/
```

## File Format

- **Format**: WebP for optimal file size and quality
- **Naming**: `portrait-{race}-{gender}-{id}.webp`
- **Size**: Optimized for web display
- **Quality**: High enough for clear character identification

## Implementation Notes

- Images will be extracted from the FFXI Character Creation spreadsheet
- Organized by race and gender following FFXI character creation structure
- Used by CharacterPortraitPicker component for character creation
- Displayed in CharacterSelector and public character views
