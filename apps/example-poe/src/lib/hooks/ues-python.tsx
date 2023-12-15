import { PythonContext } from "@webpy/react";
import { useContext } from "react";

export const usePython = () => {
	return useContext(PythonContext);
};
