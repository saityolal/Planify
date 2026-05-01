import {useState} from "react";
import "./Counter.css";

import CounterButton from "./CounterButton";

export default function Counter() {
    function increaseCounterParentFunction(by){
        setCount(count + by);
    }
    function decreaseCounterParentFunction(by){
        setCount(count - by);
    }
    
  function resetCounterFunction() {
    setCount(0);
  }


  const [count, setCount] = useState(0);
    return (
        <>
         <span className="totalCount">{count}</span>
            <CounterButton incrementMethod={increaseCounterParentFunction} decrementMethod={decreaseCounterParentFunction}/>
            <CounterButton by={2} incrementMethod={increaseCounterParentFunction} decrementMethod={decreaseCounterParentFunction}/>
            <CounterButton by={5} incrementMethod={increaseCounterParentFunction} decrementMethod={decreaseCounterParentFunction} />
            <button className="resetButton" onClick={resetCounterFunction}> Reset </button>
        </>
        


    )

}

