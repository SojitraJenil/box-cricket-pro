import { useEffect, useState } from "react"
import axios from "axios"
import { Switch } from "@headlessui/react";

interface Booking {
    _id: string
    user_id: {
        fname: any;
        lname: any;
        mobileno: any;
    }
    product_id: {
        _id: string
        product_name: string
        product_price: string
        product_description: string
        category: string
        product_img: string[]
        product_address: string
        time_slots: string[]
    }
    booked_slots: string[]
    email: string
    status: string
    booking_date: string
    __v: number
    remainingTime: null
}

function BookedTable() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [timeSlots, setTimeSlots] = useState<string[]>([])
    const [allBookings, setAllBookings] = useState<any[]>([])

    useEffect(() => {
        fetch("http://localhost:8000/booked-slots")
            .then((response) => response.json())
            .then((data) => {
                if (data && Array.isArray(data.bookings)) {
                    setBookings(data.bookings)
                    console.log("data.bookings :>> ", data.bookings)

                    let allBookedSlots: any[] = []
                    data.bookings.forEach((item: any) => {
                        if (item.booked_slots && Array.isArray(item.booked_slots)) {
                            allBookedSlots = [...allBookedSlots, ...item.booked_slots]
                        }
                    })

                    setAllBookings(allBookedSlots)
                    generateTimeSlots()
                } else {
                    console.error("Invalid bookings data:", data.bookings)
                }
            })
            .catch((error) => console.error("Error fetching data:", error))
    }, [])

    const generateTimeSlots = () => {
        const slots: string[] = []
        const startTime = 7
        for (let i = 0; i < 24; i++) {
            const hour = (startTime + i) % 24
            const slot = `${hour % 12 || 12}:00 ${hour < 12 ? "AM" : "PM"}`
            slots.push(slot)
        }
        setTimeSlots(slots)
    }

    const toggleApproval = async (bookingId: string) => {
        const bookingToUpdate = bookings.find((b) => b._id === bookingId)
        if (!bookingToUpdate) return

        const updatedStatus = bookingToUpdate.status === "Approved" ? "Pending" : "Approved"

        const payload = {
            bookingId: bookingId,
            status: updatedStatus,
            email: bookingToUpdate.email,
        }

        try {
            const response = await axios.post("http://localhost:8000/approve-booking", payload)
            console.log("Booking status updated:", response.data)

            setBookings((prevBookings) =>
                prevBookings.map((b) => (b._id === bookingId ? { ...b, status: updatedStatus } : b)),
            )
        } catch (error) {
            console.error("Error updating booking status:", error)
        }
    }

    const groupByProductAndUser = (bookings: Booking[]) => {
        return bookings.reduce((acc: any, booking: Booking) => {
            if (!acc[booking.product_id.product_name]) {
                acc[booking.product_id.product_name] = {}
            }
            if (!acc[booking.product_id.product_name][booking.email]) {
                acc[booking.product_id.product_name][booking.email] = []
            }
            acc[booking.product_id.product_name][booking.email].push(booking)
            return acc
        }, {})
    }

    const groupedBookings = groupByProductAndUser(bookings)
    console.log("groupedBookings :>> ", groupedBookings)

    return (
        <div className="overflow-auto shadow-lg rounded-lg bg-white p-5 mt-5">
            <h1 className="text-2xl font-bold text-center mb-4">Box Cricket Provider Panel</h1>
            <div className="flex justify-center space-x-4 mb-4">
                {[
                    { color: "bg-green-200", text: "Your Booked Slot" },
                    { color: "bg-red-100", text: "Slot Reserved by Another User" },
                    { color: "bg-slate-200", text: "Available Slot" },
                ].map((item, index) => (
                    <div key={index} className="flex items-center">
                        <div className={`w-6 h-6 ${item.color} rounded-full mr-2`}></div>
                        <span className="text-sm font-medium">{item.text}</span>
                    </div>
                ))}
            </div>
            {Object.entries(groupedBookings)
                .reverse()
                .map(([productName, userBookings], index) => (
                    <div key={productName} className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 bg-gray-100 p-2 rounded">{`Box Cricket: ${productName}`}</h2>
                        {Object.entries(userBookings as Record<string, Booking[]>).map(([userEmail, bookings]) => {
                            const fname: string = bookings[0]?.user_id?.fname || "Unknown";
                            const lname: any = bookings[0]?.user_id?.lname || "Unknown";
                            const mobileno: any = bookings[0]?.user_id?.mobileno || "Unknown";
                            return (
                                <div key={userEmail} className="mb-6">
                                    <h3 className="text-lg font-medium mb-2">{`UserMail: ${userEmail}`}</h3>
                                    <h3 className="text-lg font-medium mb-2">{`UserName: ${fname} ${lname} `}</h3>
                                    <h3 className="text-lg font-medium mb-2">{`mobileno: ${mobileno} `}</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full table-auto border-collapse border border-gray-200">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    <th className="px-4 py-2 border border-gray-200">Product Name</th>
                                                    <th className="px-4 py-2 border border-gray-200">Time Slots</th>
                                                    <th className="px-4 py-2 border border-gray-200">Booking Date</th>
                                                    <th className="px-4 py-2 border border-gray-200">Approval Status</th>
                                                    <th className="px-4 py-2 border border-gray-200">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bookings.map((booking: Booking) => (
                                                    <tr key={booking._id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-2 border border-gray-200">{booking.product_id.product_name}</td>
                                                        <td className="px-4 py-2 border border-gray-200">
                                                            <div className="text-xs mb-1">ID: {booking._id}</div>
                                                            <div className="flex flex-wrap gap-1">
                                                                {timeSlots.map((slot) => (
                                                                    <div
                                                                        key={slot}
                                                                        className={`px-2 py-1 rounded-full text-xs ${booking.booked_slots.includes(slot)
                                                                            ? "bg-green-200 text-green-800"
                                                                            : allBookings.includes(slot)
                                                                                ? "bg-red-100 text-red-800"
                                                                                : "bg-slate-200 text-gray-700"
                                                                            }`}
                                                                    >
                                                                        {slot}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-2 border border-gray-200">
                                                            {new Date(booking.booking_date).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-4 py-2 border border-gray-200">
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${booking.status === "Approved"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-yellow-100 text-yellow-800"
                                                                    }`}
                                                            >
                                                                {booking.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2 border border-gray-200">
                                                            <Switch
                                                                checked={booking.status == "Approved"}
                                                                onChange={() => toggleApproval(booking._id)}
                                                                className={`${booking.status != "Approved" ? 'bg-blue-300' : 'bg-green-500'}
      relative inline-flex h-6 w-11 items-center rounded-full`}
                                                            >
                                                                <span
                                                                    className={`${booking.status != "Approved" ? 'translate-x-1' : 'translate-x-6'}
        inline-block h-4 w-4 transform bg-white rounded-full transition`}
                                                                />
                                                            </Switch>
                                                        </td>

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ))}
        </div>
    )
}

export default BookedTable

