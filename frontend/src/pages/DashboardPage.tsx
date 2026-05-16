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
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [editingTaskId, setEditingTaskId] =
        useState<number | null>(null);

    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] =
        useState("");

    useEffect(() => {

        fetchTasks();
        fetchUser();

    }, []);

    const fetchUser = async () => {

        try {

            const data = await getCurrentUser();

            setUser(data);

        } catch (error) {

            console.error(error);
        }
    };

    const fetchTasks = async () => {

        try {

            setLoading(true);

            const data = await getTasks();

            if (Array.isArray(data)) {

                setTasks(data);

            } else {

                console.error(
                    "Tasks response is not an array:",
                    data
                );

                setTasks([]);
            }

        } catch (error) {

            console.error(error);

            setTasks([]);

        } finally {

            setLoading(false);
        }
    };

    const handleCreateTask = async (task: any) => {

        try {

            await createTask(task);

            fetchTasks();

        } catch (error) {

            console.error(error);
        }
    };

    const handleDeleteTask = async (id: number) => {

        try {

            await deleteTask(id);

            fetchTasks();

        } catch (error) {

            console.error(error);
        }
    };

    const handleToggleComplete = async (task: any) => {

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

    const saveEdit = async (task: any) => {

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

    const safeTasks =
        Array.isArray(tasks) ? tasks : [];

    const completedTasks =
        safeTasks.filter(
            (t) => t.completed
        ).length;

    const totalTasks = safeTasks.length;

    return (

        <div className="min-h-screen bg-slate-100">

            <div className="bg-white shadow px-6 py-4 flex justify-between items-center">

                <div>

                    <h1 className="text-2xl font-bold">
                        Task Dashboard
                    </h1>

                    {user && (

                        <p className="text-gray-600">
                            Welcome, {user.username}
                        </p>
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Logout
                </button>
            </div>

            <div className="max-w-4xl mx-auto p-6">

                <div className="grid grid-cols-3 gap-4 mb-6">

                    <div className="bg-white p-4 rounded shadow">

                        <h2 className="text-gray-500">
                            Total Tasks
                        </h2>

                        <p className="text-3xl font-bold">
                            {totalTasks}
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded shadow">

                        <h2 className="text-gray-500">
                            Completed
                        </h2>

                        <p className="text-3xl font-bold text-green-600">
                            {completedTasks}
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded shadow">

                        <h2 className="text-gray-500">
                            Pending
                        </h2>

                        <p className="text-3xl font-bold text-yellow-600">
                            {totalTasks - completedTasks}
                        </p>
                    </div>
                </div>

                <TaskForm onCreate={handleCreateTask} />

                <div className="mt-6 space-y-4">

                    {loading ? (

                        <div className="text-center">
                            Loading tasks...
                        </div>

                    ) : safeTasks.length === 0 ? (

                        <div className="bg-white p-6 rounded shadow text-center">

                            No tasks found.
                        </div>

                    ) : (

                        safeTasks.map((task) => (

                            <div
                                key={task.id}
                                className="bg-white p-4 rounded shadow"
                            >

                                {editingTaskId === task.id ? (

                                    <div className="space-y-3">

                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) =>
                                                setEditTitle(e.target.value)
                                            }
                                            className="w-full border p-2 rounded"
                                        />

                                        <textarea
                                            value={editDescription}
                                            onChange={(e) =>
                                                setEditDescription(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border p-2 rounded"
                                        />

                                        <button
                                            onClick={() => saveEdit(task)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                        >
                                            Save
                                        </button>

                                    </div>

                                ) : (

                                    <div>

                                        <div className="flex justify-between items-start">

                                            <div>

                                                <h3 className="text-lg font-bold">
                                                    {task.title}
                                                </h3>

                                                <p className="text-gray-600">
                                                    {task.description}
                                                </p>
                                            </div>

                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() =>
                                                    handleToggleComplete(task)
                                                }
                                            />
                                        </div>

                                        <div className="flex gap-2 mt-4">

                                            <button
                                                onClick={() =>
                                                    startEditing(task)
                                                }
                                                className="bg-yellow-500 text-white px-4 py-2 rounded"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDeleteTask(task.id)
                                                }
                                                className="bg-red-500 text-white px-4 py-2 rounded"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}