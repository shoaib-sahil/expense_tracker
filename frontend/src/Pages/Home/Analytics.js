import React from "react";
import { Container, Row } from "react-bootstrap";
import CircularProgressBar from "../../components/CircularProgressBar";
import LineProgressBar from "../../components/LineProgressBar";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const Analytics = ({ transactions }) => {
  const TotalTransactions = transactions.length;
  const totalTurnOver = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

  const categories = [
    "Groceries",
    "Rent",
    "Salary",
    "Tip",
    "Food",
    "Medical",
    "Utilities",
    "Entertainment",
    "Transportation",
    "Other",
  ];

  const colors = {
    "Groceries": '#FF6384',
    "Rent": '#36A2EB',
    "Salary": '#FFCE56',
    "Tip": '#4BC0C0',
    "Food": '#9966FF',
    "Medical": '#FF9F40',
    "Utilities": '#8AC926',
    "Entertainment": '#6A4C93',
    "Transportation": '#1982C4',
    "Other": '#F45B69',
  };

  return (
    <>
      <Container className="mt-5 ">
        <Row>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header bg-black text-white">
                <span style={{ fontWeight: "bold" }}>Total Transactions:</span>{" "}
                {TotalTransactions}
              </div>
              <div className="card-body">
                <h5 className="card-title">All Transactions:</h5>
                <ul>
                  {transactions.map((transaction, index) => (
                    <li key={index}>
                      {transaction.amount} ({transaction.category})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header bg-black text-white ">
                <span style={{ fontWeight: "bold" }}>Total TurnOver:</span>{" "}
                {totalTurnOver}
              </div>
              <div className="card-body">
                <h5 className="card-title">TurnOver:</h5>
                <CircularProgressBar percentage={(totalTurnOver / totalTurnOver) * 100} color="green" />
              </div>
            </div>
          </div>

          {/* <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header  bg-black text-white">
                <span style={{ fontWeight: "bold" }}>Categorywise Analytics</span>{" "}
              </div>
              <div className="card-body">
                {categories.map((category) => {
                  const categoryAmount = transactions
                    .filter((transaction) => transaction.category === category)
                    .reduce((acc, transaction) => acc + transaction.amount, 0);

                  const categoryPercent = (categoryAmount / totalTurnOver) * 100;

                  return (
                    <LineProgressBar
                      key={category}
                      label={category}
                      percentage={categoryPercent.toFixed(0)}
                      lineColor={colors[category]}
                    />
                  );
                })}
              </div>
            </div>
          </div> */}
        </Row>
      </Container>
    </>
  );
};

export default Analytics;