import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import TaskForm from "../components/TaskForm";

import { getCurrentUser } from "../services/authService";

import {
    getTasks,
    createTask,
    deleteTask,
    updateTask
} from "../services/taskService";

export default function DashboardPage() {

    const navigate = useNavigate();

    const [tasks, setTasks] = useState<any[]>([]);

    const [user, setUser] =
        useState<any>(null);

    const [loading, setLoading] =
        useState(true);

    const [editingTaskId, setEditingTaskId] =
        useState<number | null>(null);

    const [editTitle, setEditTitle] =
        useState("");

    const [editDescription, setEditDescription] =
        useState("");

    useEffect(() => {

        fetchTasks();

        fetchUser();

    }, []);

    const fetchUser = async () => {

        try {

            const data =
                await getCurrentUser();

            setUser(data);

        } catch (error) {

            console.error(error);
        }
    };

    const fetchTasks = async () => {

        try {

            setLoading(true);

            const data = await getTasks();

            setTasks(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };

    const handleCreateTask = async (
        task: any
    ) => {

        try {

            await createTask(task);

            fetchTasks();

        } catch (error) {

            console.error(error);
        }
    };

    const handleDeleteTask = async (
        id: number
    ) => {

        try {

            await deleteTask(id);

            fetchTasks();

        } catch (error) {

            console.error(error);
        }
    };

    const handleToggleComplete = async (
        task: any
    ) => {

        try {

            await updateTask(task.id, {

                ...task,

                completed: !task.completed,
            });

            fetchTasks();

        } catch (error) {

            console.error(error);
        }
    };

    const startEditing = (task: any) => {

        setEditingTaskId(task.id);

        setEditTitle(task.title);

        setEditDescription(task.description);
    };

    const saveEdit = async (
        task: any
    ) => {

        try {

            await updateTask(task.id, {

                ...task,

                title: editTitle,

                description: editDescription,
            });

            setEditingTaskId(null);

            fetchTasks();

        } catch (error) {

            console.error(error);
        }
    };

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };

    return (

        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-3xl mx-auto">

                <div className="flex justify-between items-center mb-8">

                    <div>

                        <h1 className="text-4xl font-bold">
                            Task Dashboard
                        </h1>

                        <p className="text-gray-600 mt-1">
                            Manage your daily tasks
                        </p>

                        {user && (

                            <div className="mt-3">

                                <p className="font-medium">
                                    {user.username}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {user.email}
                                </p>

                            </div>
                        )}

                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition"
                    >
                        Logout
                    </button>

                </div>

                <TaskForm onCreate={handleCreateTask} />

                <div className="space-y-4">

                    {loading ? (

                        <p>Loading tasks...</p>

                    ) : tasks.length === 0 ? (

                        <div className="border rounded p-6 text-center bg-white">

                            <p className="text-gray-500">
                                No tasks yet
                            </p>

                        </div>

                    ) : (

                        tasks.map((task) => (

                            <div
                                key={task.id}
                                className="bg-white border p-5 rounded-xl shadow-sm hover:shadow-md transition"
                            >

                                <div className="flex items-start justify-between gap-4">

                                    <div className="flex-1">

                                        {editingTaskId === task.id ? (

                                            <div className="flex flex-col gap-3">

                                                <input
                                                    type="text"
                                                    value={editTitle}
                                                    onChange={(e) =>
                                                        setEditTitle(e.target.value)
                                                    }
                                                    className="border rounded-lg p-2"
                                                />

                                                <textarea
                                                    value={editDescription}
                                                    onChange={(e) =>
                                                        setEditDescription(e.target.value)
                                                    }
                                                    className="border rounded-lg p-2"
                                                />

                                            </div>

                                        ) : (

                                            <>

                                                <h2
                                                    className={`font-bold text-lg ${task.completed
                                                        ? "line-through text-gray-500"
                                                        : ""
                                                        }`}
                                                >
                                                    {task.title}
                                                </h2>

                                                <p className="text-gray-600 mt-1">
                                                    {task.description}
                                                </p>

                                            </>

                                        )}

                                    </div>

                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() =>
                                            handleToggleComplete(task)
                                        }
                                        className="w-5 h-5 mt-1"
                                    />

                                </div>

                                <div className="flex gap-3 mt-4">

                                    {editingTaskId === task.id ? (

                                        <button
                                            onClick={() =>
                                                saveEdit(task)
                                            }
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                                        >
                                            Save
                                        </button>

                                    ) : (

                                        <button
                                            onClick={() =>
                                                startEditing(task)
                                            }
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                                        >
                                            Edit
                                        </button>

                                    )}

                                    <button
                                        onClick={() =>
                                            handleDeleteTask(task.id)
                                        }
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>
                        ))
                    )}

                </div>

            </div>

        </div>
    );
}