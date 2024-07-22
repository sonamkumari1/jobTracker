import jobsModel from "../models/jobsModel.js";
import mongoose from "mongoose";

export const createJobController = async (req, res, next) => {
  const { company, position, workType, workLocation } = req.body;

  if (!company || !position || !workType || !workLocation) {
    return res.status(400).json({ message: "Please provide all fields!" });
  }

  req.body.createdBy = req.user._id;

  try {
    const job = await jobsModel.create(req.body);
    res.status(201).json({
      success: true,
      message: "Job added successfully!",
      job,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Error creating job", error: error.message });
  }
};

export const getJobsController = async (req, res) => {
  const { status, workType, search, sort } = req.query;
  const queryObject = { createdBy: req.user._id };

  if (status && status !== "all") {
    queryObject.status = status;
  }

  if (workType && workType !== "all") {
    queryObject.workType = workType;
  }

  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  let queryResult = jobsModel.find(queryObject);

  if (sort === "latest") {
    queryResult = queryResult.sort("-createdAt");
  }

  if (sort === "oldest") {
    queryResult = queryResult.sort("createdAt");
  }

  if (sort === "a-z") {
    queryResult = queryResult.sort("position");
  }

  if (sort === "z-a") {
    queryResult = queryResult.sort("-position");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  queryResult = queryResult.skip(skip).limit(limit);

  const totalJobs = await jobsModel.countDocuments(queryObject);
  const numOfPage = Math.ceil(totalJobs / limit);

  const jobs = await queryResult;

  res.status(200).json({
    success: true,
    totalJobs,
    jobs,
    numOfPage,
  });
};

// controllers/jobsController.js
export const updateJobsController = async (req, res, next) => {
  const { id } = req.params;
  const { company, position, workType, workLocation, status } = req.body;

  // Check if all required fields are present
  if (!company || !position || !workType || !workLocation || !status) {
    return next("Please provide all required fields");
  }

  const job = await jobsModel.findOne({ _id: id });

  if (!job) {
    return next(`No job found with this id ${id}`);
  }

  if (req.user._id.toString() !== job.createdBy.toString()) {
    return next("You are not authorized to update this job!");
  }

  const updatedJob = await jobsModel.findOneAndUpdate(
    { _id: id },
    { company, position, workType, workLocation, status },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Job updated successfully!",
    job: updatedJob,
  });
};


export const deleteJobController = async (req, res, next) => {
  const { id } = req.params;

  const job = await jobsModel.findOne({ _id: id });

  if (!job) {
    return next(`No job found with this id ${id}!`);
  }

  if (req.user._id.toString() !== job.createdBy.toString()) {
    return next("You are not authorized to delete this job!");
  }

  await jobsModel.findByIdAndDelete({ _id: id });

  res.status(200).json({
    success: true,
    message: "Job deleted successfully!",
  });
};

export const jobsStatsController = async (req, res) => {
  const stats = await jobsModel.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user._id) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const monthlyApplications = await jobsModel.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user._id) } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    success: true,
    stats,
    monthlyApplications,
  });
};
