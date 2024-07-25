export const Runner = () => {
	return (
		<iframe
			title={"runner"}
			id={"runner"}
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

        async function handleEvent(event) {
            if (event.data.type === "run-code") {
                const { code, id, source } = event.data;
                currentId = id;

                if (source === "console") {
                    postLogToParent("source-console", [code], id);
                }

                try {
                    const result = eval(code);
                    if (result !== undefined && result !== "use strict") {
                        postLogToParent("return", [serializeArg(result)], id);
                    }
                } catch (error) {
                    console.error(error.toString());
                    postLogToParent("error", [error.toString()], id);
                }
            }
        }

        window.addEventListener("message", handleEvent);
    </script>
</head>
<body></body>
</html>
`;
