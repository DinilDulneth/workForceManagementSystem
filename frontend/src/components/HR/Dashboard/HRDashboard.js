import React from 'react';
import LeaveApproval from '../LeaveManagement/LeaveApproval';
import { FaUserTie, FaCalendarCheck, FaUserClock } from 'react-icons/fa';

export default function HRDashboard() {
    return (
        <div className="container-fluid">
            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="page-title">HR Dashboard</h2>
                </div>
            </div>

            <div className="row mb-4">
                {/* Statistics Cards */}
                <div className="col-md-4">
                    <div className="card bg-primary text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h5 className="card-title">Total Employees</h5>
                                    <h3 className="mb-0">150</h3>
                                </div>
                                <div>
                                    <FaUserTie size={40} opacity={0.5} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card bg-success text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h5 className="card-title">Present Today</h5>
                                    <h3 className="mb-0">142</h3>
                                </div>
                                <div>
                                    <FaUserClock size={40} opacity={0.5} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card bg-warning text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h5 className="card-title">On Leave</h5>
                                    <h3 className="mb-0">8</h3>
                                </div>
                                <div>
                                    <FaCalendarCheck size={40} opacity={0.5} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leave Approval Section */}
            <div className="row">
                <div className="col-12">
                    <LeaveApproval />
                </div>
            </div>
        </div>
    );
}