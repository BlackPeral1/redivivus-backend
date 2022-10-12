import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const CustomerSchema = new mongoose.Schema({
  bank_details: {
    bank_name: {
      type: String,
    },
    acc_no: {
      type: String,
      validate: {
        validator: (v) => {
          return /^[\d]+$/gm.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid bank account number!`,
      },
    },
    branch: {
      type: String,
    },
    acc_owner: {
      type: String,
    },
  },
  earnings: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  pickup_requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  subscribed_companies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  ],
});

CustomerSchema.plugin(aggregatePaginate);

const Customer = mongoose.model("Customer", CustomerSchema);

export default Customer;
