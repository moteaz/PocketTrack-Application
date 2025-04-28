import React from 'react';
import { LuDownload } from 'react-icons/lu';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import moment from 'moment';

const ExpenseList = ({ transactions, onDelete, onDownload }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Expense List</h5>
                <button className="group flex items-center gap-3 text-[13px] font-medium text-purple-700 
                    hover:text-purple-50 bg-gray-100 hover:bg-purple-500 
                    px-4 py-1.5 rounded-lg border border-gray-200/50 
                    cursor-pointer focus:outline-none" onClick={onDownload}>
                    <LuDownload className="text-base" /> Download
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
                {transactions?.map((expense) => (
                    <TransactionInfoCard
                        key={`${expense.id }`}
                        title={expense.category}
                        icon={expense.icon}
                        date={moment(expense.date).format("Do MMM YYYY")}
                        amount={expense.amount}
                        type="expense"
                        onDelete={() => onDelete(expense.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ExpenseList;