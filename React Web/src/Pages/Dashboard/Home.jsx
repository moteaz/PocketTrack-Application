import React,{useEffect, useState} from "react";
import DashboardLayout from "../../Components/layouts/DashboardLayout";
import { useUserAuth } from "../../Hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPathes";
import { LuHandCoins,LuWalletMinimal } from "react-icons/lu";
import InfoCard from "../../Components/Cards/InfoCard";
import {IoMdCard} from  "react-icons/io";
import { addThousandsSeparator } from "../../Utils/Helper";
import RecentTransactions from "../../Components/dashboard/RecentTransactions";
import FinanceOverview from "../../Components/dashboard/FinanceOverview";
import ExpenseTransactions from "../../Components/dashboard/ExpenseTransactions";
import Last30DaysExpenses from "../../Components/dashboard/Last30DaysExpense";
import RecentIncomeWithChart from "../../Components/dashboard/RecentIncomeWithChart";
import RecentIncome from "../../Components/dashboard/RecentIncome";
const Home = () => {

  useUserAuth();

  const navigate=useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

const fetchDashboardData = async () => {
    if (loading) return;

    setLoading(true);
    
    try {
        const response = await axiosInstance.get(
            `${API_PATHS.DASHBOARD.GET_DATA}`
        );
        if (response.data) {
            setDashboardData(response.data);
        }
    } catch (error) {
        console.error("Something went wrong. Please try again.", error.message, error.response?.data);
    } finally {
        setLoading(false);
    }
};
  
useEffect(()=>{
    fetchDashboardData();
    return ()=>{};
}, []);

return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSeparator(dashboardData?.total_balance || 0)}
            color="bg-purple-500"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSeparator(dashboardData?.total_income || 0)}
            color="bg-green-500"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={addThousandsSeparator(dashboardData?.total_expense || 0)}
            color="bg-red-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <RecentTransactions
          transactions={dashboardData?.recent_transactions}
        />

        <FinanceOverview
        totalBalance={dashboardData?.total_balance||0}
        totalIncome={dashboardData?.total_income||0}
        totalExpense={dashboardData?.total_expense||0}
        />

        <ExpenseTransactions
        transactions={dashboardData?.last30daysExpense.transaction}
        onSeeMore={() => navigate("/expense")}
        />

        <Last30DaysExpenses
        data={dashboardData?.last30daysExpense.transaction}
        />
        
        <RecentIncomeWithChart 
        data={dashboardData?.last60daysIncome?.transaction?.slice(0,4)}
        totalIncome={dashboardData?.last60daysIncome?.total}
        />

        <RecentIncome 
        transactions={dashboardData?.last60daysIncome?.transaction}
        onSeeMore={() => navigate("/income")}
        />
      </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;