// src/components/UserTable.jsx
import React, { useState, useEffect } from "react";
import { getAllUsers, deleteUserById } from "../utils/indexedDB";
import AddUserForm from "./AddUserForm";
import EditUserForm from "./EditUserForm";

function UserTable() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("currentUser");
    if (loggedInUser) {
      setCurrentUser(loggedInUser);
    }

    const fetchData = async () => {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    window.location.href = "/";
  };

  const handleDelete = async (id) => {
    await deleteUserById(id);
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleEdit = (id) => {
    setEditUserId(id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <nav className="bg-white border-b border-gray-200 shadow w-full">
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold text-gray-800 p-4">
                User Management
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Add User
              </button>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <span className="mr-2 font-medium">{currentUser}</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                    <div className="px-4 py-2 text-sm text-gray-700">
                      <span>{currentUser}</span>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 p-6 max-w-screen-lg mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Password
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                    {user.password}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleEdit(user.id)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="ml-2 text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddForm && <AddUserForm onClose={() => setShowAddForm(false)} />}
      {editUserId && (
        <EditUserForm userId={editUserId} onClose={() => setEditUserId(null)} />
      )}
    </div>
  );
}

export default UserTable;
