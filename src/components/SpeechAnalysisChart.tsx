import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SpeechAnalysisChartProps {
  data: {
    [key: string]: number;
  };
  title: string;
  color: string;
}

const SpeechAnalysisChart: React.FC<SpeechAnalysisChartProps> = ({ data, title, color }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Occurrences',
        data: Object.values(data),
        backgroundColor: color,
        borderColor: color.replace('0.8', '1'),
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SpeechAnalysisChart;