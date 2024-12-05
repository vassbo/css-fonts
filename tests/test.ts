import getFonts from "../index.js"
// @ts-ignore
import fs from "fs"

test()
async function test() {
    const fonts = await getFonts()

    console.log(fonts.length, fonts[0])
    fs.writeFile("tests/fonts.json", JSON.stringify(fonts), () => {})
}
