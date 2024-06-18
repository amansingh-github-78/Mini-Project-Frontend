"use client";

import { Button, DarkThemeToggle, Navbar, Checkbox, Label, Modal, TextInput, Dropdown, Avatar } from "flowbite-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

export default function Navbarf() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignupModal, setOpenSignupModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (token) {
      // Fetch user profile if token exists
      fetchUserProfile(token);
    }
  }, [token]);

  function onCloseModal() {
    setOpenLoginModal(false);
    setOpenSignupModal(false);
    setUser({ email: "", password: "" });
    setUserData({ username: "", email: "", password: "", confirmPassword: "" });
  }

  const handleLoginClick = () => {
    setOpenSignupModal(false);
    setOpenLoginModal(true);
  };

  const handleSignupClick = () => {
    setOpenLoginModal(false);
    setOpenSignupModal(true);
  };


  const [user, setUser] = useState({ email: "", password: "" });
  const [userProfile, setuserProfile] = useState({}); // State to hold user data
  
  const handleOnSubmitSignin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/user/login`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ email: user.email, password: user.password })
      });

      const loginJson = await response.json();
      if (loginJson.success) {
        setIsLoggedIn(true);
        setOpenLoginModal(false);
        setToken(loginJson.token); // Save token in localStorage

        fetchUserProfile(loginJson.token);

        alert('Signed in successfully');
      } else {
        alert('INVALID LOGIN CREDENTIALS ...PLEASE TRY AGAIN!!!');
      }

      setUser({ email: "", password: "" }); // Reset the form fields
    } catch (error) {
      console.error('Error signing in:', error);
      alert('An error occurred while signing in. Please try again later.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null); // Clear token from localStorage
    setuserProfile({});
    alert('Logged out successfully');
  };

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/getuser`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const userProfileJson = await response.json();
      setuserProfile(userProfileJson);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  
  // Now you can use userData in your UI to display username and email
  
  const [userData, setUserData] = useState({ username: "", email: "", password: "", confirmPassword: "" });

  const handleOnSubmitSignup = async (e) => {
    e.preventDefault();

    // Check if password and confirm password match
    if (userData.password !== userData.confirmPassword) {
      alert("Password and confirm password do not match");
      return;
    }

    const response = await fetch(`http://localhost:5000/api/user/createuser`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password
      })
    });

    const json = await response.json();
    if (json.success) {
      alert('Account created successfully');
      setOpenSignupModal(false);
    } else {
      alert('Signup failed. Please try again.');
    }

    setUserData({ username: "", email: "", password: "", confirmPassword: "" });
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
    setUserData(prevUserData => ({
      ...prevUserData,
      [name]: value
    }));
  };

  return (
    <>
      <Navbar fluid>
        <Navbar.Brand href="/">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">SITE FOR LOCAL</span>
        </Navbar.Brand>
        <Navbar.Collapse>
          <Navbar.Link as={Link} to="/">Home</Navbar.Link>
          <Navbar.Link as={Link} to="/About">About</Navbar.Link>
          <Navbar.Link as={Link} to="/Services">Services</Navbar.Link>
          <Navbar.Link as={Link} to="/Contact">Contact</Navbar.Link>
        </Navbar.Collapse>
        <div className="order-2 items-center flex flex-shrink">
          {isLoggedIn ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">{userProfile.username}</span>
                <span className="block truncate text-sm font-medium">{userProfile.email}</span>
              </Dropdown.Header>
              <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <>
              <Button onClick={handleLoginClick}>Login</Button>
              <Button onClick={handleSignupClick} className="bg-red-600">Sign up</Button>
            </>
          )}
          <DarkThemeToggle />
        </div>
        <Navbar.Toggle />
      </Navbar>

      {/* Login Modal */}
      <Modal show={openLoginModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={handleOnSubmitSignin}>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email" value="Your Email" />
                </div>
                <TextInput
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={onChange}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password" value="Your password" />
                </div>
                <TextInput id="password" name="password" value={user.password} onChange={onChange} type="password" required />
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember">Remember me</Label>
                </div>
                <Link to="#" className="text-sm text-cyan-700 hover:underline dark:text-cyan-500">
                  Lost Password?
                </Link>
              </div>
              <div className="w-full">
                <Button type="submit">Log in to your account</Button>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
                Not registered?&nbsp;
                <Link to="#" onClick={handleSignupClick} className="text-cyan-700 hover:underline dark:text-cyan-500">
                  Create account
                </Link>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Signup Modal */}
      <Modal show={openSignupModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={handleOnSubmitSignup}>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Create an account</h3>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="signup-email" value="Your email" />
                </div>
                <TextInput
                  id="signup-email"
                  name="email"
                  placeholder="name@company.com"
                  value={userData.email}
                  onChange={onChange}
                  required
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="username" value="Username" />
                  </div>
                  <TextInput
                    id="username"
                    name="username"
                    value={userData.username}
                    onChange={onChange}
                    placeholder="Username"
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="signup-password" value="Your password" />
                  </div>
                  <TextInput
                    id="signup-password"
                    name="password"
                    value={userData.password}
                    onChange={onChange}
                    type="password"
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="repeat-password" value="Repeat password" />
                  </div>
                  <TextInput
                    id="repeat-password"
                    name="confirmPassword"
                    value={userData.confirmPassword}
                    onChange={onChange}
                    type="password"
                    required
                  />
                </div>
                <div className="w-full">
                  <Button type="submit">Create my account</Button>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
                  Already have an account?&nbsp;
                  <Link to="#" onClick={handleLoginClick} className="text-cyan-700 hover:underline dark:text-cyan-500">
                    Sign in
                  </Link>
                </div>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
  



