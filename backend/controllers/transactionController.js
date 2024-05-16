import fs from "fs";
import Transaction from "../models/TransactionModel.js";
import User from "../models/UserSchema.js";
import moment from "moment";

export const addTransactionController = async (req, res) => {
  try {
    const {
      title,
      amount,
      description,
      date,
      category,
      city,
      transactionType,
    } = req.body;

    const userId = req.user.id;
    const image = Date.now() + "_" + req.file.originalname;

    fs.rename(req.file.path, "public/" + image, (error) => {
      if (error) throw error;
    });

    if (
      !title ||
      !amount ||
      !description ||
      !date ||
      !category ||
      !userId ||
      !transactionType ||
      !city ||
      !image
    ) {
      return res.status(408).json({
        success: false,
        messages: "Please Fill all fields",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // let newTransaction =
    await Transaction.create({
      title: title,
      amount: amount,
      category: category,
      description: description,
      date: date,
      user: userId,
      transactionType: transactionType,
      city: city,
      image: image,
    });

    // user.transactions.push(newTransaction);

    // user.save();

    return res.status(200).json({
      success: true,
      message: "Transaction Added Successfully",
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};

export const getAllTransactionController = async (req, res) => {
  try {
    const { userId, type, frequency, startDate, endDate } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.UserType !== "admin" && userId !== req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Your dont have permission to access data of other users",
      });
    }

    // Create a query object with the user and type conditions
    const query =
      req.user.UserType === "admin" && !userId ? {} : { user: userId };

    if (type !== "all") {
      query.transactionType = type;
    }

    // Add date conditions based on 'frequency' and 'custom' range
    if (frequency !== "custom") {
      query.date = {
        $gt: moment().subtract(Number(frequency), "days").toDate(),
      };
    } else if (startDate && endDate) {
      query.date = {
        $gte: moment(startDate).toDate(),
        $lte: moment(endDate).toDate(),
      };
    }

    const transactions = await Transaction.find(query).populate(
      "user",
      "-password"
    );

    // console.log(transactions);

    return res.status(200).json({
      success: true,
      transactions: transactions,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};

export const deleteTransactionController = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const userId = req.body.userId;

    // console.log(transactionId, userId);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const transactionElement = await Transaction.findById(transactionId);

    if (!transactionElement) {
      return res.status(400).json({
        success: false,
        message: "transaction not found",
      });
    }

    if (transactionElement.user.toString() !== req.user.id && req.user.UserType !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Your dont have permission to delete data of other users",
      });
    }

    transactionElement.deleteOne();

    // const transactionArr = user.transactions.filter(
    //   (transaction) => transaction._id === transactionId
    // );

    // user.transactions = transactionArr;

    // user.save();

    return res.status(200).json({
      success: true,
      message: "Transaction successfully deleted",
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};

export const updateTransactionController = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const userId = req.body.userId;

    // console.log(transactionId, userId);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const transactionElement = await Transaction.findById(transactionId);

    if (!transactionElement) {
      return res.status(400).json({
        success: false,
        message: "transaction not found",
      });
    }

    if (transactionElement.user.toString() !== req.user.id && req.user.UserType !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Your dont have permission to update data of other users",
      });
    }

    const {
      title,
      amount,
      description,
      date,
      category,
      transactionType,
      city,
    } = req.body;

    console.log(title, amount, description, date, category, transactionType);

    if (title) {
      transactionElement.title = title;
    }

    if (description) {
      transactionElement.description = description;
    }

    if (amount) {
      transactionElement.amount = amount;
    }

    if (category) {
      transactionElement.category = category;
    }
    if (transactionType) {
      transactionElement.transactionType = transactionType;
    }
    if (city) {
      transactionElement.city = city;
    }

    if (date) {
      transactionElement.date = date;
    }

    await transactionElement.save();

    // await transactionElement.remove();

    return res.status(200).json({
      success: true,
      message: `Transaction Updated Successfully`,
      transaction: transactionElement,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};
