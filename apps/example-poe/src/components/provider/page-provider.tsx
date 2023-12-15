"use client";

import { PythonProvider as WebpyProvider } from "@webpy/react";
import { QAProvider } from "../context/qa-context";

const pythonSetupCode = `
import io
import contextlib
`;

export const PageProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<WebpyProvider options={{ setUpCode: pythonSetupCode }}>
			<QAProvider>{children}</QAProvider>
		</WebpyProvider>
	);
};
