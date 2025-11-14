import React, { useState,useEffect } from "react";
import DashboardLayout from "../../Components/layouts/DashboardLayout";
import IncomeOverview from "../../Components/income/IncomeOverview";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPathes";
import Modal from "../../Components/Modal";
import AddIncomeForm from "../../Components/income/AddIncomeForm";
import { toast } from "react-hot-toast";
import IncomeList from "../../Components/income/IncomeList";
import DeleteAlert from "../../Components/DeleteAlert";
import { useUserAuth } from "../../Hooks/useUserAuth";


const Income = () => {
  useUserAuth();
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
      show: false,
      data: null,
  });
  
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  
  // Get All Income Details
  const fetchIncomeDetails = async () => {
    if (loading) return;

    setLoading(true);
    
    try {
        const response = await axiosInstance.get(
            `${API_PATHS.INCOME.GET_INCOMES}`
        );
        if (response.data) {
          setIncomeData(response.data);
        }
    } catch (error) {
        console.error("Something went wrong. Please try again.", error.message, error.response?.data);
    } finally {
        setLoading(false);
    }
  };
  
  // Handle Add Income
  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;

    if (!source.trim()) {
      toast.error("Source is required.");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }
    if (!date) {
      toast.error("Date is required.");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        icon,
        date,
      });

      setOpenAddIncomeModal(false);
      toast.success("Income added successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error("Error adding income:", error.response?.data?.message || error.message);
      toast.error("Failed to add income.");
    }
  };
  
  // Delete Income
  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Income details deleted successfully");
      fetchIncomeDetails();
  } catch (error) {
      console.error(
          "Error deleting income:",
          error.response?.data?.message || error.message
      );
  }
  };
  
  // Handle download income details
  const handleDownloadIncomeDetails = async () => {
    try {
        const response = await axiosInstance.get(
            API_PATHS.INCOME.DOWNLOAD_INCOME,
            {
                responseType: "blob",
            }
        );
  
        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "income_details.xlsx");
  
        // Append the link to the document body and trigger the download
        document.body.appendChild(link);
        link.click();
  
        // Remove the link from the document
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error downloading income details:", error);
        toast.error("Error downloading income details")
    }
  };

  useEffect(()=>{
    fetchIncomeDetails();
      return ()=>{};
  }, []);
  
    return (
        <DashboardLayout activeMenu="Income">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div className="">
                        <IncomeOverview
                            transactions={incomeData}
                            onAddIncome={() => setOpenAddIncomeModal(true)}
                        />
                    </div>
                    <IncomeList
                      transactions={incomeData}
                      onDelete={(id)=>{setOpenDeleteAlert({show:true ,data:id})}}
                      onDownload={handleDownloadIncomeDetails}
                      />
                </div>

                <Modal
                isOpen={openAddIncomeModal}
                onClose={() => setOpenAddIncomeModal(false)}
                title="Add Income">
                <AddIncomeForm onAddIncome={handleAddIncome}/>
                </Modal>

                <Modal
                isOpen={openDeleteAlert.show}
                onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                title="Delete Income">
                <DeleteAlert
                content="Are you sure you want to delete this income detail?"
                onDelete={() => deleteIncome(openDeleteAlert.data)}
                />
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default Income;