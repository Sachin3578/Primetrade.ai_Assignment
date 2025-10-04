import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth(); // should have role: "admin"
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch users & tasks on component mount
  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers();
      fetchAllUserTasks();
    }
  }, [user]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users");
    }
  };

  //Fetch all tasks created by all users
  const fetchAllUserTasks = async () => {
    try {
      const res = await API.get("/admin/tasks");
      setTasks(res.data);
    } catch (err) {
      setError("Failed to load tasks");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setLoading(true);
    try {
      const res = await API.post("/admin/tasks", { title: newTask });
      setTasks((prev) => [...prev, res.data]);
      setNewTask("");
    } catch (err) {
      setError("Failed to create task");
    } finally {
      setLoading(false);
    }
  };


  // ✅ Delete any task (admin authority)
  const handleDeleteTask = async (id) => {
    try {
      await API.delete(`/admin/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* USERS SECTION */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">All Users</h2>
          {users.length === 0 ? (
            <p className="text-gray-600">No users found</p>
          ) : (
            <ul className="divide-y">
              {users.map((u) => (
                <li key={u._id} className="py-2">
                  <span className="font-medium">{u.name}</span>{" "}
                  <span className="text-gray-500 text-sm">({u.email})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* TASKS SECTION */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">All User Tasks</h2>
          </div>

          {/* Admin can also create tasks if needed */}
          <form onSubmit={handleCreateTask} className="mb-4 flex">
            <input
              type="text"
              placeholder="Create a new task..."
              className="border p-2 rounded-l w-full"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
            >
              {loading ? "..." : "Add"}
            </button>
          </form>

          {tasks.length === 0 ? (
            <p className="text-gray-600">No tasks found</p>
          ) : (
            <ul className="divide-y">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="flex justify-between items-center py-2"
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-gray-500">
                        Created by:{" "}
                        {task.createdBy
                          ? `${task.createdBy.name} (${task.createdBy.role})`
                          : task.user?.name || task.user?.email || "Unknown"}
                      </p>

                  </div>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
