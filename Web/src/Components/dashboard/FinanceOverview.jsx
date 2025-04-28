import React from "react";
import CustomPieChart from "../charts/CustomPieChart"
const COLORS = ["#875CF5", "#FA2C37", "#00C000"];

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
    const balanceData = [
        { name: "Total Balance", amount: totalBalance },
        { name: "Total Expenses", amount: totalExpense },
        { name: "Total Income", amount: totalIncome },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Financial Overview</h5>
            </div>

            <CustomPieChart
                data={balanceData}
                label="Total Balance"
                totalAmount={`$${totalBalance}`}
                colors={COLORS}
                showTextAnchor
            />
        </div>
    );
};

export default FinanceOverview;