export interface Blog {
  id: string;
  title: string;
  status: "ذخیره شده" | "منتشر شده";
  content: string;
  createdAt: string;
}
