import React from "react";
import AddBlog from "./add-blog";

const AdminHeader = () => {
  return (
    <div className="flex h-16 w-full p-4 lg:w-1/2 items-center justify-between">
      <h1 className="text-2xl font-bold">پنل مدیریت</h1>
      <AddBlog />
    </div>
  );
};

export default AdminHeader;
