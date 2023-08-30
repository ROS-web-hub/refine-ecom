import { rgb } from "@/types/rgb.type";

interface Props {
    colorPalate: string | null
}

const ColorPalateDisplay: React.FC<Props> = ({colorPalate}) => {
    if(colorPalate == null) return null
    // Replace single quotes with double quotes
    const validJson = colorPalate.replace(/'/g, '"');

    // Parse the valid JSON string into a JavaScript array
    const parsedArray = JSON.parse(validJson);
    
    return (
        <div className="flex flex-row justify-between gap-2 mb-5">
            {parsedArray.slice(0, 5).map((item: number[], index: number) => (
                <div 
                    key={index}
                    style={{
                        backgroundColor: rgb.fromArray(item).toHex(),
                    }}
                    className="group relative cursor-pointer rounded-md transition-all duration-100 w-12 h-8 shadow-none hover:w-20 hover:shadow-md"
                >
                    <p 
                        style={{
                            color: rgb.fromArray(item).toHex(),
                            background: (rgb.fromArray(item).r*0.299 + rgb.fromArray(item).g*0.587 + rgb.fromArray(item).b*0.114) > 186 ? "#6b6b6b" : "",
                        }}
                        className="transition-all rounded-full py-1 px-3 min-w-full w-fit text-center text-xs group-hover:-translate-y-[125%] whitespace-nowrap scale-0 group-hover:scale-100"
                    >{rgb.fromArray(item).toName()}</p>
                </div>
            ))}
        </div>
    )
}

export default ColorPalateDisplay