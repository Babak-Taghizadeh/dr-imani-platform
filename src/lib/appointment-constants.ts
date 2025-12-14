export const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  PENDING: { label: "در انتظار پرداخت", variant: "outline" },
  CONFIRMED: { label: "تأیید شده", variant: "default" },
};
