import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadUser, fetchUsers, deleteUser } from '../features/user/userSlice'; // Update paths accordingly

const UserForm = () => {
  const [file, setFile] = useState(null);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleUpload = () => {
    if (file && userData.name && userData.email) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      dispatch(uploadUser(formData));
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="md:shrink-0">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700  hover:file:bg-blue-100"
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={userData.name}
            onChange={handleInputChange}
            className="mt-2 block w-full px-3 py-2 border  border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleInputChange}
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-2 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Upload
          </button>
          {loading && <p className="mt-2 text-center text-blue-600">Loading...</p>}
          {error && <p className="mt-2 text-center text-red-600">Error: {error}</p>}
        </div>
      </div>
      <div className="mt-6">
        {users.length > 0 && users.map((user) => (
          <div key={user._id} className="flex items-center mt-4">
            <img
              src={`http://localhost:3000/images/${user.image}`}
              alt={user.name}
              className="h-12 w-12 rounded-full object-cover mr-4"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            {/* <button
              onClick={() => handleDelete(user._id)}
              className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              update
            </button> */}

            <button
              onClick={() => handleDelete(user._id)}
              className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserForm;
