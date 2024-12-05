// import fontManager from "font-scanner"

export default async function getFonts() {
    const fontManager = (await import("font-scanner")).default
    const fonts = await fontManager.getAvailableFonts()

    /** @type {{[key: string]: (import("font-scanner").FontDescriptor)[]}} */
    let families = fonts.reduce((acc, font) => {
        let key = font.family
        key = removeStyleType(key)

        if (!acc[key]) acc[key] = []
        acc[key].push(font)

        return acc
    }, {})

    const fontFamilies = Object.values(families)
        .map((familyList) => {
            const family = removeStyleType(familyList[0].family, true)

            // sort by weight (probably already done by system)

            // default style is the same as the family, or the shortest one
            let defaultFont = familyList.length === 1 ? 0 : familyList.findIndex((a) => a.name.replace("Regular", "").replace("Medium", "").trim() === family)
            if (defaultFont < 0) defaultFont = 0

            /**
             * @type { {
             * path: string
             * name: string
             * style: string
             * css: string
             * }[] }
             */
            let fonts = familyList.map((font) => ({
                path: font.path,
                name: font.name,
                style: font.style,
                css: getCSS(font)
            }))

            return { family, default: defaultFont, fonts }
        })
        .sort((a, b) => a.family.localeCompare(b.family))

    return fontFamilies
}

function removeStyleType(value, extra = false) {
    // known font
    if (value === "MT Extra") return value

    let stylesToRemove = ["Demi", "Bold", "Light", "Medium", "Condensed", "Cond", "Heavy", "Extra", "Extended", " Ext ", "Italic", "Wide", "Semi", "Backslant"]
    if (extra) stylesToRemove.push(...["Ultra"])

    // replace if not at start of word
    const regex = new RegExp(`(?<!^)(${stylesToRemove.join("|")})`, "g")
    value = value.replace(regex, "").trim().replaceAll("  ", " ").replaceAll("  ", " ")

    return value
}

function getCSS(/** @type import("font-scanner").FontDescriptor */ font) {
    // let css = `font-family: '${removeStyleType(font.name, true)}';`
    // let css = `font-family: '${removeStyleType([font.family, font.style].join(" "), true)}';`
    let family = removeStyleType(font.family, true)

    if (font.postscriptName.includes("Rounded")) family += " Rounded"
    else if (font.postscriptName.includes("Outline")) family += " Outline"
    else if (font.postscriptName.includes("CAPS")) family += " CAPS"
    else if (font.postscriptName.includes("Condensed")) family += " Condensed"

    // https://developer.mozilla.org/en-US/docs/Web/CSS/font
    // font-style font-weight font-stretch font-size font-family
    const css = `font: ${font.italic ? "italic" : "normal"} ${font.weight} ${stretch[font.width]} 1em '${family}';`

    return css
}

const stretch = {
    1: "ultra-condensed",
    2: "extra-condensed",
    3: "condensed",
    4: "semi-condensed",
    5: "normal",
    6: "semi-expanded",
    7: "expanded",
    8: "extra-expanded",
    9: "ultra-expanded"
}
