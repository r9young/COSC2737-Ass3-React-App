import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [passwordMatch, setPasswordMatch] = useState(true);

  // ############################################################################

  console.log("process.env:", process.env);
  console.log("process.env.REACT_APP_NODE_ENV:", process.env.REACT_APP_NODE_ENV);
  console.log("process.env.REACT_APP_SERVER_BASE_URL:", process.env.REACT_APP_SERVER_BASE_URL);
  
  const base_url = process.env.REACT_APP_NODE_ENV === 'development' //see .env
    ? process.env.REACT_APP_LOCAL_BASE_URL
    : process.env.REACT_APP_SERVER_BASE_URL;

  // ############################################################################

  // Fetching Users with useEffect

  useEffect(() => {
    axios.get(`${base_url.replace(/\/$/, "")}/getUser`).then(res => {
      console.log(res.data);
    }).catch(err => alert(`Some error occurred ==> ${err}`));
  }, [base_url]);

  // ###########################################################################

  // handle input change

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

    // Check password match
    if (name === "password" || name === "confirmPassword") {
      setPasswordMatch(
        name === "password"
          ? value === formData.confirmPassword
          : value === formData.password
      );
    }
  };

  // ###########################################################################

  // Handling Form Submission

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    const { confirmPassword, ...dataToSubmit } = formData; // Exclude confirmPassword
    axios.post(`${base_url.replace(/\/$/, "")}/addUser`, dataToSubmit)
      .then(res => {
        setFormData({
          firstname: "",
          lastname: "",
          username: "",
          password: "",
          confirmPassword: ""
        });
        alert("User created successfully");
      })
      .catch(err => alert(`Some error occurred ==> ${err}`));
  };

  // ###########################################################################

  return (
    <div className="App">
      <div className='container'>
        <div className="row">
          <div className="col">
            <h2>New User Registration</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="exampleInputUser">First Name</label>
                <input type="text" name="firstname" className="form-control" id="exampleInputUser" value={formData.firstname} onChange={handleChange} placeholder="Enter your first name" />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputUser">Last Name</label>
                <input type="text" name="lastname" className="form-control" id="exampleInputUser" value={formData.lastname} onChange={handleChange} placeholder="Enter your last name" />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputUser">User Name</label>
                <input type="email" name="username" className="form-control" id="exampleInputUser" value={formData.username} onChange={handleChange} placeholder="Enter a username" />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail">Enter Your Password</label>
                <input type="password" name="password" className="form-control" id="exampleInputEmail" value={formData.password} onChange={handleChange} placeholder="Password" />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail">Re-enter Password</label>
                <input type="password" name="confirmPassword" className="form-control" id="exampleInputEmail" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" />
              </div>
              {!passwordMatch && <p style={{ color: 'red' }}>Passwords do not match!</p>}
              <button type="submit" className="btn btn-primary mt-2">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
