import { ValidationError } from "@/types/forms.types";
import ValidationErrorDisplay from "./validationerrordisplay";

interface Props {
    title: string;
    inputComponent: React.ReactNode;
    validationError: ValidationError | null | undefined
    showError: boolean
}

const InputGroup: React.FC<Props> = ({title, inputComponent, validationError, showError}) => {
    return (
        <div className="relative flex flex-col">
            <Header text={title}/>
            {inputComponent}
            
            <ValidationErrorDisplay
                showError={showError}
                validationError={validationError}
            />
        </div>
    )
}

interface HeaderProps {
    text: string;
    className?: string
}

const Header: React.FC<HeaderProps> = ({text, className}) => {
    return (
        <p className={`text-md mb-1 ${className}`}>{text}</p>
    )
}

export default InputGroup