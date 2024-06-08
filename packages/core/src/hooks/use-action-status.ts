"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type Status = "idle" | "pending" | "delayed" | "done" | "error";
type Options = {
	delayTimeout?: number;
};

const defaultOptions: Options = {
	delayTimeout: 5000,
};

export const useActionStatus = <TArgs extends any[], TReturn>(
	f: (...args: TArgs) => Promise<TReturn>,
	options?: Partial<Options>,
) => {
	const opts = { ...defaultOptions, ...options };
	const [status, setStatus] = useState<Status>("idle");
	const [error, setError] = useState<string | null>(null);

	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const promiseRef = useRef<Promise<TReturn> | null>(null);
	const resolveRef = useRef<
		((value: TReturn | PromiseLike<TReturn>) => void) | null
	>(null);
	const rejectRef = useRef<((reason?: any) => void) | null>(null);

	const clearTimeoutRef = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	};

	const action = useCallback(
		async (...args: TArgs) => {
			if (rejectRef.current) {
				// debounce
				rejectRef.current("cancel_pending");
			}

			clearTimeoutRef();

			promiseRef.current = new Promise<TReturn>((resolve, reject) => {
				resolveRef.current = resolve;
				rejectRef.current = reject;
			});

			setStatus("pending");
			setError(null);
			timeoutRef.current = setTimeout(
				() => setStatus("delayed"),
				opts.delayTimeout,
			);

			try {
				const val = await f(...args);
				setStatus("done");
				resolveRef.current?.(val);
			} catch (err) {
				setStatus("error");
				setError(String(err));
				rejectRef.current?.(err);
			} finally {
				clearTimeoutRef();
			}

			return promiseRef.current;
		},
		[f, opts.delayTimeout],
	);

	useEffect(() => {
		return () => {
			clearTimeoutRef();
			if (rejectRef.current) {
				rejectRef.current("component_unmounted");
			}
		};
	}, []);

	const isPending = status === "pending" || status === "delayed";
	const isDelayed = status === "delayed";
	const isError = status === "error";
	const isSuccess = status === "done";

	return { status, error, isPending, isDelayed, isError, isSuccess, action };
};
