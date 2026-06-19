const OrderStatus = ({ status }) => {
  const steps = ['pending', 'preparing', 'ready', 'delivered'];
  const currentIndex = steps.indexOf(status);

  return (
    <div className="order-status-tracker">
      {steps.map((step, index) => (
        <div key={step} className="status-step">
          <div className={`step-circle ${index <= currentIndex ? 'active' : ''}`}>
            {index < currentIndex ? '✓' : index + 1}
          </div>
          <span className="step-label">{step}</span>
          {index < steps.length - 1 && (
            <div className={`step-line ${index < currentIndex ? 'active' : ''}`}></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderStatus;
