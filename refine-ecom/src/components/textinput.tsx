interface Props {
    placeholder: string
    onChange: (value: string) => void
    className?: string
    type?: string
    defaultValue?: string
    suffix?: string
}

const TextInput: React.FC<Props> = ({placeholder, onChange, className, type, defaultValue, suffix}) => {
    return (
        <div className="relative w-fit">
            <input
                placeholder={placeholder}
                type={type ?? "text"}
                defaultValue={defaultValue}
                onChange={(e)=>{onChange(e.target.value)}}
                className={`rounded-md text-sm max-w-72 bg-white/0 p-3 border border-farloe-light-gray placeholder:text-farloe-light-gray ${suffix && "pr-10"} ${className}`}
            />
            {suffix && (
                <p className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black font-medium">
                    {suffix}
                </p>
            )}
        </div>
    )
}

export default TextInput 