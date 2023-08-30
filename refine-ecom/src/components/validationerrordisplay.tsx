import { ValidationError } from "@/types/forms.types"

interface Props {
    validationError: ValidationError | null | undefined
    showError: boolean
}

const ValidationErrorDisplay: React.FC<Props> = ({validationError, showError}) => {
    return (
        <div className={`${(validationError && showError) ? "translate-x-0 h-12" : "-translate-x-[100vw] h-0"} transition-all duration-500 mx-auto text-center mt-5 bg-red-200 flex flex-row gap-5 w-fit rounded-md p-2 px-5 shadow-lg`}>
            <p className="bg-red-500 rounded-full w-7 h-7 my-auto text-white">!</p>
            <p className="text-sm font-medium my-auto">{validationError?.message}</p>
        </div>
    )
}

export default ValidationErrorDisplay