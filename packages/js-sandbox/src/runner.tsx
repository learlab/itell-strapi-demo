export const runnerId = "runner";
export const Runner = () => {
	return (
		<iframe
			title={"runner"}
			id={runnerId}
			sandbox="allow-scripts"
			className="hidden"
			srcDoc={srcDoc}
		/>
	);
};

const srcDoc = `
<html>
<head>
    <script>
        let currentId = null;
        const originalConsole = { ...console };
        const methods = ["log", "debug", "info", "warn", "error", "table", "clear", "time", "timeEnd", "count", "assert", "dir"];

        methods.forEach(method => {
            console[method] = (...args) => {
                originalConsole[method].apply(console, args);
                postLogToParent(method, args, currentId);
            };
        });

        function postLogToParent(method, args, id) {
            window.parent.postMessage({
                type: "log",
                id,
                log: {
                    method,
                    data: args.map(serializeArg)
                }
            }, "*");
        }

        function serializeArg(arg) {
            if (arg instanceof Promise) return "Promise { <pending> }";
            if (typeof arg === "object") return structuredClone(arg);
            if (typeof arg === "function") return arg.toString();
            return arg;
        }

        window.alert = (message) => {
            window.parent.postMessage({
                type: "alert",
                message,
                id: currentId
            }, "*");
        };

        window.prompt = (message, defaultValue) => {
            return new Promise((resolve) => {
                window.parent.postMessage({
                    type: "prompt",
                    message,
                    defaultValue,
                    id: currentId
                }, "*");

                const handleResponse = (event) => {
                    if (event.data.type === "prompt-response" && event.data.id === currentId) {
                        window.removeEventListener("message", handleResponse);
                        resolve(event.data.response);
                    }
                };
                window.addEventListener("message", handleResponse);
            });
        };

        window.confirm = (message) => {
            return new Promise((resolve) => {
                window.parent.postMessage({
                    type: "confirm",
                    message,
                    id: currentId
                }, "*");

                const handleResponse = (event) => {
                    if (event.data.type === "confirm-response" && event.data.id === currentId) {
                        window.removeEventListener("message", handleResponse);
                        resolve(event.data.response);
                    }
                };
                window.addEventListener("message", handleResponse);
            });
        };

        window.addEventListener("message", async (event) => {
            if (event.data.type === "run-code") {
                const { code, id, source } = event.data;
                currentId = id;

                if (source === "console") {
                    postLogToParent("source-console", [code], id);
                }

                try {
                    const result = await eval?.(code);
                    if (result !== undefined && result !== "use strict") {
                        postLogToParent("return", [serializeArg(result)], id);
                    }
                } catch (error) {
                    console.error(error.toString());
                    postLogToParent("error", [error.toString()], id);
                }
            }
        });
    </script>
</head>
<body></body>
</html>
`;
