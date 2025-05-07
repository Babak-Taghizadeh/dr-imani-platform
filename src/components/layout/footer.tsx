import { FOOTER_ITEMS } from "@/lib/constants";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-auto flex flex-col justify-center gap-8 bg-white p-6 text-black md:flex-row md:justify-evenly md:gap-14 md:py-12">
      <div className="flex flex-col gap-3 md:gap-6">
        <h3 className="text-2xl font-bold">{FOOTER_ITEMS.brand[0].title}</h3>
        <p className="text-sm font-light">{FOOTER_ITEMS.brand[1].title}</p>
      </div>
      <ul className="hidden flex-col gap-4 md:flex">
        {FOOTER_ITEMS.nav.map((item, index) =>
          index === 0 ? (
            <li key={item.title}>
              <h5 className="text-xl font-bold">{item.title}</h5>
            </li>
          ) : (
            <li key={item.title}>
              <Link href={item.path!} className="font-light hover:underline">
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
              <h5 className="text-xl font-bold">{item.title}</h5>
            </li>
          ) : (
            <li className="flex items-center gap-2" key={item.title}>
              {item.icon}
              <p className="font-light">{item.title}</p>
            </li>
          ),
        )}
      </ul>
    </footer>
  );
};

export default Footer;
