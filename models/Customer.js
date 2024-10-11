import { MoneyOffCsredRounded } from "@mui/icons-material";
import mongoose from 'mongoose';

// Define the Customer schema
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  memberNumber: {
    type: Number,
    unique: true,
    required: true,
  },
  interests: {
    type: String,
    required: true,
  },
});

const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

export default Customer;
