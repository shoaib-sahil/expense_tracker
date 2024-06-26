import React, { useState, useEffect } from "react";
// import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Container } from "react-bootstrap";
import "./home.css";
import { addTransaction, getTransactions } from "../../utils/ApiRequest";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../components/Spinner";
import TableData from "./TableData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";
import Analytics from "./Analytics";

const UserHome = () => {
  const navigate = useNavigate();

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
  const [cUser, setcUser] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState("table");

  const handleStartChange = (date) => {
    setStartDate(date);
  };

  const handleEndChange = (date) => {
    setEndDate(date);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const avatarFunc = async () => {
      if (localStorage.getItem("user")) {
        const user = JSON.parse(localStorage.getItem("user"));
        // console.log(user);

        // if (user.isAvatarImageSet === false || user.avatarImage === "") {
        //   navigate("/setAvatar");
        // }

        setcUser(user);
        setRefresh(true);
      } else {
        navigate("/login");
      }
    };

    avatarFunc();
  }, [navigate]);

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
    city: "",
    image: null,
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    setValues({ ...values, image: e.target.files[0] });
  };

  const handleChangeFrequency = (e) => {
    setFrequency(e.target.value);
  };

  const handleSetType = (e) => {
    setType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      title,
      amount,
      description,
      category,
      date,
      city,
      transactionType,
      image,
    } = values;

    if (
      !title ||
      !amount ||
      !description ||
      !category ||
      !date ||
      !transactionType ||
      !city ||
      !image
    ) {
      return toast.error("Please enter all the fields", toastOptions);
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("amount", amount);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("date", date);
    formData.append("transactionType", transactionType);
    formData.append("city", city);
    formData.append("image", image);

    const token = JSON.parse(localStorage.getItem("token"));

    const { data } = await axios.post(addTransaction, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log(data);

    if (data.success === true) {
      setValues({
        title: "",
        amount: "",
        description: "",
        category: "",
        date: "",
        transactionType: "",
        city: "",
        image: null,
      });
      toast.success(data.message, toastOptions);
      handleClose();
      setRefresh(!refresh);
    } else {
      toast.error(data.message, toastOptions);
    }

    setLoading(false);
  };

  const handleReset = () => {
    setType("all");
    setStartDate(null);
    setEndDate(null);
    setFrequency("7");
  };

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        setLoading(true);
        // console.log(cUser._id, frequency, startDate, endDate, type);
        const token = JSON.parse(localStorage.getItem("token"));

        const { data } = await axios.post(
          getTransactions,
          {
            userId: cUser._id,
            frequency: frequency,
            startDate: startDate,
            endDate: endDate,
            type: type,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // console.log(data);

        if (["User not found", "Invalid Token"].includes(data.message)) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.reload();
        }

        setTransactions(data.transactions);

        setLoading(false);
      } catch (err) {
        // toast.error("Error please Try again...", toastOptions);
        setLoading(false);
      }
    };

    fetchAllTransactions();
  }, [refresh, frequency, endDate, type, startDate]);

  const handleTableClick = (e) => {
    setView("table");
  };

  const handleChartClick = (e) => {
    setView("chart");
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Container
          style={{
            position: "relative",
            zIndex: "2 !important",
            paddingBottom: "50px",
          }}
          className="mt-3"
        >
          <h1 className="text-white text-center">Welcome {cUser?.name}</h1>
          <div className="filterRow">
            <div className="text-white">
              <Form.Group className="mb-3" controlId="formSelectFrequency">
                <Form.Label>Select Frequency</Form.Label>
                <Form.Select
                  name="frequency"
                  value={frequency}
                  onChange={handleChangeFrequency}
                >
                  <option value="7">Last Week</option>
                  <option value="30">Last Month</option>
                  <option value="365">Last Year</option>
                  <option value="custom">Custom</option>
                </Form.Select>
              </Form.Group>
            </div>

            {/* <div className="text-white type">
                <Form.Group className="mb-3" controlId="formSelectFrequency">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={type}
                    onChange={handleSetType}
                  >
                    <option value="all">All</option>
                    <option value="expense">Expense</option>
                    <option value="credit">Earned</option>
                  </Form.Select>
                </Form.Group>
              </div> */}

            <div
              className="text-white iconBtnBox"
              style={{ marginLeft: "20px" }}
            >
              <FormatListBulletedIcon
                sx={{ cursor: "pointer" }}
                onClick={handleTableClick}
                className={`${
                  view === "table" ? "iconActive" : "iconDeactive"
                }`}
              />
              <BarChartIcon
                sx={{ cursor: "pointer" }}
                onClick={handleChartClick}
                className={`${
                  view === "chart" ? "iconActive" : "iconDeactive"
                }`}
              />
            </div>

            <div>
              <Button
                onClick={handleShow}
                className="addNew"
                style={{ marginLeft: "20px", marginTop: "10px" }}
              >
                Add New
              </Button>
              <Button
                onClick={handleShow}
                className="mobileBtn"
                style={{ marginLeft: "20px", marginTop: "10px" }}
              >
                +
              </Button>
              <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Add Transaction Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group className="mb-3" controlId="formName">
                      <Form.Label>Expense</Form.Label>
                      <Form.Control
                        name="title"
                        type="text"
                        placeholder="Enter Expense Name"
                        value={values.name}
                        onChange={handleChange}
                        list="expense"
                      />
                      <datalist id="expense">
                        <option>Petrol</option>
                        <option>Food</option>
                        <option>Hotel/Accom.</option>
                        <option>Rent A Car</option>
                      </datalist>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formAmount">
                      <Form.Label>Amount(SRA)</Form.Label>
                      <Form.Control
                        name="amount"
                        type="number"
                        placeholder="Enter your Amount"
                        value={values.amount}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formSelect">
                      <Form.Label>Client</Form.Label>
                      <Form.Control
                        name="category"
                        value={values.category}
                        onChange={handleChange}
                        placeholder="Enter Company Name"
                        list="client"
                      />
                      <datalist id="client">
                        <option>Ericsson</option>
                        <option>Tawal</option>
                        <option>STC</option>
                        <option>Mobily</option>
                      </datalist>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formDescription">
                      <Form.Label>Project</Form.Label>
                      <Form.Control
                        type="text"
                        name="description"
                        placeholder="Enter Project Name"
                        value={values.description}
                        onChange={handleChange}
                        list="project"
                      />
                      <datalist id="project">
                        <option>NeXT 2024</option>
                        <option>Next 2023</option>
                        <option>Relocation</option>
                      </datalist>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formSelect1">
                      <Form.Label>Site-Id</Form.Label>
                      <Form.Control
                        name="transactionType"
                        placeholder="Enter Site-Id"
                        value={values.transactionType}
                        onChange={handleChange}
                        list="siteId"
                      />
                      <datalist id="siteId">
                        <option>ZRW981</option>
                        <option>ZND783</option>
                        <option>ZN778</option>
                        <option>1045667</option>
                      </datalist>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formSelect1">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        name="city"
                        placeholder="Enter city"
                        value={values.city}
                        onChange={handleChange}
                        list="city"
                      />
                      <datalist id="city">
                        <option>Riyadh</option>
                        <option>Jeddah</option>
                        <option>Dammam</option>
                        <option>Jubail</option>
                        <option>Al Khobar</option>
                      </datalist>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formSelect1">
                      <Form.Label>Upload image</Form.Label>
                      <Form.Control
                        name="ImageUrl"
                        type="file"
                        onChange={handleImageUpload}
                      ></Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formDate">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={values.date}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    {/* Add more form inputs as needed */}
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleSubmit}>
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
          
          <br />

          {frequency === "custom" ? (
            <div className="date">
              <div className="form-group">
                <div>
                  <DatePicker
                    selected={startDate}
                    onChange={handleStartChange}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start Date"
                  />
                </div>
              </div>
              <div className="form-group">
                <div>
                  <DatePicker
                    selected={endDate}
                    onChange={handleEndChange}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="End Date"
                  />
                </div>
              </div>
              <Button variant="primary" onClick={handleReset}>
                Reset Filter
              </Button>
            </div>
          ) : null}
          {view === "table" ? (
            <TableData data={transactions} user={cUser} />
          ) : (
            <Analytics transactions={transactions} user={cUser} />
          )}
        </Container>
      )}
    </>
  );
};

export default UserHome;
