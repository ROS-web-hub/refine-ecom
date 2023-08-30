import { GetColorName } from "hex-color-to-color-name";

export class rgb {
    r: number;
    g: number;
    b: number;

    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    //Converts a color palate string into an array of rgb objects
    static fromColorPalateString(colorPalate: string): rgb[] {
        // Replace single quotes with double quotes
        const validJson = colorPalate.replace(/'/g, '"');

        // Parse the valid JSON string into a JavaScript array
        const parsedArray = JSON.parse(validJson);
        return parsedArray.map((color: number[]) => rgb.fromArray(color));
    }

    static fromArray(arr: number[]): rgb {
        return new rgb(arr[0], arr[1], arr[2]);
    }

    static fromHex(hex: string): rgb {
        console.log(hex)
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);

        return new rgb(r, g, b);
    }

    toHex(): string {
        return "#" + this.r.toString(16) + this.g.toString(16) + this.b.toString(16);
    }

    toName(): string {
        const hex = this.toHex();
        return GetColorName(hex);
    }

    toString(): string {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    distance(other: rgb): number {
        return Math.sqrt(Math.pow(this.r - other.r, 2) + Math.pow(this.g - other.g, 2) + Math.pow(this.b - other.b, 2));
    }
}