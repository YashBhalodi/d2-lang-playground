import React, { FC } from "react";

import Editor from "@monaco-editor/react";
// dummy line
const App: FC<{}> = () => {
  return (
    <Editor
      height={"100vh"}
      defaultLanguage="d2"
      defaultValue="// some comment"
      theme={"vs-dark"}
    />
  );
};

export default App;
