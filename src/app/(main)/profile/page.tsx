import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Suspense } from "react";
import { Metadata } from "next";
import { ProfileForm } from "@/components/sections/profile/profile-form";

export const metadata: Metadata = {
  title: "پروفایل",
  description:
    "مدیریت اطلاعات پروفایل، مشاهده و ویرایش اطلاعات شخصی در کلینیک خواب دکتر ایمانی",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "پروفایل کاربری",
    description: "مدیریت پروفایل و اطلاعات شخصی در کلینیک خواب دکتر ایمانی",
    url: "/profile",
  },
  alternates: {
    canonical: "/profile",
  },
};
import { ProfileFormSkeleton } from "@/components/sections/profile/profile-form-skeleton";
import { getUserById } from "@/utils/users-services";

interface SessionUser {
  id: string;
  role: "user" | "admin";
}

async function getUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as SessionUser).role !== "user") {
    redirect("/login");
  }

  const userId = (session.user as SessionUser).id;

  const user = await getUserById(userId);

  if (!user) {
    redirect("/login");
  }

  return user;
}

export default async function ProfilePage() {
  const user = await getUser();

  return (
    <Suspense fallback={<ProfileFormSkeleton />}>
      <ProfileForm user={user} />
    </Suspense>
  );
}
