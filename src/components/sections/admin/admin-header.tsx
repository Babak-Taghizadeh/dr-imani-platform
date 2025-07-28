import Image from "next/image";
import Logo from "../../../../public/Logo.png";

const AdminHeader = () => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          داشبورد مدیریت
        </h1>
        <p className="text-muted-foreground text-sm md:text-lg">
          مدیریت و ویرایش محتوای سایت کلینیک دکتر ایمانی
        </p>
      </div>
      <div className="bg-primary hover:bg-primary/90 flex items-center justify-center rounded-2xl p-2 transition-colors">
        <Image
          src={Logo}
          alt="Clinic Logo"
          priority
          quality={90}
          className="h-auto w-full"
          sizes="(max-width: 768px) 80px, 95px"
        />
      </div>
    </div>
  );
};

export default AdminHeader;
