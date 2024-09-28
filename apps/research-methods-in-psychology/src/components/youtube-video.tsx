import { YouTubeEmbed } from "@next/third-parties/google";

type Props = {
  videoid: string;
};

export const YoutubeVideo = ({ videoid }: Props) => {
  return (
    <div className="my-8 flex items-center justify-center">
      <YouTubeEmbed videoid={videoid} width={800} height={400} />
    </div>
  );
};
