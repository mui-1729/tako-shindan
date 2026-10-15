# Character artwork slots

16 characters are mapped to their four-bit `code` in `src/shared/diagnosis.ts` (`0000` through `1111`).
The MVP uses emoji-based character placeholders, so artwork is **not required to run**.

When custom images are ready, put `0000.webp` through `1111.webp` here and update the
`CharacterDisplay` component in `src/main.tsx` to render the relevant image instead
of the placeholder emoji. A 4:5 portrait or square image with transparent background works well.

The filenames are stable. Keep the character names and codes aligned when editing.
