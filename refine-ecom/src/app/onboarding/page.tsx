"use client";
import TextInput from "@/components/textinput";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { useEffect, useState } from "react"

export default function Home() {
    const [favoriteColors, setFavoriteColors] = useState<string[]>([])
    const [name, setName] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)
    const [saving, setSaving] = useState<boolean>(false)

    useEffect(() => {
        loadPreferences()
    }, [])

    async function loadPreferences() {
        const supabase = createClientComponentClient()
        const user = (await supabase.auth.getUser())?.data?.user
        const userData = await supabase.from("ecommerce_users").select("onboarding_complete").eq("id", user?.id).single()
        const onboardingComplete = userData.data?.onboarding_complete

        if(onboardingComplete) {
            const res = await axios.get("/api/preferences")
            setFavoriteColors(res.data.favorite_colors ?? [])
            setName(res.data.name)
        }

        setLoading(false)
    }

    async function savePreferences() {
        setSaving(true)
        await axios.post("/api/preferences", 
            {
                name,
                favoriteColors
            }
        )
        setSaving(false)

        window.location.href = "/"
    }

    return (
        <div className="bg-slate-50 w-full relative min-h-screen text-black flex flex-col p-10">
            <h1 className="text-4xl font-medium text-center">Welcome to Refine</h1>
            <p className="text-gray-500 text-center">Before you access the platform, we&apos;d like to collect a little information.</p>
            <div className={`flex flex-col z-20 gap-5 m-auto transition-all duration-750 opacity-0 scale-0 ${!loading && "opacity-100 scale-100"}`}>
                <FieldCard title="What is your name?">
                    <TextInput
                        placeholder="Enter your name"
                        onChange={(e) => {setName(e)}}
                        defaultValue={name}
                    />
                </FieldCard>

                <FieldCard title="What are your favorite colors?">
                    <ColorSelector
                        onChange={(colors) => {setFavoriteColors(colors)}}
                        defaultColors={favoriteColors}
                    />
                </FieldCard>

                <button onClick={savePreferences} disabled={saving} className={`${saving ? "bg-indigo-400 animate-pulse cursor-default" : "bg-indigo-600 cursor-pointer hover:scale-105 hover:shadow-lg"} text-white w-full py-2 rounded-lg shadow transition-all`}>{saving ? "Saving Preferences" : "Submit"}</button>
            </div>

            <div className={`flex z-10 w-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${loading ? "opacity-100" : "opacity-0 scale-125"}`}>
                <FieldCard title="Loading preferences...">
                    <></>
                </FieldCard>
            </div>
        </div>
    )

}

interface FieldCardProps {
    title: string
    children: React.ReactNode
}

const FieldCard: React.FC<FieldCardProps> = ({title, children}) => {
    return (
        <div className="bg-white shadow rounded-lg flex flex-col gap-2 p-5 w-full mx-auto">
            <p>{title}</p>
            {children}
        </div>
    )
}

interface ColorSelectorProps {
    onChange: (colors: string[]) => void
    defaultColors: string[]
}

const ColorSelector: React.FC<ColorSelectorProps> = ({onChange, defaultColors}) => {
    const colors = [
        "#000000",
        "#0ea5e9",
        "#4ade80",
        "#fb923c",
        "#f87171",
        "#ffffff",
        "#f472b6",
        "#fbbf24",
        "#84cc16",
        "#22c55e"
    ]

    const [selectedColors, setSelectedColors] = useState<string[]>([])

    useEffect(() => {
        setSelectedColors(defaultColors)
    }, [defaultColors])

    function toggleColor(color: string) {
        if(selectedColors.includes(color)) {
            let temp = selectedColors.filter((c) => c !== color)
            setSelectedColors(temp)
            onChange(temp)
        } else {
            let temp = [...selectedColors, color]
            setSelectedColors(temp)
            onChange(temp)
        }
    }

    return (
        <div className="grid grid-cols-5 grid-flow-row gap-5">
            {colors.map((color, index) => {
                return (
                    <div 
                    key={index}
                    onClick={()=>{toggleColor(color)}}
                    style={{
                        backgroundColor: color
                    }} className={`rounded-full w-8 h-8 shadow border-2 transition-all hover:scale-125 cursor-pointer ${selectedColors.includes(color) ? "border-green-400 scale-125" : "border-red-400"}`}/>
                )    
            })}
        </div>
    )
}