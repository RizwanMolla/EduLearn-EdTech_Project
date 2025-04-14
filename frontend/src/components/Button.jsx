// src/components/Button.jsx
const Button = ({ children, className, ...props }) => {
    return (
      <button 
        className={`btn ${className || 'btn-primary btn-wide'}`}
        {...props}
      >
        {children}
      </button>
    );
  };
  
  export default Button;