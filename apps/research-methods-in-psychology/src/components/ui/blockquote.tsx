import { Blockquote } from "@itell/ui/server";

/**
 * Blockquote
 * @module Blockquote
 * @param children blockquote content
 * @param author {string} blockquote author, optional
 * @param role {string} blockquote author role, optional
 * @example
 * <i-blockquote author="John Doe" role="CEO">
 * 	This is a blockquote
 * </i-blockquote>
 */
export const BlockquoteWrapper = ({ children, ...props }: Blockquote.Props) => {
	return <Blockquote {...props}>{children}</Blockquote>;
};
