import React from "react";
import moment from "moment";
import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 ">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Expenses</h5>
                <button
                    className="
                        group flex items-center gap-3 text-[12px] font-medium text-gray-700 
                        hover:text-purple-50 bg-gray-100 hover:bg-purple-500 
                        px-4 py-1.5 rounded-lg border border-gray-200/50 
                        cursor-pointer focus:outline-none
                    "
                    onClick={onSeeMore}
                >
                    See All
                    <LuArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1 group-focus:translate-x-1" />
                </button>
            </div>
            <div className="mt-6">
                {transactions?.slice(0, 5)?.map((expense) => (
                    <TransactionInfoCard
                        key={expense.id} 
                        title={expense.category}
                        icon={expense.icon}
                        date={moment(expense.date).format("Do MMM YYYY")}
                        amount={expense.amount}
                        type="expense"
                        hideDeleteBtn
                    />
                ))}
            </div>
        </div>
    );
};

export default ExpenseTransactions;
