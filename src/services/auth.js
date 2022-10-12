import User from "../models/user";
import bcrypt from "bcrypt";
import { getOneUser, createUser } from "../repository/user";
import { createAdmin } from "../repository/admin";
import { createCustomer } from "../repository/customer";
import { insertCompnay } from "../repository/company";

export const loginUser = async ({ email, password }) => {
  const user = await getOneUser({ email }, true);
  if (!user) return false;
  const isPasswordMatch = await new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
  if (!isPasswordMatch) return false;
  delete user.password;
  return user;
};

export const registerUser = async ({ user, specificData }) => {
  // console.log(encryptedPassword);
  console.log(user);
  const encryptedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(
      user.password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS),
      (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      }
    );
  });

  if (user.role === "CUSTOMER") {
    var newCustomer = await createCustomer(specificData);
  } else if (user.role === "ADMIN") {
    var newAdmin = await createAdmin(specificData);
  } else if (user.role === "COMPANY") {
    var newCompany = await insertCompnay(specificData);
  }

  const registeredUser = await createUser({
    ...user,
    password: encryptedPassword,
    admin: user.role === "ADMIN" ? newAdmin._id : null,
    customer: user.role === "CUSTOMER" ? newCustomer._id : null,
    company: user.role === "COMPANY" ? newCompany._id : null,
  });

  return registeredUser;
};
