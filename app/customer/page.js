"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function CustomerPage() {
    const APIBASE = process.env.NEXT_PUBLIC_API_URL; // Your API base URL
    const [customerList, setCustomerList] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null); // Track the current customer ID

    const { register, handleSubmit, reset } = useForm();

    // Fetch all customers
    async function fetchCustomers() {
        try {
            const response = await fetch(`${APIBASE}/customer`);
            if (!response.ok) {
                throw new Error(`Error fetching customers: ${response.statusText}`);
            }
            const data = await response.json();
            console.log('Fetched customers:', data); // Log fetched data
            const updatedData = data.map(customer => {
                customer.id = customer._id; // Change the property name for consistency
                return customer;
            });
            setCustomerList(updatedData);
        } catch (error) {
            console.error('Failed to fetch customers:', error);
        }
    }
    

    const startEdit = (customer) => () => {
        setEditMode(true);
        reset({
            name: customer.name,
            dateOfBirth: customer.dateOfBirth.split("T")[0], // Format date to YYYY-MM-DD
            memberNumber: customer.memberNumber,
            interests: customer.interests,
        });
        setCurrentId(customer.id); // Set the ID of the customer being edited
    };

    const deleteById = (id) => async () => {
        if (!confirm("Are you sure you want to delete this customer?")) return;

        try {
            const response = await fetch(`${APIBASE}/customers?id=${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error(`Error deleting customer: ${response.statusText}`);
            fetchCustomers(); // Refresh the customer list
        } catch (error) {
            console.error('Failed to delete customer:', error);
        }
    };

    useEffect(() => {
        fetchCustomers(); // Fetch customers on component mount
    }, []);

    function handleCustomerFormSubmit(data) {
        const method = editMode ? "PUT" : "POST";
        const url = editMode ? `${APIBASE}/customers?id=${currentId}` : `${APIBASE}/customers`;

        fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) throw new Error(`Error ${method === 'POST' ? 'creating' : 'updating'} customer: ${response.statusText}`);
                return response.json();
            })
            .then(() => {
                reset(); // Reset the form
                setEditMode(false); // Exit edit mode
                setCurrentId(null); // Clear the current ID
                fetchCustomers(); // Refresh the customer list
            })
            .catch(error => {
                console.error('Failed to submit customer form:', error);
            });
    }

    return (
        <main>
            <div className="flex flex-row gap-4">
                <div className="flex-1 w-64">
                    <form onSubmit={handleSubmit(handleCustomerFormSubmit)}>
                        <div className="grid grid-cols-2 gap-4 w-fit m-4">
                            <div>Name:</div>
                            <div>
                                <input
                                    name="name"
                                    type="text"
                                    {...register("name", { required: true })}
                                    className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                />
                            </div>
                            <div>Date of Birth:</div>
                            <div>
                                <input
                                    name="dateOfBirth"
                                    type="date"
                                    {...register("dateOfBirth", { required: true })}
                                    className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                />
                            </div>
                            <div>Member Number:</div>
                            <div>
                                <input
                                    name="memberNumber"
                                    type="number"
                                    {...register("memberNumber", { required: true })}
                                    className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                />
                            </div>
                            <div>Interests:</div>
                            <div>
                                <input
                                    name="interests"
                                    type="text"
                                    {...register("interests", { required: true })}
                                    className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                />
                            </div>
                            <div className="col-span-2 text-right">
                                {editMode ? (
                                    <input
                                        type="submit"
                                        value="Update"
                                        className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                                    />
                                ) : (
                                    <input
                                        type="submit"
                                        value="Add"
                                        className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                                    />
                                )}
                                {editMode && (
                                    <button
                                        onClick={() => {
                                            reset();
                                            setEditMode(false);
                                            setCurrentId(null);
                                        }}
                                        className="ml-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="border m-4 bg-slate-300 flex-1 w-64">
                    <ul>
                        {customerList.map((customer) => (
                            <li key={customer.id}>
                                <button className="border border-black p-1/2" onClick={startEdit(customer)}>📝</button>
                                <button className="border border-black p-1/2" onClick={deleteById(customer.id)}>❌</button>
                                <Link href={`/customer/${customer.id}`}>{customer.name}</Link> [{customer.memberNumber}]
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
    );
}
