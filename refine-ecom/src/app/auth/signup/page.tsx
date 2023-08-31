'use client'

import InputGroup from '@/components/inputgroup'
import Modal from '@/components/modal/modal'
import LinkingModal from '@/components/modal/LinkingModal'
import TextInput from '@/components/textinput'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from "uuid"



interface User {
  email: string;
  created_at: Date;
  id: number;
}

interface Users {
  data: [];
  error: object | null;
}

export default function Signup() {

  const [email, setEmail] = useState('')
  const [idEcom, setIdEcom] = useState<string | null>();
  const [id, setId] = useState<number | null>();
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showLinkingModal, setShowLinkingModal] = useState(false)

  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignUp = async () => {

    if (password != confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    /*
    let redirect_url = ""

    if (process.env.NEXT_PUBLIC_ENVIRONMENT != "development") {
      redirect_url = "https://refine-ecom.vercel.app"
    } else {
      redirect_url = "http://localhost:3000"
    }
    redirect_url += "/api/auth/callback"
    */

    let users = await supabase.from("users").select();
    let emailExist: User[] = (users.data ?? []).filter((user: User) => user.email === email);

    //await supabase.from("ecommerce_users").insert({name, onboarding_complete: true})
    
    const res = await supabase.auth.signUp({
      email,
      password,
      options: {
        //emailRedirectTo: redirect_url,
        emailRedirectTo: "https://www.google.com",
      },
    })
    
    if (res.error) {
      const error = res.error
      if (error.name == "AuthApiError") {
        toast.error(error.message)
        return
      } else {
        toast.error(JSON.stringify(error))
      }
    } else {
      await supabase.from("ecommerce_users").insert({id: res.data?.user?.id})
    }
    
    if (emailExist?.length) {
      setId(emailExist[0]?.id);
      setIdEcom(res?.data?.user?.id);
      setShowLinkingModal(true);
    } else {
      router.push("/auth/signin");
    }
  }


  const handleChoice = async () => {
    if (idEcom && id) {
      let ecommerce_user = await supabase
        .from('ecommerce_users')
        .select('id')
        .eq('id', idEcom);

      if (!(ecommerce_user?.data ?? []).length) {
        toast.error("Chrome extension account was not found");
      } else {
        const { error } = await supabase
          .from('ecommerce_users')
          .update({ extension_linked: true, extension_account_id: id })
          .eq('id', idEcom);

        if (!error) {
          toast.success("Successfully linked account");
        } else {
          toast.error(error.message)
        }
      }
    }

    router.push("/auth/signin")
  };

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
        <InputGroup
          title="Confirm Password"
          validationError={null}
          showError={false}
          inputComponent={
            <TextInput
              placeholder="Please confirm your password"
              type="password"
              onChange={(e) => setConfirmPassword(e)}
            />
          }
        />

        <button onClick={handleSignUp} className="bg-indigo-600 text-white w-full py-2 rounded-lg shadow transition-all hover:scale-105 hover:shadow-lg">Submit</button>
        <Link href="/auth/signin">
          <p className="mt-5 text-center cursor-pointer underline transition-all text-indigo-500 hover:text-indigo-700">Sign in instead</p>
        </Link>

        <Modal
          title="Email confirmation sent"
          body="A confirmation link has been sent to your email. Please click the link to complete the signup process."
          showModal={showModal}
        />

        <LinkingModal
          title="Confirmation"
          body="You already registered through chrome extension. Do you want to link your account?"
          showModal={showLinkingModal}
          handleSure={handleChoice}
          handleNothanks={() => { setShowLinkingModal(false) }}
        />

      </div>
    </div>
  )
}