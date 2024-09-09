import "./styles/App.css";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "./redux/example/exampleSlice";

function App() {
   const value = useSelector((state) => state.example.value);
   const dispatch = useDispatch();

   return (
      <>
         <h1>Home Page 2</h1>
         <p>Value: {value}</p>
         <button onClick={() => dispatch(increment())}>Increment</button>
         <button onClick={() => dispatch(decrement())}>Decrement</button>
      </>
   );
}

export default App;
