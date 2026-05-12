import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"

export function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        const { error } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            })

        setLoading(false)

        if (!error) {
            navigate("/")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleLogin}
                className="w-[350px] bg-zinc-900 p-6 rounded-xl border border-zinc-800"
            >
                <h1 className="text-white text-xl mb-4">
                    Login
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    className="w-full mb-3 p-3 bg-zinc-950 text-white border border-zinc-800 rounded-lg"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    className="w-full mb-4 p-3 bg-zinc-950 text-white border border-zinc-800 rounded-lg"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black py-2 rounded-lg"
                >
                    {loading ? "Loading..." : "Login"}
                </button>
            </form>
        </div>
    )
}