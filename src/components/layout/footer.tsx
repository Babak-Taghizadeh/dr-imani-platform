import { FOOTER_ITEMS } from "@/lib/constants";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="from-background via-secondary/50 to-primary/10 mt-auto border-t bg-gradient-to-b">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <div className="flex flex-col gap-16 md:flex-row md:justify-between">
          <div className="flex flex-col gap-4">
            <h3 className="text-primary text-3xl font-bold">
              {FOOTER_ITEMS.brand[0].title}
            </h3>
            <p className="text-muted-foreground text-sm font-light tracking-tighter md:text-lg!">
              {FOOTER_ITEMS.brand[1].title}
            </p>
          </div>

          <ul className="hidden flex-col gap-4 md:flex">
            {FOOTER_ITEMS.nav.map((item, index) =>
              index === 0 ? (
                <li key={item.title}>
                  <h5 className="text-primary mb-2 text-xl font-semibold">
                    {item.title}
                  </h5>
                </li>
              ) : (
                <li key={item.title}>
                  <Link
                    href={item.path!}
                    className="text-muted-foreground hover:text-primary transition-colors hover:underline"
                  >
                    {item.title}
                  </Link>
                </li>
              ),
            )}
          </ul>

          <ul className="flex flex-col gap-4">
            {FOOTER_ITEMS.contact.map((item, index) =>
              index === 0 ? (
                <li key={item.title}>
                  <h5 className="text-primary mb-2 text-xl font-semibold">
                    {item.title}
                  </h5>
                </li>
              ) : (
                <li key={item.title}>
                  {item.value ? (
                    <Link
                      className="group text-muted-foreground hover:text-primary flex items-center gap-3 transition-colors"
                      href={item.value}
                      target="_blank"
                    >
                      <span className="transition-transform group-hover:scale-110">
                        {item.icon}
                      </span>
                      <span className="hover:underline">{item.title}</span>
                    </Link>
                  ) : (
                    <p className="text-muted-foreground flex items-center gap-3">
                      <span>{item.icon}</span>
                      {item.title}
                    </p>
                  )}
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="border-primary/10 text-muted-foreground mt-12 border-t pt-8 text-center text-sm">
          <p dir="ltr">
            © {new Date().getFullYear()} Dr. Imani. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
