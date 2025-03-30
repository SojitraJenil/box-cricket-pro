import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProductChart = ({ product }: any) => {
  const data = {
    labels: ["Price", "Booking", "Discount Rate", "Rating"],
    datasets: [
      {
        label: product.product_name,
        data: [
          parseFloat(product.product_price),
          parseFloat(product.Product_stock),
          parseFloat(product.Product_dis_rate),
          parseFloat(product.Product_rating),
        ],
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#FF5722"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: `Product Stats: ${product.product_name}` },
    },
  };

  return (
    <div style={{ width: "800px", margin: "auto" }} className="ps-50">
      <Bar data={data} options={options} />
    </div>
  );
};

// Example usage
const sampleProduct = {
  product_name: "Infinity Box",
  product_price: "800",
  Product_stock: "500",
  Product_dis_rate: "5",
  Product_rating: "3",
};

const App = () => {
  return <ProductChart product={sampleProduct} />;
};

export default App;
