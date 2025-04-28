import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut,
} from "react-icons/lu";
import { TbUserEdit } from 'react-icons/tb';
export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/dashboard",
    },
    {
        id: "02",
        label: "Income",
        icon: LuWalletMinimal,
        path: "/income",
    },
    {
        id: "03",
        label: "Expense",
        icon: LuHandCoins,
        path: "/expense",
    },
    {
        id: "04",
        label: "Edit Profile",
        icon: TbUserEdit,
        path: "/edit",
    },
    {
        id: "05",
        label: "Logout",
        icon: LuLogOut,
        path: "/logout",
    }
];