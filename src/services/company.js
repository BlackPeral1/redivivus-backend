import {
  findCompany,
  insertCompnay,
  getAllCompany,
} from "../repository/company";
import { getAllCustomersWithSub } from "../repository/customer";

export const createCompany = async (data) => {
  const company = await findCompany({ email: data.email });
  if (company) return { status: 400, message: "This company  already added" };

  const CompanyExist = await findCompany({ name: data.name });
  if (CompanyExist) return { status: 400, message: "Company Already Exist " };

  return await insertCompnay({ ...data });
};

export const retrieveAllCompany = async (data) => {
  return getAllCompany(data);
};

export const getCompanyDetails = async (company_id) => {
  const result = await findCompany({ _id: company_id });
  console.log(result);
  if (!result) {
    return {
      status: 400,
      message: "This comapany details doesn't exist ",
    };
  }
  return {
    status: 200,
    data: result,
    message: "Company details retrieved successfully",
  };
};

export const retrieveAllCompanywithSub = async (data) => {
  return getAllCustomersWithSub(data);
};
