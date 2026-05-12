import { useState } from "react"

import { supabase } from "../../lib/supabase"

export function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] =
        useState("")

    async function handleLogin() {
        const { error } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            })

        if (error) {
            alert(error.message)
        }
    }

    async function handleRegister() {
        const { error } =
            await supabase.auth.signUp({
                email,
                password,
            })

        if (error) {
            alert(error.message)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-white mb-6">
                    LynFlow
                </h1>

                <div className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none"
                    />

                    <button
                        onClick={handleLogin}
                        className="bg-white text-black py-3 rounded-xl font-medium"
                    >
                        Login
                    </button>

                    <button
                        onClick={handleRegister}
                        className="bg-zinc-800 text-white py-3 rounded-xl"
                    >
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    )
}