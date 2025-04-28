import React, { useState } from 'react';
import { FaMoneyBillWave } from "react-icons/fa"; 
import EmojiPickerPopup from '../EmojiPickerPopup';

const AddExpenseForm = ({ onAddExpense }) => {
    const [expense, setExpense] = useState({
        category: "",
        amount: "",
        icon: "",
        date: "",
    });

    const handleChange = (key, value) => {
        setExpense((prevExpense) => ({
            ...prevExpense,
            [key]: value
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        // Call onAddExpense only after successful form validation
        onAddExpense(expense); 
        setExpense({ category: "", amount: "", icon: "", date: "" }); // Reset the form
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Expense category */}
            <div className="relative">
                <EmojiPickerPopup 
                    icon={expense.icon} 
                    onSelect={(selectedIcon) => handleChange("icon", selectedIcon)} 
                />
                <input
                    value={expense.category}
                    onChange={({ target }) => handleChange("category", target.value)}
                    type="text"
                    id="category"
                    className="peer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 placeholder-gray"
                    placeholder="Rent , Internet , etc"
                />
            </div>

            {/* Amount */}
            <div className="relative">
                <input
                    value={expense.amount}
                    onChange={({ target }) => handleChange("amount", target.value)}
                    type="number"
                    id="amount"
                    className="peer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 placeholder-transparent"
                    placeholder="Amount"
                />
                <label
                    htmlFor="amount"
                    className="absolute left-3 top-[-10px] text-xs text-violet-500 bg-white px-1 transition-all
                    peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base
                    peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-violet-500"
                >
                    Amount
                </label>
            </div>

            {/* Date */}
            <div className="relative">
                <input
                    value={expense.date}
                    onChange={({ target }) => handleChange("date", target.value)}
                    type="date"
                    id="date"
                    className="peer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 placeholder-transparent"
                    placeholder="Date"
                />
                <label
                    htmlFor="date"
                    className="absolute left-3 top-[-10px] text-xs text-violet-500 bg-white px-1 transition-all
                    peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base
                    peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-violet-500"
                >
                    Date
                </label>
            </div>

            {/* Add Expense Button */}
            <div className="flex justify-center mt-6">
                <button
                    type="submit"
                    className="flex items-center gap-2 justify-center w-50 bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-400 hover:text-violet-700 transition cursor-pointer"
                >
                    Add Expense
                    <FaMoneyBillWave size={20} />
                </button>
            </div>
        </form>
    );
};

export default AddExpenseForm;
