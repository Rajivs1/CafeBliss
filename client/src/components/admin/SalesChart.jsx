import { useEffect, useRef } from 'react';

const SalesChart = ({ orders = [] }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || orders.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Process data - group orders by date (last 7 days)
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      last7Days.push({
        date: date,
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: 0,
        count: 0
      });
    }

    // Aggregate orders by date
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      
      const dayData = last7Days.find(day => 
        day.date.getTime() === orderDate.getTime()
      );
      
      if (dayData && order.status !== 'cancelled') {
        dayData.revenue += order.totalAmount || 0;
        dayData.count += 1;
      }
    });

    // Chart dimensions
    const padding = 50;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / last7Days.length - 10;

    // Find max value for scaling
    const maxRevenue = Math.max(...last7Days.map(d => d.revenue), 100);

    // Draw axes
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw bars
    last7Days.forEach((day, index) => {
      const barHeight = (day.revenue / maxRevenue) * chartHeight;
      const x = padding + index * (chartWidth / last7Days.length) + 5;
      const y = height - padding - barHeight;

      // Draw bar with gradient
      const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
      gradient.addColorStop(0, '#3498db');
      gradient.addColorStop(1, '#2980b9');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw value on top of bar
      if (day.revenue > 0) {
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`$${day.revenue.toFixed(0)}`, x + barWidth / 2, y - 5);
      }

      // Draw labels
      ctx.fillStyle = '#7f8c8d';
      ctx.font = '11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(day.label, x + barWidth / 2, height - padding + 20);
      
      // Draw order count
      ctx.fillStyle = '#95a5a6';
      ctx.font = '10px Arial';
      ctx.fillText(`${day.count} orders`, x + barWidth / 2, height - padding + 35);
    });

    // Draw title
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Daily Sales (Last 7 Days)', padding, padding - 20);

    // Draw Y-axis labels
    ctx.fillStyle = '#7f8c8d';
    ctx.font = '11px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = (maxRevenue / 5) * i;
      const y = height - padding - (chartHeight / 5) * i;
      ctx.fillText(`$${value.toFixed(0)}`, padding - 10, y + 5);
    }

  }, [orders]);

  if (orders.length === 0) {
    return (
      <div className="sales-chart">
        <h3>Sales Overview</h3>
        <div className="no-data-chart">
          <p>📊 No sales data available yet</p>
          <p className="hint">Orders will appear here once customers start placing them</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sales-chart">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={400}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <style jsx>{`
        .sales-chart {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .sales-chart canvas {
          display: block;
          margin: 0 auto;
        }

        .no-data-chart {
          text-align: center;
          padding: 4rem 2rem;
          color: #7f8c8d;
        }

        .no-data-chart p:first-child {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .hint {
          font-size: 0.9rem;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default SalesChart;
