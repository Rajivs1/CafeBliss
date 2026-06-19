import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

const OrderCard = ({ order }) => {
  const getStatusClass = (status) => {
    const statusMap = {
      pending: 'status-pending',
      preparing: 'status-preparing',
      ready: 'status-ready',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    return statusMap[status] || '';
  };

  return (
    <div className="order-card">
      <div className="order-header">
        <h3>Order #{order._id.slice(-6)}</h3>
        <span className={`order-status ${getStatusClass(order.status)}`}>
          {order.status}
        </span>
      </div>
      <div className="order-items">
        {order.items.map((item, idx) => (
          <div key={idx} className="order-item">
            <span>{item.name} x {item.quantity}</span>
            <span>{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="order-footer">
        <p>Total: {formatCurrency(order.totalAmount || order.total || 0)}</p>
        <p className="order-date">{formatDate(order.createdAt)}</p>
      </div>
    </div>
  );
};

export default OrderCard;
