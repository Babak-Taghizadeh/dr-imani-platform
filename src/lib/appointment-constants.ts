export const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  PENDING: { label: "در انتظار پرداخت", variant: "outline" },
  PAYMENT_INITIATED: { label: "در حال پرداخت", variant: "secondary" },
  PAID: { label: "تأیید شده", variant: "default" },
  FAILED: { label: "پرداخت ناموفق", variant: "destructive" },
  CANCELED: { label: "لغو شده", variant: "secondary" },
};
