import Loader from '../../common/Loader/index';
import React, { useEffect, useState } from 'react';
import useSnackbar from '../../hooks/useSnackbar';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import axios from 'axios';

function Tournament() {
    const [tournaments, setTournaments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await axios.get('http://localhost:8000/tournaments'); // Updated endpoint
                const tournamentData = response.data.filter((item: any) => item.isTournament); // Filter only tournaments
                setTournaments(tournamentData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tournaments:', error);
                setLoading(false);
                showSnackbar('Failed to load tournaments', 'error');
            }
        };

        fetchTournaments();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`http://localhost:8000/products/${id}`); // Updated endpoint
            showSnackbar('Tournament deleted successfully!', 'success');
            setTournaments(tournaments.filter((item) => item._id !== id));
        } catch (error) {
            console.error('Error deleting tournament:', error);
        }
    };

    const toggleRowExpansion = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return (
        <>
            <Breadcrumb pageName="Tournaments" />
            <div className="p-4 md:p-6 bg-gradient-to-br  rounded-lg shadow-lg">
                {loading ? (
                    <Loader />
                ) : (
                    <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-6">
                        <table className="w-full table-auto border-collapse bg-white rounded-lg shadow-md">
                            <thead className="bg-gradient-to-r from-yellow-300 to-blue-500 text-white">
                                <tr>
                                    <th className="py-3 px-6 text-left font-semibold text-lg">Product Name</th>
                                    <th className="py-3 px-6 text-left font-semibold text-lg">Price</th>
                                    <th className="py-3 px-6 text-left font-semibold text-lg">Description</th>
                                    <th className="py-3 px-6 text-left font-semibold text-lg">Address</th>
                                    <th className="py-3 px-6 text-center font-semibold text-lg">Stock</th>
                                    <th className="py-3 px-6 text-center font-semibold text-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tournaments.map((item) => (
                                    <React.Fragment key={item._id}>
                                        <tr className="border-b hover:bg-gray-100 transition-colors">
                                            <td className="py-4 px-6">{item.product_name}</td>
                                            <td className="py-4 px-6">₹{item.product_price}</td>
                                            <td className="py-4 px-6">{item.product_description}</td>
                                            <td className="py-4 px-6">{item.product_address}</td>
                                            <td className="py-4 px-6 text-center">{item.Product_stock}</td>
                                            <td className="py-4 px-6 text-center">
                                                <button
                                                    onClick={() => toggleRowExpansion(item._id)}
                                                    className="px-4 py-2 text-sm rounded-md bg-yellow-400 text-white hover:bg-yellow-500 transition-colors"
                                                >
                                                    {expandedRow === item._id ? 'Hide Details' : 'View Details'}
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="ml-3 mt-3 px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedRow === item._id && (
                                            <tr>
                                                <td colSpan={6} className="p-0">
                                                    <div className="p-6 bg-slate-300 from-gray-100 to-gray-200 rounded-lg">
                                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Details</h3>
                                                        <p><strong>Price:</strong> ${item.product_price}</p>
                                                        <p><strong>Price:</strong> {item.Product_stock}</p>
                                                        <p><strong>Discount Rate:</strong> {item.Product_dis_rate}%</p>
                                                        <p><strong>Rating:</strong> {item.Product_rating} ⭐</p>

                                                        <h3 className="mt-6 text-xl font-semibold text-gray-900">Booked Slots</h3>
                                                        {item.booked_slots.length > 0 ? (
                                                            <table className="w-full table-auto mt-4">
                                                                <thead className="bg-gradient-to-r from-green-500 to-green-300 text-white">
                                                                    <tr>
                                                                        <th className="py-3 px-6 text-left font-semibold">Slot</th>
                                                                        <th className="py-3 px-6 text-left font-semibold">Date</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {item.booked_slots.map((slot: any, index: number) => (
                                                                        <tr key={index} className="border-b hover:bg-gray-50">
                                                                            <td className="py-3 px-6">{slot.slot}</td>
                                                                            <td className="py-3 px-6">{new Date(slot.date).toLocaleDateString()}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        ) : (
                                                            <p className="text-gray-600">No booked slots</p>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                        {tournaments.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-gray-600 text-lg">No tournaments found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default Tournament;
