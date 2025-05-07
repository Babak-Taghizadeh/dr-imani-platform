import MapWrapper from "@/components/sections/map-wrapper";
import { CONTACT_ITEMS } from "@/lib/constants";

const Contact = () => {
  return (
    <section className="bg-foreground text-background flex min-h-[575px] flex-col gap-12 px-8 py-12 md:justify-center md:gap-16 lg:flex-row">
      <div className="relative z-50 h-[40dvh] w-full self-center md:w-[80%] lg:min-h-[50dvh]">
        <MapWrapper />
      </div>
      <ul className="flex flex-col md:flex-1/2 md:gap-4">
        {CONTACT_ITEMS.map((item, index) =>
          index == 0 ? (
            <li key={item.title}>
              <h4 className="mb-4 text-3xl font-bold">{item.title}</h4>
            </li>
          ) : (
            <li
              className="flex items-center gap-4 py-2 lg:p-5"
              key={item.title}
            >
              <div className="rounded-md bg-orange-400 p-4">{item.icon}</div>
              <div>
                <h5 className="text-xl font-semibold">{item.title}</h5>
                <p className="mt-2 font-light text-gray-500">{item.desc}</p>
              </div>
            </li>
          ),
        )}
      </ul>
    </section>
  );
};

export default Contact;
