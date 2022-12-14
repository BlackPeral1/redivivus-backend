import express from "express";

import {
  addCompany,
  getAllCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../controllers/company.controller";
const companyRoute = express.Router();

companyRoute.post("/addcompany", addCompany);

companyRoute.get("/allcompany", getAllCompany);

companyRoute.get("/getcompany/:id", getCompanyById);

companyRoute.patch("/updatecompany/:id", updateCompany);

companyRoute.delete("/deletecompany/:id", deleteCompany);

module.exports = companyRoute;
