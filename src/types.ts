export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
  images?: string[]; // Base64 encoded images
};

export type ImageFile = {
  file: File;
  preview: string;
  base64: string;
};
