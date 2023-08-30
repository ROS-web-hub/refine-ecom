'use client'
import { User, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Navbar = () => {
    const supabase = createClientComponentClient()
    const [user, setUser] = useState<User>()
    const [userName, setUserName] = useState<string>("")

    async function getCurrentUser() {
        const res = await supabase.auth.getUser()
        if(!res.error && res.data) {
            setUser(res.data.user)
            const userData = await supabase.from("ecommerce_users").select("name").eq("id", res.data.user.id).single()
            if(userData.data && userData.data.name) setUserName(userData.data.name)
        }
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        location.reload()
    }

    useEffect(() => {
        if(typeof(user?.email) == "undefined") return
        
        let temp = user?.email?.split("@")[0]
        setUserName(temp[0].toUpperCase() + temp.slice(1))
    }, [user])

    useEffect(() => {
        getCurrentUser()
    }, [])

    return (
        <div className="flex flex-col gap-3">
            <div className="w-full flex flex-row p-5 justify-between">
                <p className="font-bold text-4xl">refine.</p>
                <Account
                    user={user}
                    handleSignOut={handleSignOut}
                />
            </div>
            <p className={`text-4xl text-slate-700 font-bold ml-5 mb-10 transition-all opacity-0 duration-1000 ${userName && "opacity-100"}`}>Welcome, {userName}</p>
        </div>

    )
}

interface AccountProps {
    user: User | undefined
    handleSignOut: () => void
}

const Account: React.FC<AccountProps> = ({user, handleSignOut}) => {
    
    return (
        <>
        {typeof(user) == "undefined" ? (
            <div className="relative group w-fit">
                <Link href="/auth/signup">
                    <p className="font-bold bg-white shadow py-2 px-5 rounded-lg group-hover:rounded-none group-hover:rounded-t-lg hover:bg-gray-50 transition-all cursor-pointer">Sign Up</p>
                </Link>
                <div className="absolute w-full hidden group-hover:flex flex-col bg-white rounded-b-lg shadow border border-gray-100">
                    <Link href="/auth/signin">
                        <p className="w-full transition-all hover:bg-gray-200 text-center py-2 px-4 cursor-pointer rounded-b-lg">Sign In</p>
                    </Link>
                </div>
            </div>
        ) : (
            <div className="relative group">
                <p className="font-bold bg-white shadow py-2 px-5 rounded-lg group-hover:rounded-none group-hover:rounded-t-lg hover:bg-gray-50 transition-all cursor-pointer">Account</p>
                <div className="absolute hidden group-hover:flex flex-col bg-white rounded-b-lg shadow border border-gray-100">
                    <p className="mt-2 mx-5 text-center">{user?.email?.split("@")[0]}</p>

                    <Link href="/onboarding">
                        <p className="w-full transition-all hover:bg-gray-200 text-center py-2 px-4 cursor-pointer">Preferences</p>
                    </Link>
                    {typeof(user) == "undefined" ? (
                        <Link href="/auth/signup">
                            <p className="w-full transition-all hover:bg-gray-200 text-center py-2 px-4 cursor-pointer rounded-b-lg">Sign Up</p>
                        </Link>
                    ) : (
                        <p onClick={handleSignOut} className="w-full transition-all hover:bg-gray-200 text-center py-2 px-4 cursor-pointer rounded-b-lg">Log Out</p>
                    )}
                </div>
            </div>
        )}
        </>
    )
}

export default Navbar