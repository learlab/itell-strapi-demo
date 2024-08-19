import { Image } from "@itell/ui/client";

/**
 * Image
 * @module Image
 * @param src - The source of the image
 * @param alt - The alt text of the image, **dont foreget this!**
 * @param width - The width of the image, default to 600px
 * @param height - The height of the image, default to 400px
 * @param children nested elements, if provided, will be used as the caption when image is expanded
 * @example
 * <i-image
 * style="aspect-ratio:678/435;"
 * src="https://nbjrajrmujlgxmcvqsge.supabase.co/storage/v1/object/public/strapi/files/1.1.png-e1cb314dd72c8b8360d0cdddc949b81f.png"
 * alt="Illustration of a sea of dark and bright dots (bits) with islands in it"
 * width="678"
 * height="435"
 * />
 */
export const ImageWrapper = ({ children, ...rest }: Image.Props) => {
	return <Image {...rest}>{children}</Image>;
};
