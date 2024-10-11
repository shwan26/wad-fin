import Customer from "@/models/Customer";

// Handler for GET request to fetch a customer by ID
export async function GET(request, { params }) {
  const id = params.id;

  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return new Response(JSON.stringify({ message: "Customer not found" }), {
        status: 404,
      });
    }
    console.log({ customer });
    return new Response(JSON.stringify(customer), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch customer" }), {
      status: 500,
    });
  }
}

// Handler for DELETE request to remove a customer by ID
export async function DELETE(request, { params }) {
  const id = params.id;

  try {
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return new Response(JSON.stringify({ message: "Customer not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ message: "Customer deleted" }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to delete customer" }), {
      status: 500,
    });
  }
}
