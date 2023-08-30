interface Props {
    title: string
    body: string
    showModal: boolean
    handleSure: () => Promise<void>
    handleNothanks: () => void
  }
const LinkingModal: React.FC<Props> = ({ title, body, showModal, handleSure, handleNothanks }) => {
    return (
        <div className={`absolute top-0 left-0 w-screen h-screen bg-black/10 backdrop-blur-md ${showModal ? "flex" : "hidden"}`}>
            <div className="bg-white m-auto rounded-xl overflow-clip shadow-lg flex flex-col gap-5 max-w-[70vw]">
                <div className="relative bg-green-200 w-full h-32">
                    <div className="absolute flex bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-green-500 rounded-full w-14 h-14">
                        <p className="m-auto text-white font-bold text-3xl">✓</p>
                    </div>
                </div>
                <div className="p-10 flex flex-col">
                    <p className="text-3xl font-bold text-center mb-5">{title}</p>
                    <p className="text-sm text-black/60">{body}</p>
                </div>
                <div className="m-auto flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <button data-modal-hide="staticModal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => { handleSure() }}>Sure</button>
                    <button data-modal-hide="staticModal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" onClick={() => { handleNothanks() }}>No thanks</button>
                </div>
            </div>
        </div>
    )
}

export default LinkingModal