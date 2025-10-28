// src/components/FormResponses.jsx
import React, { useEffect, useState } from "react";
import "../styles/FormResponses.css";
import SearchIcon from "../assets/SearchIcon.png"; // ← replace with your actual icon
import FilterIcon from "../assets/FilterIcon.png"; // ← optional

export default function FormResponses() {
    const [activeTab, setActiveTab] = useState("summary");

    useEffect(() => {
        console.log("FormResponses mounted");
        return () => console.log("FormResponses unmounted");
    }, []);


    // 🧠 Dummy data
    const responses = [
        {
            id: 1,
            submittedBy: "Jacob Jones",
            userId: "447",
            submittedOn: "Mar 28, 2025 at 2:47 PM",
            email: "georgia@example.com",
        },
        {
            id: 2,
            submittedBy: "Savannah Nguyen",
            userId: "177",
            submittedOn: "Mar 02, 2025 at 2:47 PM",
            email: "jennings@example.com",
        },
        {
            id: 3,
            submittedBy: "Dianne Russell",
            userId: "177",
            submittedOn: "Mar 02, 2025 at 2:47 PM",
            email: "tim.jens@example.com",
        },
        {
            id: 4,
            submittedBy: "Leslie Alexander",
            userId: "177",
            submittedOn: "Mar 02, 2025 at 2:47 PM",
            email: "alex@example.com",
        },
        {
            id: 5,
            submittedBy: "Darrell Steward",
            userId: "177",
            submittedOn: "Mar 02, 2025 at 2:47 PM",
            email: "darrell@example.com",
        },
    ];

    return (
        <div className="responses-container">
            {/* 🔹 Tabs inside Responses section */}
            <div className="responses-tab-buttons">
                <button
                    className={`resp-tab ${activeTab === "summary" ? "active" : ""}`}
                    onClick={() => setActiveTab("summary")}
                >
                    Response Summary
                </button>
                <button
                    className={`resp-tab ${activeTab === "individual" ? "active" : ""}`}
                    onClick={() => setActiveTab("individual")}
                >
                    Individual Response
                </button>
            </div>

            {/* 🔹 Search + Actions */}
            <div className="responses-header">
                <div className="response-search-box">
                    <img src={SearchIcon} alt="search" className="search-icon-inside" />
                    <input
                        type="text"
                        placeholder="Search by Name/User ID"
                        className="response-search-input"
                    />
                </div>



                <div className="action-buttons">
                    <button className="filter-btn">
                        <img src={FilterIcon} alt="filter" className="btn-icon" />
                        Filter
                    </button>
                    <button className="export-btn">
                        Export to Excel
                    </button>
                </div>
            </div>

            {/* 🔹 Table section */}
            <table className="responses-table">
                <thead>
                    <tr>
                        <th>Submitted By</th>
                        <th>User ID</th>
                        <th>Submitted On</th>
                        <th>Email</th>
                        <th>Response</th>
                    </tr>
                </thead>
                <tbody>
                    {responses.map((res) => (
                        <tr key={res.id}>
                            <td>{res.submittedBy}</td>
                            <td>{res.userId}</td>
                            <td>{res.submittedOn}</td>
                            <td>{res.email}</td>
                            <td>
                                <button className="view-butn">View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 🔹 Footer */}
            <div className="responses-footer">
                <button className="preview-btn">Preview Form</button>
                <button className="save-btn">Save Form</button>
            </div>
        </div>
    );
}
