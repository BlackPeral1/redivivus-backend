import { error } from "winston";
import asyncHandler from "../middleware/async";
import Company from "../models/company.model";
import {
  createCompany,
  retrieveAllCompany,
  getCompanyDetails,
  retrieveAllCompanywithSub
} from "../services/company";
import { makeResponse } from "../utils/response";

//Adding a Company
const addCompany = asyncHandler(async (req, res) => {
  const result = await createCompany(req.body);
  if (!result)
    return makeResponse({
      res,
      status: 500,
      message: "Failed to add Company",
    });
  if (result.status) return makeResponse({ res, ...result });
  return makeResponse({ res, message: "Company added successfully" });
  // const {
  //   name,
  //   email,
  //   address,
  //   telephone,
  //   customers,
  //   centers,
  //   logo,
  //   openhour,
  //   closehour,
  //   opendays,
  //   slogan,
  //   about,
  // } = req.body;

  // const company = new Company({
  //   name,
  //   email,
  //   address,
  //   telephone,
  //   customers,
  //   centers,
  //   logo,
  //   openhour,
  //   closehour,
  //   opendays,
  //   slogan,
  //   about,
  // });

  // company
  //   .save()
  //   .then((createCompany) => {
  //     res.json(createCompany);
  //   })
  //   .catch((error) => {
  //     res.status(400).json(error);
  //   });

  // //     const data = await Company.create({name,email,address,telephone,customers,centers,logo,openhour,closehour,opendays,slogan,about});
  // //    if( data ) {
  // //        res.status(201).json({message:"Company Added Successfully!"})
  // //    }
  // //        else{res.status(400).json({message:"Error Occured "})}
});

//Get All Companies
// const getAllCompany = async (req, res) => {
//   try {
//     const company = await Company.find();
//     res.json(company);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

export const getAllCompany = asyncHandler(async (req, res) => {
  const data = await retrieveAllCompany(req.query.page, req.query.limit);
  return makeResponse({
    res,
    data,
    message: "Companies retrieved successfully",
  });
});

//Get a Realavant Company
// const getCompanyById = async (req, res) => {
//   try {
//     if (req.params && req.params.id) {
//       const company = await Company.findById(req.params.id);

//       return res.status(200).json({
//         code: 200,
//         success: true,
//         status: "OK",
//         company,
//         message: `Accessed Company details.`,
//       });
//     }
//   } catch (err) {
//     return res.status(500).json({
//       code: 500,
//       success: false,
//       status: "Internal Server Error",
//       message: error.message,
//     });
//   }
// };

export const getCompanyById = asyncHandler(async (req, res) => {
  const result = await getCompanyDetails(req.params.id);

  if (result.status != 200) return makeResponse({ res, ...result });
  return makeResponse({ res, data: result.data, message: result.message });
});

//Update a Company
const updateCompany = async (req, res) => {
  const CompanyId = req.params.id;

  try {
    const company = await Company.findById(CompanyId);

    if (!company) {
      return res.status(404).json("There is no company");
    }

    const {
      name,
      email,
      address,
      telephone,
      customers,
      centers,
      logo,
      openhour,
      closehour,
      opendays,
      slogan,
      about,
    } = req.body;

    const com = await Company.findByIdAndUpdate(CompanyId, {
      name,
      email,
      address,
      telephone,
      customers,
      centers,
      logo,
      openhour,
      closehour,
      opendays,
      slogan,
      about,
    });

    res.status(200).json(com);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

//Delete a Company
const deleteCompany = async (req, res) => {
  const id = req.params.id;
  let company;
  try {
    company = await Company.findByIdAndRemove(id);
  } catch (error) {
    console.log(error.message);
  }
  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }
  return res.status(200).json({ company });
};

//Get All Customers with SUbscribed Companies
export const getAllCompanySub = asyncHandler(async (req, res) => {
  const data = await retrieveAllCompanywithSub(req.query.page, req.query.limit);
  return makeResponse({
    res,
    data,
    message: "Companies retrieved successfully",
  });
});



module.exports = {
  addCompany,
  getAllCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getAllCompanySub
};

// name
// email
// address
// telephone
// customers
// centers
// logo
// openhour
// closehour
// opendays
// slogan
// about
