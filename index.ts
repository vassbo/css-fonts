import fontManager, { FontDescriptor } from "font-scanner"

export interface Family {
    family: string
    default: number
    fonts: Font[]
}
export interface Font {
    path: string
    name: string
    style: string
    css: string
}

export default async function getFonts() {
    // @ts-ignore
    const fonts: FontDescriptor[] = await fontManager.getAvailableFonts()

    let families = fonts.reduce((acc, font) => {
        let key = font.family
        key = removeStyleType(key)

        if (!acc[key]) acc[key] = []
        acc[key].push(font)

        return acc
    }, {} as { [key: string]: FontDescriptor[] })

    const fontFamilies: Family[] = Object.values(families)
        .map((familyList) => {
            const family = removeStyleType(familyList[0].family, true)

            // sort by weight (probably already done by system)

            // default style is the same as the family, or the shortest one
            let defaultFont = familyList.length === 1 ? 0 : familyList.findIndex((a) => a.name.replace("Regular", "").replace("Medium", "").trim() === family)
            if (defaultFont < 0) defaultFont = 0

            let fonts: Font[] = familyList.map((font) => ({
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

function removeStyleType(value: string, extra: boolean = false) {
    // known font
    if (value === "MT Extra") return value

    let stylesToRemove = ["Semibold", "Semi", "Demi", "Bold", "Light", "Medium", "Condensed", "Cond", "Heavy", "Extra", "Extended", " Ext ", "Italic", "Wide", "Backslant"]
    if (extra) stylesToRemove.push(...["Ultra"])

    // replace if not at start of word
    const regex = new RegExp(`(?<!^)(${stylesToRemove.join("|")})`, "g")
    value = value.replace(regex, "").trim().replaceAll("  ", " ").replaceAll("  ", " ")

    return value
}

function getCSS(font: FontDescriptor) {
    // should have used name for all, but some system styles are in native language, and that does not work
    // let css = `font-family: '${removeStyleType(font.name, true)}';`
    // let css = `font-family: '${removeStyleType([font.family, font.style].join(" "), true)}';`
    let family = removeStyleType(font.family, true)
    const knownCustom = ["Segoe UI Variable", "Sitka"]
    if (knownCustom.includes(font.family)) family = removeStyleType(font.name, true)

    const specialStyles = ["Rounded", "Outline", "CAPS", "Condensed"]
    specialStyles.forEach((keyword) => {
        if (font.postscriptName.includes(keyword) && !family.includes(keyword)) family += ` ${keyword}`
    })

    // https://developer.mozilla.org/en-US/docs/Web/CSS/font
    // font-style font-weight font-stretch font-size font-family
    const css = `font: ${font.italic ? "italic" : "normal"} ${font.weight} ${stretch[font.width as StretchKeys]} 1em '${family}';`

    return css
}

type StretchKeys = keyof typeof stretch
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
