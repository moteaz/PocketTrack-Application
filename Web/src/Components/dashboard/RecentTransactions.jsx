import React from "react";
import { LuArrowRight } from "react-icons/lu";
import moment from "moment";
import TransactionInfoCard from "../Cards/TransactionInfoCard";

const RecentTransactions = ({ transactions }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Recent Transactions</h5>
      </div>
      <div className="mt-6">
        {transactions?.slice(0, 8)?.map((item) => (
          <TransactionInfoCard
          key={`${item.id || item.amount}-${item.date}-${item.type}`} // Ensures a unique key
            title={item.type === "expense" ? item.category : item.source}
            date={moment(item.date).format("Do MMM YYYY")}
            amount={item.amount}
            icon={item.icon}
            type={item.type}
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
