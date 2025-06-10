import React from "react";
import AddBlog from "./add-blog";

const AdminHeader = () => {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">پنل مدیریت</h1>
        <p className="text-muted-foreground">مدیریت و ویرایش محتوای وبسایت</p>
      </div>
      <div className="flex items-center">
        <AddBlog />
      </div>
    </div>
  );
};

export default AdminHeader;
