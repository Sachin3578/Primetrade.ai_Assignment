import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);

  // ✅ Fetch tasks
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  // ✅ Create or Update Task
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editId) {
        // Update
        await API.put(
          `/tasks/${editId}`,
          { title, description },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Create
        await API.post(
          "/tasks",
          { title, description },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setTitle("");
      setDescription("");
      setEditId(null);
      fetchTasks();
    } catch (error) {
      console.error("Failed to create/update task:", error);
    }
  };

  // ✏️ Edit task handler
  const handleEdit = (task) => {
    setEditId(task._id);
    setTitle(task.title);
    setDescription(task.description);
  };

  // ❌ Delete task
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await API.delete(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Dashboard</h1>
        {user && (
          <p className="text-center mb-4">
            Logged in as <span className="font-semibold">{user.email}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border p-2 rounded w-full mb-2"
          />
          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          ></textarea>

          <button
            type="submit"
            className={`w-full py-2 rounded text-white transition ${
              editId ? "bg-yellow-600 hover:bg-yellow-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editId ? "Update Task" : "Create Task"}
          </button>
        </form>

        <ul className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500">No tasks found</p>
          ) : (
            tasks.map((task) => (
              <li
                key={task._id}
                className="border p-3 rounded flex justify-between items-start"
              >
                <div>
                  <h3 className="font-bold">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
