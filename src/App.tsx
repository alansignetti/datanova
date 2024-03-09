import LeaveList from "./components/LeaveList";

import { Provider } from "react-redux";
import { store } from "./store/store";
function App() {
  return (
    <>
      <Provider store={store}>
        <LeaveList />
      </Provider>
      ,
    </>
  );
}

export default App;
