import getFonts from "../index.js"
import fs from "fs"

const fonts = await getFonts()

console.log(fonts.length, fonts[0])
fs.writeFile("fonts.json", JSON.stringify(fonts), () => {})
