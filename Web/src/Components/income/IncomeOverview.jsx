import React, { useState, useEffect } from 'react';
import { LuPlus } from "react-icons/lu";
import CustomBarChart from "../charts/CustomBarChart";
import { prepareIncomeBarChartData } from '../../Utils/Helper';

const IncomeOverview = ({ transactions, onAddIncome }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareIncomeBarChartData(transactions);
        setChartData(result);

        return () => {};
    }, [transactions]);

    return (
        <div className='bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50'>
            <div className="flex items-center justify-between">
                <div className="">
                    <h5 className="text-lg">Income Overview</h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Track your earnings over time and analyze your income trends.
                    </p>
                </div>

                <button className="group flex items-center gap-3 text-[13px] font-medium text-purple-700 
                    hover:text-purple-50 bg-gray-100 hover:bg-purple-500 
                    px-4 py-1.5 rounded-lg border border-gray-200/50 
                    cursor-pointer focus:outline-none" onClick={onAddIncome}>
                    <LuPlus className="text-lg" />
                    Add Income
                </button>
            </div>

            <div className="mt-6">
                <CustomBarChart data={chartData} />
            </div>
        </div>
    );
};

export default IncomeOverview;
