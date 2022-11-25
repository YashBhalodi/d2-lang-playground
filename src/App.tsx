import React, { FC, useState } from "react";
import Editor from "@monaco-editor/react";
import _ from "lodash";
import { SplitPane } from "react-multi-split-pane";

const App: FC<{}> = () => {
  const [iframeContent, setIframeContent] = useState<string>("<div></div>");

  const submitCode = async (code: string | undefined) => {
    const response = await fetch("http://localhost:8000/getSvg", {
      method: "POST",
      body: JSON.stringify({
        diagramCode: code || "",
      }),
    });
    const htmlCode = await response.text();
    setIframeContent(htmlCode);
  };

  const editorOnChange = _.debounce((code: string | undefined) => {
    submitCode(code);
  }, 2000);

  return (
    <div className="h-screen w-screen flex flex-1 flex-col">
      <SplitPane split="vertical" minSize={50}>
        <iframe srcDoc={iframeContent} className={"w-full h-full"}></iframe>

        <Editor
          className="flex-1 text-xl"
          defaultLanguage="d2"
          defaultValue="# refer to https://www.d2lang.com/tour/cheat-sheet for cheatsheet"
          theme={"vs-dark"}
          options={{
            fontSize: 16,
            fontFamily: "Fira Code",
            fontLigatures: true,
            wordWrap: "on",
            minimap: {
              enabled: false,
            },
            contextmenu: false,
            formatOnType: true,
            tabSize: 2,
          }}
          onChange={editorOnChange}
        />
      </SplitPane>
    </div>
  );
};

export default App;
