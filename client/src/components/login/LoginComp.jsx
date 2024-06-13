import { useState } from "react";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import "./login.css";
import { apiService } from "../../service/api.service";

const LoginComp = ({ setUser, setAuth, setUsername, setUserId }) => {
  const [loginState, setLoginState] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChangeRegister = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    // Add form validation and submission logic here
    console.log("Form submitted:", formData);
    if (formData.password !== formData.confirmPassword) {
      alert("Password and Confirm Password must be the same");
      return setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
    try {
      const response = await apiService.register(formData);
      console.log(response);
      const { data } = response;
      const { name, email, id, token } = data.info;
      setAuth(true);
      setUser(token);
      setUsername(name);
      setUserId(id);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("uId", id);
      localStorage.setItem("token", token);
      alert("Registration successful");
    } catch (error) {
      console.log(error);
      alert("Registration Failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // Add form validation and submission logic here
    console.log("Form submitted:", loginData);
    try {
      const response = await apiService.login(loginData);
      console.log(response);
      const { data } = response;
      const { name, email, id, token } = data.info;
      setAuth(true);
      setUser(token);
      setUsername(name);
      setUserId(id);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("uId", id);
      localStorage.setItem("token", token);
      alert("Login successful");
    } catch (error) {
      console.log(error);
      alert("Login Failed");
    }
  };
  return (
    <Container className="mt-5 ">
      {loginState ? (
        // login
        <Row className="justify-content-md-center px-4">
          <Col md={6} className="bg-white p-5 rounded-5 ">
            <h2 className="text-center">Login</h2>
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="formEmail" className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleChangeLogin}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPassword" className="mb-2">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChangeLogin}
                  required
                />
              </Form.Group>
              <div className="text-center mt-4">
                <Button variant="primary" type="submit">
                  Login
                </Button>
              </div>
            </Form>
            <p className="text-center mt-4">
              Want to create account?{" "}
              <strong
                className="text-primary"
                onClick={() => setLoginState(false)}
              >
                Register
              </strong>
            </p>
          </Col>
        </Row>
      ) : (
        // Register
        <Row className="justify-content-md-center px-4">
          <Col xs={12} md={6} className="bg-white p-5 rounded-5 ">
            <h2 className="text-center">Signup</h2>
            <Form onSubmit={handleRegister}>
              <Form.Group controlId="formFullName" className="mb-2">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChangeRegister}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEmail" className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChangeRegister}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPassword" className="mb-2">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChangeRegister}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formConfirmPassword" className="mb-2">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChangeRegister}
                  required
                />
              </Form.Group>
              <div className="text-center mt-4">
                <Button variant="primary" type="submit">
                  Register
                </Button>
              </div>
            </Form>
            <p className="text-center mt-4">
              Already have an account?{" "}
              <strong
                className="text-primary "
                onClick={() => setLoginState(true)}
              >
                Login
              </strong>
            </p>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default LoginComp;
