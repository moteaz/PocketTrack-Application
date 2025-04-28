import React, { useState, useEffect } from 'react';
import { LuPlus } from "react-icons/lu";
import { prepareExpenseLineChartData } from '../../Utils/Helper';
import CustomLineChart from '../charts/CustomLienChart';

const ExpenseOverview = ({ transactions, onAddExpense }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareExpenseLineChartData(transactions);
        setChartData(result);

        return () => {};
    }, [transactions]);

    return (
        <div className='bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50'>
            <div className="flex items-center justify-between">
                <div className="">
                    <h5 className="text-lg">Expense Overview</h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Track your Spending trends over time and gain insights your money goes.
                    </p>
                </div>

                <button className="group flex items-center gap-3 text-[13px] font-medium text-purple-700 
                    hover:text-purple-50 bg-gray-100 hover:bg-purple-500 
                    px-4 py-1.5 rounded-lg border border-gray-200/50 
                    cursor-pointer focus:outline-none" onClick={onAddExpense}>
                    <LuPlus className="text-lg" />
                    Add Expense
                </button>
            </div>

            <div className="mt-6">
                <CustomLineChart data={chartData} />
            </div>
        </div>
    );
};

export default ExpenseOverview;
