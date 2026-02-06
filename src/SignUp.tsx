import React, { useEffect, useState } from "react"
import Button from "./components/Button"
import Logo from "./components/Logo"
import LoginSuccess from "./LoginSuccess"

interface SignUpProps {
  message: string
  deviceId: string | null
}

export default function SignUp({ message, deviceId}: SignUpProps) {
  const [connecting, setConnecting] = useState<boolean>(false)
  const [success, setSuccess] = useState<string | null>(null)
  

  useEffect(()=>{
    console.log("SIGNUP PAGE: ", deviceId)
  })
  
  const handleSignUp = () => {
    setConnecting(true)   
    parent.postMessage({ pluginMessage: { type: "start_login" } }, "*")
    window.open(`http://localhost:3000/auth/signin?deviceId=${deviceId}`)
  }


  useEffect(() => {
    const handleSuccessLogin = async (event: MessageEvent) => {
        const msg = event.data.pluginMessage
        if(msg.type === 'login_success'){
            setSuccess("Login Detected successfully!")
            setTimeout(()=>{
                setSuccess(null)
            }, 5000)
        }
    }
    window.addEventListener("message", handleSuccessLogin)

    return () => window.removeEventListener("message", handleSuccessLogin)
  }, [])

  return success ? <LoginSuccess />
  :       
  (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-linear-to-b from-blue-50 to-white rounded-lg shadow-lg text-center space-y-6">
       <div className="mb-4">
        {/* logo */}
        <Logo className="w-13 h-5"/>

        <p className="text-xs text-gray-500">Generate production-ready UI designs using AI</p>
      </div>
      {/* Message */}
      <p className="text-gray-800 text-sm sm:text-base font-medium">
        {!connecting ? message : "Please follow the link and complete the signup. Come back after doing so."}
      </p>

      {/* Illustration / Icon */}
      <div className="w-20 h-20 flex items-center justify-center bg-blue-100 rounded-full">
        <svg
          className="w-10 h-10 text-blue-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </div>

      {/* Signup Button */}
      <Button
        onClick={handleSignUp}
        loading={connecting}
        text="Sign Up to Continue"
        className="max-w-xs"
        loadingText="Connecting..."
      />

      {/* Optional small note */}
      <p className="text-gray-400 text-[10px] sm:text-xs">
        Full access requires signing up
      </p>
    </div>
  )
}
