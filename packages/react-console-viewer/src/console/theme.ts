import styled, { CreateStyled } from "@emotion/styled";
import { chromeDark, chromeLight } from "react-inspector";
import { Context } from "./types";

// @ts-ignore
export default styled as CreateStyled<Context>;

export const getStyles = (variant: "light" | "dark"): Theme => {
	return variant === "light" ? lightTheme : darkTheme;
};

const baseTheme: Theme = {
	PADDING: "4px",
	LOG_BACKGROUND: "transparent",
	LOG_ICON_WIDTH: `${10 / 12}em`,
	LOG_ICON_HEIGHT: `${10 / 12}em`,
	LOG_ICON_BACKGROUND_SIZE: "contain",
	LOG_ICON: "none",
	LOG_AMOUNT_BACKGROUND: "#e5e7eb",
	LOG_AMOUNT_COLOR: "#020617",
	LOG_DEBUG_BACKGROUND: "",
	LOG_DEBUG_BORDER: "",
	LOG_DEBUG_COLOR: "#4D88FF",
	BASE_FONT_FAMILY: "Consolas, Lucida Console, Courier New, monospace",
	BASE_FONT_SIZE: "12px",
	ARROW_FONT_SIZE: `${10 / 12}em`,
	OBJECT_VALUE_STRING_COLOR: "rgb(233,63,59)",
};

const lightTheme: Theme = {
	...baseTheme,
	...chromeLight,
	LOG_COLOR: chromeLight.BASE_COLOR,
	LOG_BORDER: "rgb(236,236,236)",
	LOG_LINK_COLOR: "rgb(66, 66, 66)",
	LOG_WARN_BACKGROUND: "rgb(255,250,220)",
	LOG_WARN_COLOR: "rgb(73,45,2)",
	LOG_WARN_BORDER: "rgb(255,244,181)",
	LOG_WARN_AMOUNT_BACKGROUND: "#ffbb17",
	LOG_WARN_AMOUNT_COLOR: "#8d8f91",
	LOG_ERROR_BACKGROUND: "rgb(255,235,235)",
	LOG_ERROR_BORDER: "rgb(253,204,205)",
	LOG_ERROR_COLOR: "rgb(252,0,5)",
	LOG_ERROR_AMOUNT_BACKGROUND: "#dc2727",
	LOG_ERROR_AMOUNT_COLOR: "#8d8f91",
};

const darkTheme: Theme = {
	...baseTheme,
	...chromeDark,
	LOG_COLOR: chromeDark.BASE_COLOR,
	LOG_BORDER: "rgb(44,44,44)",
	LOG_LINK_COLOR: "rgb(177, 177, 177)",
	LOG_WARN_BACKGROUND: "#332b00",
	LOG_WARN_COLOR: "#ffdc9e",
	LOG_WARN_BORDER: "#650",
	LOG_WARN_AMOUNT_BACKGROUND: "#ffbb17",
	LOG_WARN_AMOUNT_COLOR: "#8d8f91",
	LOG_ERROR_BACKGROUND: "#290000",
	LOG_ERROR_BORDER: "#5b0000",
	LOG_ERROR_COLOR: "#ff8080",
	LOG_ERROR_AMOUNT_BACKGROUND: "#dc2727",
	LOG_ERROR_AMOUNT_COLOR: "#8d8f91",
};

export interface Theme {
	// Log icons
	LOG_ICON_WIDTH?: string | number;
	LOG_ICON_HEIGHT?: string | number;

	// Log colors
	// LOG_ICON => CSS background-image property
	LOG_COLOR?: string;
	LOG_ICON?: string;
	LOG_BACKGROUND?: string;
	LOG_ICON_BACKGROUND_SIZE?: string;
	LOG_BORDER?: string;

	LOG_INFO_COLOR?: string;
	LOG_INFO_ICON?: string;
	LOG_INFO_BACKGROUND?: string;
	LOG_INFO_BORDER?: string;

	LOG_COMMAND_COLOR?: string;
	LOG_COMMAND_ICON?: string;
	LOG_COMMAND_BACKGROUND?: string;
	LOG_COMMAND_BORDER?: string;

	LOG_RESULT_COLOR?: string;
	LOG_RESULT_ICON?: string;
	LOG_RESULT_BACKGROUND?: string;
	LOG_RESULT_BORDER?: string;

	LOG_WARN_COLOR?: string;
	LOG_WARN_ICON?: string;
	LOG_WARN_BACKGROUND?: string;
	LOG_WARN_BORDER?: string;

	LOG_ERROR_COLOR?: string;
	LOG_ERROR_ICON?: string;
	LOG_ERROR_BACKGROUND?: string;
	LOG_ERROR_BORDER?: string;

	// Fonts
	BASE_FONT_FAMILY?: any;
	BASE_FONT_SIZE?: any;
	BASE_LINE_HEIGHT?: any;

	// Spacing
	PADDING?: string;

	// react-inspector
	BASE_BACKGROUND_COLOR?: any;
	BASE_COLOR?: any;

	OBJECT_NAME_COLOR?: any;
	OBJECT_VALUE_NULL_COLOR?: any;
	OBJECT_VALUE_UNDEFINED_COLOR?: any;
	OBJECT_VALUE_REGEXP_COLOR?: any;
	OBJECT_VALUE_STRING_COLOR?: any;
	OBJECT_VALUE_SYMBOL_COLOR?: any;
	OBJECT_VALUE_NUMBER_COLOR?: any;
	OBJECT_VALUE_BOOLEAN_COLOR?: any;
	OBJECT_VALUE_FUNCTION_KEYWORD_COLOR?: any;

	HTML_TAG_COLOR?: any;
	HTML_TAGNAME_COLOR?: any;
	HTML_TAGNAME_TEXT_TRANSFORM?: any;
	HTML_ATTRIBUTE_NAME_COLOR?: any;
	HTML_ATTRIBUTE_VALUE_COLOR?: any;
	HTML_COMMENT_COLOR?: any;
	HTML_DOCTYPE_COLOR?: any;

	ARROW_COLOR?: any;
	ARROW_MARGIN_RIGHT?: any;
	ARROW_FONT_SIZE?: any;

	TREENODE_FONT_FAMILY?: any;
	TREENODE_FONT_SIZE?: any;
	TREENODE_LINE_HEIGHT?: any;
	TREENODE_PADDING_LEFT?: any;

	TABLE_BORDER_COLOR?: any;
	TABLE_TH_BACKGROUND_COLOR?: any;
	TABLE_TH_HOVER_COLOR?: any;
	TABLE_SORT_ICON_COLOR?: any;
	TABLE_DATA_BACKGROUND_IMAGE?: any;
	TABLE_DATA_BACKGROUND_SIZE?: any;

	[style: string]: any;
}
