import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import {
    loginUser
} from "../services/authService";

export default function LoginPage() {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            const response = await loginUser({
                email,
                password,
            });

            console.log(response);

            localStorage.setItem(
                "token",
                response.token
            );

            alert("Login successful");
            navigate("/");

        } catch (error: any) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (

        <div className="flex items-center justify-center min-h-screen">

            <form
                onSubmit={handleLogin}
                className="flex flex-col gap-4 w-80"
            >

                <h1 className="text-2xl font-bold">
                    Login
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <button
                    type="submit"
                    className="bg-black text-white p-2"
                >
                    Login
                </button>

                <p className="text-sm text-center">

                    Don't have an account?

                    <Link
                        to="/register"
                        className="text-blue-500 ml-1"
                    >
                        Register
                    </Link>

                </p>

            </form>

        </div>
    );
}