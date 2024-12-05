# Get system font families

> Get a list of system fonts as CSS style organized in their proper families

## Example

```js
import getFonts from "css-fonts"

const fonts = await getFonts()

// returns a list like this:
[
    {
        family: 'Arial',
        default: 0,
        fonts: [
            {
                path: '/Fonts/Arial.ttf',
                name: 'Arial',
                style: 'Normal',
                css: "font: normal 400 normal 1em 'Arial';"
            },
            {
                path: '/Fonts/ArialN.ttf',
                name: 'Arial Narrow',
                style: 'Narrow',
                css: "font: normal 400 condensed 1em 'Arial';"
            },
            {
                path: '/Fonts/ArialI.ttf',
                name: 'Arial Cursive',
                style: 'Cursive',
                css: "font: italic 400 normal 1em 'Arial';"
            },
            ...
        ]
    },
    ...
]
```
