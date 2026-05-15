import { useState } from "react";

interface Props {
    onCreate: (task: any) => void;
}

export default function TaskForm({
    onCreate,
}: Props) {

    const [title, setTitle] = useState("");

    const [description, setDescription] =
        useState("");

    const handleSubmit = (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!title.trim()) return;

        onCreate({
            title,
            description,
            completed: false,
        });

        setTitle("");
        setDescription("");
    };

    return (

        <form
            onSubmit={handleSubmit}
            className="bg-white p-5 rounded-xl shadow-sm mb-6 flex flex-col gap-4"
        >

            <h2 className="text-xl font-semibold">
                Create New Task
            </h2>

            <input
                type="text"
                placeholder="Task title"
                className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-black"
                value={title}
                onChange={(e) =>
                    setTitle(e.target.value)
                }
            />

            <textarea
                placeholder="Task description"
                className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-black"
                value={description}
                onChange={(e) =>
                    setDescription(e.target.value)
                }
            />

            <button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white p-3 rounded-lg transition"
            >
                Create Task
            </button>

        </form>
    );
}