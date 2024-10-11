import Customer from "@/models/Customer";

// Handler for GET request to fetch all customers, sorted by their member number in descending order
export async function GET() {
  try {
    const customers = await Customer.find().sort({ memberNumber: -1 });
    return new Response(JSON.stringify(customers), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch customers" }), { status: 500 });
  }
}

// Handler for POST request to create a new customer
export async function POST(request) {
  try {
    const body = await request.json();
    const customer = new Customer(body);
    await customer.save();
    return new Response(JSON.stringify(customer), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to create customer" }), { status: 500 });
  }
}

// Handler for PUT request to update an existing customer by ID
export async function PUT(request) {
    try {
      const body = await request.json();
  
      // Validate the _id field
      if (!mongoose.Types.ObjectId.isValid(body._id)) {
        return new Response(JSON.stringify({ error: "Invalid customer ID" }), { status: 400 });
      }
  
      // Find and update the customer by _id
      const customer = await Customer.findByIdAndUpdate(body._id, body, { new: true }); // { new: true } returns the updated document
      if (!customer) {
        return new Response(JSON.stringify({ message: "Customer not found" }), { status: 404 });
      }
  
      return new Response(JSON.stringify(customer), { status: 200 });
    } catch (error) {
      console.error("Error during PUT request:", error); // Log the full error details
      return new Response(JSON.stringify({ error: `Failed to update customer: ${error.message}` }), { status: 500 });
    }
  }