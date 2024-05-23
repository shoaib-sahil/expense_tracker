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
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const AdminHome = () => {
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
    ImageUrl: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    setValues({ ...values, ImageUrl: e.target.files[0] });
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
    } = values;

    if (
      !title ||
      !amount ||
      !description ||
      !category ||
      !date ||
      !transactionType ||
      !city
    ) {
      toast.error("Please enter all the fields", toastOptions);
    }
    setLoading(true);
    setLoading(true);

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("amount", amount);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("date", date);
    formData.append("transactionType", transactionType);
    formData.append("city", city);
    if (values.ImageUrl) {
      formData.append("ImageUrl", values.ImageUrl);
    }
    const formDataJson = {
      title,
      amount,
      description,
      category,
      date,
      transactionType,
      city,
    };
    if (values.ImageUrl) {
      formDataJson.ImageUrl = values.ImageUrl.name;
    }

    const token = JSON.parse(localStorage.getItem("token"));
    console.log(token);
    const { data } = await axios.post(addTransaction, formDataJson, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      timeout: 3000,

      // title: title,
      // amount: amount,
      // description: description,
      // category: category,
      // date: date,
      // transactionType: transactionType,
      // city: city,
      // userId: cUser._id,
      // ImageUrl : ImageUrl
    });
    // console.log(data);

    if (data.success === true) {
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

  const downloadTransactions = (isPDF) => {
    const captureTarget = document
      .querySelector("#transactionsTable")
      .outerHTML.replaceAll("text-white", "text-black");

    const capture = document.createElement("div");
    capture.style.minWidth = "1000px";
    capture.style.maxWidth = "1000px";
    capture.innerHTML = captureTarget;

    document.body.appendChild(capture);

    [
      capture.querySelector("thead > tr"),
      ...capture.querySelectorAll("tbody > tr"),
    ].map((e) => e.removeChild(e.lastChild));

    html2canvas(capture, { useCORS: true, allowTaint: true, scale: 2 }).then(
      (canvas) => {
        if (isPDF) {
          const pdf = new jsPDF("p", "px", [
            capture.clientHeight < 1100 ? 1100 : capture.clientHeight,
            1100,
          ]);
          pdf.addImage(canvas.toDataURL({ format: "png" }), "PNG", 0, 0);
          pdf.save("transactions.pdf");
        }
        //
        else {
          let a = document.createElement("a");
          a.href = canvas.toDataURL({ format: "png" });
          a.download = "transactions.png";
          a.click();
        }
      }
    );

    document.body.removeChild(capture);
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Container
          style={{ position: "relative", zIndex: "2 !important" }}
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

            {transactions?.length > 0 && view === "table" && (
              <>
                <Button
                  style={{ marginLeft: "20px", marginTop: "10px" }}
                  variant="primary"
                  onClick={() => downloadTransactions(false)}
                >
                  Save Transactions as Image
                </Button>
                <Button
                  style={{ marginLeft: "20px", marginTop: "10px" }}
                  variant="primary"
                  onClick={() => downloadTransactions(true)}
                >
                  Save Transactions as PDF
                </Button>
              </>
            )}

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
          </div>

          <br/>

          {frequency === "custom" ? (
            <>
              <div className="date ">
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
            </>
          ) : (
            <></>
          )}

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

export default AdminHome;
