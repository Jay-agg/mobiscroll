import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Provider store={appStore}>
      <Body />
    </Provider>
  );
}

export default App;
