import React from "react";

const App = ({ type }) => {
  return (
    <div>
      <h1>Hello, {type}!</h1>
      <p>This is a simple React component</p>
    </div>
  );
};

App.defaultProps = {
  type: "CSR",
};

export default App;
