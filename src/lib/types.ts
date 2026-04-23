export type PortfolioPiece = {
  id: string;
  title: string;
  slug: string;
  caption: string | null;
  writeup: string | null;
  year: number | null;
  category: string | null;
  image_url: string;
  thumbnail_url: string | null;
  alt_text: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type SiteContent = {
  key: string;
  value: string;
  updated_at: string;
};
