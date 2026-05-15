import { useState } from "react";

import {
    registerUser
} from "../services/authService";

import { useNavigate } from "react-router-dom";

export default function RegisterPage() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            const response = await registerUser({
                username,
                email,
                password,
            });

            console.log(response);

            alert("Registration successful");

            navigate("/login");

        } catch (error) {

            console.error(error);

            alert("Registration failed");
        }
    };

    return (

        <div className="flex items-center justify-center min-h-screen">

            <form
                onSubmit={handleRegister}
                className="flex flex-col gap-4 w-80"
            >

                <h1 className="text-2xl font-bold">
                    Register
                </h1>

                <input
                    type="text"
                    placeholder="Username"
                    className="border p-2"
                    value={username}
                    onChange={(e) =>
                        setUsername(e.target.value)
                    }
                />

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
                    Register
                </button>

            </form>

        </div>
    );
}