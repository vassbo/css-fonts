import getFonts from "../index.js"
import fs from "fs"

const fonts = await getFonts()

console.log(fonts.length, fonts[0])
fs.writeFile("tests/fonts.json", JSON.stringify(fonts), () => {})
