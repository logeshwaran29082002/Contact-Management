import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setfiltersUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "", age: "", city: "" });
  const API = import.meta.env.VITE_API_URL;

  const getAllUsers = async () => {
    try {
       const res = await axios.get(`${API}/users`);
      setUsers(res.data);
      setfiltersUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Search function
  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText) ||
        user.city.toLowerCase().includes(searchText)
    );
    setfiltersUsers(filteredUsers);
  };

  // Delete user function
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (isConfirmed) {
     await axios.delete(`${API}/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      setfiltersUsers(filteredUsers.filter((user) => user.id !== id));
    }
  };

  // Add User function
  const handleAddRecord = () => {
    setUserData({ name: "", age: "", city: "" });
    setIsModalOpen(true);
    getAllUsers();
  };
  const handleData =(e) =>{
    setUserData({...userData,[e.target.name]: e.target.value})
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(userData.id){
      await axios.patch(`${API}/users/${userData.id}`, userData)

      .then((res) =>{
        console.log(res);
      });
    }else{
    await axios.post(`${API}/users`, userData)

    .then((res) =>{
      console.log(res);
    });
  };

  };
  //update user function

  const handleUpdateRecord = (user) => {
    setUserData(user); // Set selected user data in the state
    setIsModalOpen(true); // Open the modal for editing
  };
  
  return (
    <>
      <div className="container">
        <h3>Contact Management For Frontend And Backend using React.js</h3>
        <div className="input-search">
          <input type="search" placeholder="Search Text" onChange={handleSearchChange} />
          <button className="btn green" onClick={handleAddRecord}>
            Add Record
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers &&
              filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.age}</td>
                  <td>{user.city}</td>
                  <td>
                  <button className="btn green" onClick={() => handleUpdateRecord(user)}>Edit</button>

                  </td>
                  <td>
                    <button onClick={() => handleDelete(user.id)} className="btn red">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Modal for Adding User */}
        {isModalOpen && (
  <div className="modal" onClick={() => setIsModalOpen(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2>{userData.id ? "Update User" :"Add User"}</h2>
      <div className="input-group">
        <label htmlFor="name">Full Name</label>
        <input type="text" value={userData.name} name="name" id="name" onChange={handleData}/>
      </div>
      <div className="input-group">
        <label htmlFor="age">Age</label>
        <input type="number" value={userData.age} name="age" id="age" onChange={handleData} />
      </div>
      <div className="input-group">
        <label htmlFor="city">City</label>
        <input type="text" value={userData.city} name="city" id="city" onChange={handleData} />
      </div>
      <button className="btn green" onClick={handleSubmit}>{userData.id ? "Update User" :"Add User"}</button>
      <button className="close-btn" onClick={() => setIsModalOpen(false)}>Close</button>
    </div>
  </div>
)}

      </div>
    </>
  );
}

export default App;
