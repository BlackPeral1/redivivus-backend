import mongoose from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      first_name: {
        type: String,
        required: [true, 'First name is required']
      },
      last_name: {
        type: String,
        required: [true, 'Last name is required']
      }
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: [true, 'Email should be unique'],
      lowercase: [true, 'Email should be lowercase']
    },
    hashed_password: {
      type: String,
      required: [true, 'Hashed password is rquired'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      validate: {
        validator: (v) => {
          return /\d{10}/gm.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      },
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    bank_details: {
      bank_name: {
        type: String,
        required: true,
      },
      acc_no: {
        type: String,
        required: true,
        validate: {
          validator: (v) => {
            return /^[\d]+$/mg.test(v);
          },
          message: props => `${props.value} is not a valid bank account number!`
        },
      },
      branch: {
        type: String,
        required: true,
      },
      acc_owner: {
        type: String,
        required: true,
      }
    },
    earnings : [{
      type : mongoose.Schema.Types.ObjectId,
    }],
    pickup_requests : [{
      type : mongoose.Schema.Types.ObjectId,
    }],
    subscribed_companies : [{
      type : mongoose.Schema.Types.ObjectId,
    },],
    verification_code: {
      type: String,
      required: false
    },
    is_verified: {
      type: Boolean,
      required: true,
      default: false
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true
    },
  }
)

CustomerSchema.plugin(aggregatePaginate)

CustomerSchema.index({ createdAt: 1 })

const Customer = mongoose.model('Customer', CustomerSchema)

Customer.syncIndexes()

export default Customer