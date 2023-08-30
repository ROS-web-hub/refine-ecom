'use client'

import InputGroup from '@/components/inputgroup'
import TextInput from '@/components/textinput'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {toast} from 'react-toastify'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showModal, setShowModal] = useState(false)

  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignIn = async () => {
    const res = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if(res.error) {
        const error = res.error
        if(error.name == "AuthApiError") {
            toast.error(error.message)
            return
        }
    }
    console.log("Signing in...")
    await axios.post("/api/auth/postsignin")
    router.push("/")
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 text-black flex flex-col">
        <div className="px-20 py-5 rounded-lg bg-white shadow w-fit flex flex-col m-auto">
            <InputGroup
                title="Email"
                validationError={null}
                showError={false}
                inputComponent={
                    <TextInput
                        placeholder="Please enter your email"
                        onChange={(e) => setEmail(e)}
                    />
                }
            />
            <InputGroup
                title="Password"
                validationError={null}
                showError={false}
                inputComponent={
                    <TextInput
                        placeholder="Please enter your password"
                        type="password"
                        onChange={(e) => setPassword(e)}
                    />
                }
            />

            <button onClick={handleSignIn} className="bg-indigo-600 text-white w-full py-2 rounded-lg shadow transition-all hover:scale-105 hover:shadow-lg">Submit</button>

            <Link href="/auth/signup">
              <p className="mt-5 text-center cursor-pointer underline transition-all text-indigo-500 hover:text-indigo-700">Sign up instead</p>
            </Link>
        </div>
    </div>
  )
}