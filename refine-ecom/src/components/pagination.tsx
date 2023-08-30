"use client";

import { useState } from "react";

interface Props {
    updatePage: (page: number) => void
}

const Pagination: React.FC<Props> = ({updatePage}) => {
    const [page, setPage] = useState(0)

    return (
        <div className="flex flex-row mx-auto gap-2 rounded-full font-bold text-slate-600 text-3xl bg-white px-5 py-2 shadow my-10">
            <p onClick={()=>{if(page > 0) {updatePage(page - 1); setPage(page - 1)}}} className="cursor-pointer transition-all hover:text-slate-400">&lt;</p>
            <p className="font-light text-xl my-auto">{page + 1}</p>
            <p onClick={()=>{updatePage(page + 1); setPage(page + 1)}} className="cursor-pointer transition-all hover:text-slate-400">&gt;</p>
        </div>
    )
}

export default Pagination