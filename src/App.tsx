import React, { FC, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { SplitPane } from "react-multi-split-pane";
import _ from "lodash";

const App: FC<{}> = () => {
  const [iframeContent, setIframeContent] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentSvgCode = useRef<string>("");
  const hasCompilerError = useRef<boolean>(false);

  const submitCode = async (code: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("https://d2api.fly.dev/getSvg", {
        method: "POST",
        body: JSON.stringify({
          diagramCode: code || "",
        }),
      });
      const htmlCode = await response.text();
      setIframeContent(htmlCode);
      currentSvgCode.current = code;
      hasCompilerError.current = false;
    } catch (e) {
      hasCompilerError.current = true;
    }
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

  const showLoadingBar =
    (isLoading || currentSvgCode.current !== code) &&
    hasCompilerError.current === false;

  return (
    <div className="h-screen w-screen flex flex-1 flex-col">
      {showLoadingBar ? (
        <div className="bg-gradient-to-r from-gray-700 via-zinc-400 to-gray-700 h-2 w-full z-10 background-animate" />
      ) : null}
      <div className="flex flex-1 w-full relative">
        <SplitPane split="vertical" minSize={50}>
          <div
            className={"w-full h-full scrollbar overflow-auto"}
            dangerouslySetInnerHTML={{ __html: iframeContent }}
          />

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
            loading={
              <div className="bg-gradient-to-r from-gray-700 via-zinc-800 to-gray-700 background-animate w-full h-full" />
            }
          />
        </SplitPane>
      </div>
      <div className="py-2 border-t-2 border-gray-200 w-full bg-gray-100 shadow-lg bottom-0 flex justify-center items-center">
        Made by
        <a href="https://github.com/YashBhalodi" className="text-blue-800 mx-1">
          Yash Bhalodi
        </a>
        . See the
        <a
          href="https://github.com/YashBhalodi/d2-lang-playground"
          className="text-blue-800 underline underline-offset-2 mx-1"
        >
          source
        </a>{" "}
        on Github
      </div>
    </div>
  );
};

export default App;
