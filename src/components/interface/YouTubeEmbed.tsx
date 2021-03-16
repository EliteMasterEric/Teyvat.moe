import React, { FunctionComponent } from 'react';

interface YouTubeEmbedProps {
  id: string;
  width: number;
  height: number;
  start?: number;
  end?: number;
}

/**
 * Displays an embedded YouTube video.
 */
const YouTubeEmbed: FunctionComponent<YouTubeEmbedProps> = ({
  id,
  width,
  height,
  start = null,
  end = null,
}) => {
  const params: string[] = [];
  if (start != null) params.push(`start=${start}`);
  if (end != null) params.push(`end=${end}`);

  let url = `https://www.youtube.com/embed/${id}`;
  if (params.length > 0) url += params.join('&');

  return (
    <iframe
      title="YouTube embed"
      width={width}
      height={height}
      src={url}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};

export default YouTubeEmbed;
