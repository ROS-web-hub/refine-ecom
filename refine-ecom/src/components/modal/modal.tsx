interface Props {
    title: string
    body: string
    showModal: boolean
}

const Modal: React.FC<Props> = ({title, body, showModal}) => {
    return (
        <div className={`absolute top-0 left-0 w-screen h-screen bg-black/10 backdrop-blur-md flex transition-all duration-700 ${showModal ? "" : "-translate-x-full"}`}>
            <div className="bg-white p-5 m-auto rounded-lg shadow-lg flex flex-col gap-5 max-w-[30vw]">
                <p className="text-xl font-bold">{title}</p>
                <p>{body}</p>
            </div>
        </div>
    )
}

export default Modal