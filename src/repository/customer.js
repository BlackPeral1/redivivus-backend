import Customer from "../models/customer";
import logger from "../utils/logger";
import User from "../models/user";

export const createCustomer = async (customer) => {
  const customerMade = (await new Customer(customer).save()).toObject();
  return customerMade;
};

export const getAllCustomers = async ({
  sort = {},
  filter = {},
  page,
  limit = 10,
}) => {
  const options = {
    page,
    limit,
    collation: {
      locale: "en",
    },
  };

  if (Object.keys(sort).length > 0) options.sort = sort;

  if (filter.member_count) {
    filter.members = { $size: Number(filter.member_count) };
    delete filter.member_count;
  }

  const aggregateQuery = () =>
    Customer.aggregate([
      {
        $match: filter,
      },
      { $unset: ["password", "verification_code"] },
    ]);

  return await (page
    ? Customer.aggregatePaginate(aggregateQuery(), options)
    : aggregateQuery()
  ).catch((err) => {
    logger.error(
      `An error occurred when retrieving customers - err: ${err.message}`
    );
    throw err;
  });
};

export const getOneCustomer = async (filters, returnPassword = false) => {
  const customer = await Customer.findOne(filters).lean();
  if (!customer) return null;

  if (!returnPassword) delete customer.password;
  return customer;
};

export const findOneAndUpdateCustomer = async (filters, data) => {
  const customer = await Customer.findOneAndUpdate(filters, data, {
    new: true,
  }).lean();
  if (!customer) return null;

  delete customer.password;
  return customer;
};

export const findOneAndRemoveCustomer = async (filters) => {
  return await Customer.findOneAndRemove(filters);
};

export const subscribe = async (customerId, companyId) => {
  const user = await Customer.findById(customerId);
  let subscribed;
  if (user?.subscribed_companies?.includes(companyId)) {
    await user.subscribed_companies.pull(companyId);
    subscribed = false;
  } else {
    await user.subscribed_companies.push(companyId);
    subscribed = true;
  }
  user.save();
  return subscribed;
};

export const getAllCustomersWithSub = async () => {
  return await Customer.find().populate({
    path: "subscribed_companies",
  });
};

