// SignupPage.js
import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Form2 from "react-bootstrap/Form";
import "./auth.css";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerAPI } from "../../utils/ApiRequest";
import axios from "axios";
import { Eye, EyeSlashFill } from "react-bootstrap-icons";
import InputGroup from "react-bootstrap/InputGroup";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const particlesInit = useCallback(async (engine) => {
    // console.log(engine);
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // await console.log(container);
  }, []);

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    UserType: "user",
    secret_key: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if (values.UserType === "admin" && values.secret_key !== "Sahil") {
      e.preventDefault();
      toast.error("Invalid Secret Key", toastOptions);
    } else {
      e.preventDefault();
      const { name, email, password, UserType } = values;

      setLoading(true);

      const { data } = await axios.post(registerAPI, {
        name,
        email,
        password,
        UserType,
      });

      if (data.success === true) {
        // localStorage.setItem("user", JSON.stringify(data.user));
        // localStorage.setItem("token", JSON.stringify(data.token));
        toast.success(data.message, { ...toastOptions, autoClose: 10000 });
        navigate("/login");
      } else {
        toast.error(data.message, toastOptions);
        setLoading(false);
      }
    }

    return;
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <>
      <div style={{ position: "relative", overflow: "hidden" }}>
        {/* <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={{
            background: {
              color: {
                value: "#000",
              },
            },
            fpsLimit: 60,
            particles: {
              number: {
                // value: 200,
                value: 0,
                density: {
                  enable: true,
                  value_area: 800,
                },
              },
              color: {
                value: "#ffcc00",
              },
              shape: {
                type: "circle",
              },
              opacity: {
                value: 0.5,
                random: true,
              },
              size: {
                value: 3,
                random: { enable: true, minimumValue: 1 },
              },
              links: {
                enable: false,
              },
              move: {
                enable: true,
                speed: 2,
              },
              life: {
                duration: {
                  sync: false,
                  value: 3,
                },
                count: 0,
                delay: {
                  random: {
                    enable: true,
                    minimumValue: 0.5,
                  },
                  value: 1,
                },
              },
            },
            detectRetina: true,
          }}
          style={{
            position: "absolute",
            zIndex: -1,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        /> */}
        <div id="bgimg">
          <img src="/bg.png" />
        </div>

        <Container
          className="mt-5"
          style={{
            position: "relative",
            zIndex: "2 !important",
            color: "white !important",
          }}
        >
          <Row>
            <h1 className="text-center">
              <img
                src="/logo_for_dark_background.png"
                style={{ height: 60, color: "white", marginBottom: 15 }}
              />
            </h1>
            {/* <h1 className="text-center text-white">
              Welcome to Expense Management System
            </h1> */}
            <Col md={{ span: 6, offset: 3 }}>
              <h2
                className="text-white text-center"
                style={{ marginBottom: "20px" }}
              >
                Registration
              </h2>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <div className="text-white ">
                    Register As
                    <input
                      type="radio"
                      name="UserType"
                      value="user"
                      id="radioUser"
                      onChange={handleChange}
                      required
                      checked={values.UserType === "user"}
                      style={{
                        userSelect: "none",
                        cursor: "pointer",
                        marginLeft: "8px",
                      }}
                    />
                    <label
                      htmlFor="radioUser"
                      style={{
                        userSelect: "none",
                        cursor: "pointer",
                        padding: "0 8px",
                      }}
                    >
                      User
                    </label>
                    <input
                      type="radio"
                      name="UserType"
                      value="admin"
                      id="radioAdmin"
                      onChange={handleChange}
                      required
                      checked={values.UserType === "admin"}
                      style={{ userSelect: "none", cursor: "pointer" }}
                    />
                    <label
                      htmlFor="radioAdmin"
                      style={{
                        userSelect: "none",
                        cursor: "pointer",
                        padding: "0 8px",
                      }}
                    >
                      Admin
                    </label>
                  </div>
                </Form.Group>

                {values.UserType === "admin" && (
                  <Form.Group controlId="formBasicName" className="mt-3">
                    <Form.Label className="text-white">Secret Key</Form.Label>
                    <Form.Control
                      type="text"
                      name="secret_key"
                      placeholder="Secret Key"
                      value={values.secret_key}
                      onChange={handleChange}
                    />
                  </Form.Group>
                )}

                <Form.Group controlId="formBasicName" className="mt-3">
                  <Form.Label className="text-white">Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={values.name}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className="mt-3">
                  <Form.Label className="text-white">Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={values.email}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mt-3">
                  <Form.Label className="text-white">Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={isPasswordVisible ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={values.password}
                      onChange={handleChange}
                    />
                    <InputGroup.Text
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      style={{ userSelect: "none", cursor: "pointer" }}
                    >
                      {isPasswordVisible ? <EyeSlashFill /> : <Eye />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                  className="mt-4"
                >
                  <Link to="/forgotPassword" className="text-white lnk">
                    Forgot Password?
                  </Link>

                  <Button
                    type="submit"
                    className=" text-center mt-3 btnStyle"
                    onClick={!loading ? handleSubmit : null}
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Signup"}
                  </Button>

                  <p className="mt-3" style={{ color: "white" }}>
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="lnk"
                      style={{ color: "#0d6efd" }}
                    >
                      Login
                    </Link>
                  </p>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Register;
