import { notFound } from "next/navigation";
import  Sidebar  from "./_components/sidebar";
import { getAdmin } from "@/actions/admin";
import Header from "@/components/ui/header";

const AdminLayout = async ({ children }) => {
  const admin = await getAdmin();

  if (!admin.authorized) {
    return notFound();
  }

  return (
    <div className="h-full flex flex-col">
    {/* Fixed Header */}
    <Header isAdminPage={true} />

    {/* Content Area */}
    <div className="flex flex-1 pt-20">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 h-full">
        {children}
      </main>
    </div>
  </div>
);
}

export default AdminLayout;
