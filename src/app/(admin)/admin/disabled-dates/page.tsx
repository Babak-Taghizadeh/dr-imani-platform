"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/sections/admin/admin-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DisabledDatesPage() {
  const [disabledDates, setDisabledDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchDisabledDates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/disable-dates");
      const data = await res.json();

      if (res.ok) {
        setDisabledDates(data.disabledDates || []);
      }
    } catch (error) {
      console.error("Error fetching disabled dates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisabledDates();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error("لطفاً تاریخ شروع و پایان را وارد کنید");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("تاریخ شروع باید قبل از تاریخ پایان باشد");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/disable-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate,
          endDate,
          reason: reason || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("بازه تاریخ با موفقیت غیرفعال شد");
        if (data.warning) {
          toast.warning(data.warning);
        }
        setStartDate("");
        setEndDate("");
        setReason("");
        fetchDisabledDates();
      } else {
        toast.error(data.error || "خطا در غیرفعال کردن تاریخ");
      }
    } catch (error) {
      console.error("Error submitting disabled dates:", error);
      toast.error("خطایی در غیرفعال کردن تاریخ رخ داد");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <AdminHeader />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>غیرفعال کردن تاریخ</CardTitle>
            <CardDescription>
              بازه‌های تاریخی را برای رزرو غیرفعال کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>تاریخ شروع</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>تاریخ پایان</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>دلیل (اختیاری)</Label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="دلیل غیرفعال کردن این بازه"
                />
              </div>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                غیرفعال کردن
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>تاریخ‌های غیرفعال شده</CardTitle>
            <CardDescription>لیست بازه‌های تاریخی غیرفعال</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : disabledDates.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">
                هیچ تاریخ غیرفعالی وجود ندارد
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>از تاریخ</TableHead>
                    <TableHead>تا تاریخ</TableHead>
                    <TableHead>دلیل</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disabledDates.map((range) => (
                    <TableRow key={range.id}>
                      <TableCell>
                        {format(new Date(range.startDate), "yyyy/MM/dd")}
                      </TableCell>
                      <TableCell>
                        {format(new Date(range.endDate), "yyyy/MM/dd")}
                      </TableCell>
                      <TableCell>{range.reason || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
