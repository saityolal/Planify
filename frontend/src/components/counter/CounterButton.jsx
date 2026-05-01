import propTypes from "prop-types";
export default function CounterButton({by,incrementMethod,decrementMethod,}) {
//   function incrementCounterFunction() {
    
//     incrementMethod(by);
//   }

//   function decrementCounterFunction() {
    
//     decrementMethod(by);
//   }

  return (
    <div className="Counter">
      <button className="CounterButton" onClick={() => incrementMethod(by)}>
        +{by}
      </button>
      <button className="CounterButton" onClick={() => decrementMethod(by)}>
        -{by}
      </button>
    </div>
  );
}

CounterButton.propTypes = {
  by: propTypes.number,
};

CounterButton.defaultProps = {
  by: 1,
};
