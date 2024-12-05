const fs = require("fs")
const getFonts = require("../index.js").default

test()
async function test() {
    const fonts = await getFonts()

    console.log(fonts.length, fonts[0])
    fs.writeFile("tests/fonts.json", JSON.stringify(fonts), () => {})
}
