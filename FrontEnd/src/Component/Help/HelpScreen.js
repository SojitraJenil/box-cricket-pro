import React from 'react';
import TopNavbar from '../TopNavbar/TopNavbar';
import Header from '../Navbar/Header';
import Chat from '../HelpDesk/Chat';

function HelpScreen() {
    return (
        <div>
            <TopNavbar />
            <Header />
            <div className="container mt-4">
                <div className="row justify-content-center">
                    {/* Help Section */}
                    <div className="col-md-8 col-lg-6 mb-4">
                        <div className="card shadow">
                            <div className="card-header bg-primary text-white text-center">
                                <h4>Box Cricket Help & FAQs</h4>
                            </div>
                            <div className="card-body">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item"><strong>Game Format:</strong> Box Cricket is played in an enclosed area with teams of 6-8 players.</li>
                                    <li className="list-group-item"><strong>Over Limit:</strong> Each team gets 4-6 overs to bat.</li>
                                    <li className="list-group-item"><strong>Scoring:</strong> Runs are scored by hitting within the boundary.</li>
                                    <li className="list-group-item"><strong>Dismissals:</strong> Includes bowled, caught, and hit-wicket.</li>
                                    <li className="list-group-item"><strong>Rules:</strong> Direct ceiling hits count as dead balls.</li>
                                    <li className="list-group-item"><strong>Extras:</strong> Wides and No-balls add runs.</li>
                                    <li className="list-group-item"><strong>Booking Slots:</strong> Use the app to book Box Cricket slots.</li>
                                    <li className="list-group-item"><strong>Contact Support:</strong> Use the chat below for queries.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Chat Section */}
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow">
                            <div className="card-header bg-primary text-white text-center">
                                <h4>Live Chat Support</h4>
                            </div>
                            <div className="card-body">
                                <Chat />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HelpScreen;
