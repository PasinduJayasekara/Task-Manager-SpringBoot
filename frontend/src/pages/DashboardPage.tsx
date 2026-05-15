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
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

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
            setTasks(data);
        } catch (error) {
            console.error(error);
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

    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 py-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Task Manager</h1>
                                {user && (
                                    <p className="text-sm text-slate-600 mt-0.5">
                                        Welcome back, <span className="font-medium text-slate-900">{user.username}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-all duration-200 hover:shadow-md"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Total Tasks</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{totalTasks}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Completed</p>
                                <p className="text-3xl font-bold text-emerald-600 mt-1">{completedTasks}</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">In Progress</p>
                                <p className="text-3xl font-bold text-amber-600 mt-1">{totalTasks - completedTasks}</p>
                            </div>
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Task Form */}
                <TaskForm onCreate={handleCreateTask} />

                {/* Tasks List */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                            <div className="inline-block w-8 h-8 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="text-slate-600 mt-4">Loading tasks...</p>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">No tasks yet</h3>
                            <p className="text-slate-600">Create your first task to get started!</p>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all duration-200 ${
                                    task.completed ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200'
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Checkbox */}
                                    <div className="flex-shrink-0 pt-1">
                                        <label className="relative flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => handleToggleComplete(task)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-6 h-6 border-2 border-slate-300 rounded-lg peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all duration-200 flex items-center justify-center">
                                                {task.completed && (
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </label>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        {editingTaskId === task.id ? (
                                            <div className="flex flex-col gap-3">
                                                <input
                                                    type="text"
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    className="border-2 border-slate-300 focus:border-blue-500 rounded-lg px-4 py-2.5 outline-none transition-colors"
                                                    placeholder="Task title"
                                                />
                                                <textarea
                                                    value={editDescription}
                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                    className="border-2 border-slate-300 focus:border-blue-500 rounded-lg px-4 py-2.5 outline-none transition-colors resize-none"
                                                    rows={3}
                                                    placeholder="Task description"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className={`text-lg font-semibold mb-1 ${
                                                    task.completed ? 'line-through text-slate-500' : 'text-slate-900'
                                                }`}>
                                                    {task.title}
                                                </h3>
                                                {task.description && (
                                                    <p className={`text-sm leading-relaxed ${
                                                        task.completed ? 'text-slate-400' : 'text-slate-600'
                                                    }`}>
                                                        {task.description}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 mt-4 pl-10">
                                    {editingTaskId === task.id ? (
                                        <>
                                            <button
                                                onClick={() => saveEdit(task)}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingTaskId(null)}
                                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => startEditing(task)}
                                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTask(task.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}