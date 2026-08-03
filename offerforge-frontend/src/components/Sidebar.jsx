import {
    FaHome,
    FaFileAlt,
    FaBriefcase,
    FaRobot,
    FaUser
} from "react-icons/fa";

export default function Sidebar() {

    return (

        <div className="w-64 bg-slate-900 text-white min-h-screen p-6">

            <h1 className="text-3xl font-bold mb-10">
                OfferForge
            </h1>

            <div className="space-y-6">

                <div className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
                    <FaHome />
                    Dashboard
                </div>

                <div className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
                    <FaFileAlt />
                    Resume
                </div>

                <div className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
                    <FaBriefcase />
                    Jobs
                </div>

                <div className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
                    <FaRobot />
                    AI Coach
                </div>

                <div className="flex items-center gap-3 cursor-pointer hover:text-blue-400">
                    <FaUser />
                    Profile
                </div>

            </div>

        </div>

    );

}