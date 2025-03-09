import React from 'react';
import TopNavbar from '../TopNavbar/TopNavbar';
import Header from '../Navbar/Header';

function Rule() {
    return (
        <div>
            <TopNavbar />
            <Header />
            <div className="container mt-4">
                <div className="card shadow">
                    <div className="card-header bg-primary text-white text-center">
                        <h4>Box Cricket Rules & Policies</h4>
                    </div>
                    <div className="card-body">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <strong>1. Match Format:</strong>
                                <ul>
                                    <li>Game Type: 6 overs per side</li>
                                    <li>Team Size: 6 players per team (+2 extra players allowed)</li>
                                </ul>
                            </li>
                            <li className="list-group-item">
                                <strong>2. Bowling Rules:</strong>
                                <ul>
                                    <li><strong>Over Limit Per Bowler:</strong> Only 1 bowler can bowl a maximum of 2 overs. Other bowlers can bowl only 1 over each.</li>
                                </ul>
                            </li>
                            <li className="list-group-item">
                                <strong>3. Wide Ball Rules:</strong>
                                <ul>
                                    <li><strong>Overs 1 to 5:</strong> Wide ball counts, with a 2-run penalty to the bowling team.</li>
                                    <li><strong>Successive Wides:</strong>
                                        <ul>
                                            <li>1st Wide: 2 runs penalty</li>
                                            <li>2nd Wide: 4 runs penalty</li>
                                            <li>3rd, 4th, 5th, & 6th Wides: 6 runs penalty (balls are counted)</li>
                                        </ul>
                                    </li>
                                    <li><strong>6th Over:</strong> No ball counts, 1 run penalty to the bowling team.</li>
                                </ul>
                            </li>
                            <li className="list-group-item">
                                <strong>4. Scoring Rules:</strong> Hitting the side walls earns bonus runs, direct ceiling hits are dead balls.
                            </li>
                            <li className="list-group-item">
                                <strong>5. Dismissals:</strong> Players can be out by bowled, caught, run-out, or hit-wicket.
                            </li>
                            <li className="list-group-item">
                                <strong>6. Payment & Refund Policy:</strong> In case of <strong>payment failure</strong>, the refund will be processed within <strong>7 days</strong>.
                            </li>
                            <li className="list-group-item">
                                <strong>7. Rain Policy:</strong> If the match is canceled due to <strong>rain</strong>, a full refund will be provided.
                            </li>
                            <li className="list-group-item">
                                <strong>8. Extra Runs:</strong> Wide and no-ball add runs to the batting team.
                            </li>
                            <li className="list-group-item">
                                <strong>9. Booking Rules:</strong> Match slots must be booked <strong>24 hours</strong> in advance.
                            </li>
                            <li className="list-group-item">
                                <strong>10. Safety:</strong> Players must wear proper cricket shoes; no spikes allowed.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Rule;
