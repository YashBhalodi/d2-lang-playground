import React, { FC, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { SplitPane } from "react-multi-split-pane";
import _ from "lodash";

const App: FC<{}> = () => {
  const [iframeContent, setIframeContent] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentSvgCode = useRef<string>("");

  const submitCode = async (code: string) => {
    setIsLoading(true);
    const response = await fetch("http://localhost:8000/getSvg", {
      method: "POST",
      body: JSON.stringify({
        diagramCode: code || "",
      }),
    });
    const htmlCode = await response.text();
    setIframeContent(htmlCode);
    currentSvgCode.current = code;
    setIsLoading(false);
  };

  const debouncedCodeUpdate = _.debounce((code: string) => {
    submitCode(code);
  }, 2000);

  const editorOnChange = (code: string | undefined) => {
    if (_.isUndefined(code)) return;

    setCode(code);
    debouncedCodeUpdate(code);
  };

  return (
    <div className="h-screen w-screen flex flex-1 flex-col">
      {isLoading || currentSvgCode.current !== code ? (
        <div className="bg-gradient-to-r from-gray-700 via-zinc-400 to-gray-700 h-2 w-full z-10 background-animate" />
      ) : null}
      <SplitPane split="vertical" minSize={50}>
        <iframe srcDoc={iframeContent} className={"w-full h-full"}></iframe>

        <Editor
          className="flex-1 text-xl"
          defaultLanguage="d2"
          defaultValue="# refer to https://www.d2lang.com/tour/cheat-sheet for cheatsheet"
          theme={"vs-dark"}
          value={code}
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
            padding: {
              top: 16,
            },
          }}
          onChange={editorOnChange}
          loading={<div className="bg-gray-800 w-full h-full" />}
        />
      </SplitPane>
    </div>
  );
};

export default App;
