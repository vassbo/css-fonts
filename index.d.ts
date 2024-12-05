declare module "css-fonts" {
    export interface Family {
        family: any
        default: number
        fonts: Font[]
    }
    export interface Font {
        path: string
        name: string
        style: string
        css: string
    }

    /**
     * Gets available fonts in the system
     *
     * @returns Fonts orgainzed by family
     */
    export default function getFonts(): Promise<Family[]>
}
