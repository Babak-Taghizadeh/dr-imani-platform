import Footer from "./footer";
import Header from "./header";
import { Providers } from "../providers";
import { Toaster } from "@/components/ui/sonner";
import { FloatingContactButton } from "./floating-contact-button";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Providers>
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <FloatingContactButton />
      <Toaster expand={true} position="top-center" richColors />
    </Providers>
  );
};

export default MainLayout;
