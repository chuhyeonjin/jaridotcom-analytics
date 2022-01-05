export interface embed {
  title?: string;
  type?: string;
  description?: string;
  url?: string;
  timestamp?: Date;
  color?: number;
  footer?: embedFooter;
  image?: embedImage;
  thumbnail?: embedThumbnail;
  video?: embedVideo;
  provider?: embedProvider;
  author?: embedAuthor;
  fields?: embedField[];
}

export interface embedThumbnail {
  url: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface embedVideo {
  url?: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface embedImage {
  url: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface embedProvider {
  name?: string;
  url?: string;
}

export interface embedAuthor {
  name: string;
  url?: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

export interface embedFooter {
  text: string;
  icon_url: string;
  proxy_icon_url: string;
}

export interface embedField {
  name: string;
  value: string;
  inline?: boolean;
}
