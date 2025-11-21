import React from "react";


export default function ContactsSection() {
  return (
    <section id="contacts" className="mt-16 mb-20">
      <h2 className="text-2xl font-bold mb-9 font-sans border-b pb-1">
        Контакти
      </h2>

      <div className="w-full flex flex-col md:flex-row p-6 gap-6">

        {/* LEFT — Logo */}
        <div className="flex flex-col items-center md:items-start pl-0">
          <div className="flex flex-col items-center">
            <img 
              src="/assets/icons/gssd_logo.svg" 
              alt="GSSD" 
              className="w-20 h-20 object-contain mb-2"
            />
            <div className="text-lg font font-bold">&lt;GSSD&gt;</div>
          </div>
        </div>


        <div className="w-2/4"></div>

        {/* RIGHT — Socials */}
        <div className="w-full md:w-1/4 flex flex-col items-center md:items-end md:justify-between md:ml-auto md:pr-4 mt-6 md:mt-0">

          <div className="flex gap-5 items-center justify-end">

            {/* Facebook */}
            <a 
              href="https://www.facebook.com/profile.php?id=61580252940827"
              target="_blank"
              rel="noreferrer"
              className="group"
            >
              <div
                className="w-7 h-7 bg-black group-hover:bg-accent transition"
                style={{
                  maskImage: "url(/assets/icons/facebook.svg)",
                  WebkitMaskImage: "url(/assets/icons/facebook.svg)",
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskPosition: "center"
                }}
              ></div>
            </a>

            {/* Web */}
            <a 
              href="https://green-spaces-strategy.org.ua/"
              target="_blank"
              rel="noreferrer"
              className="group"
            >
              <div
                className="w-7 h-7 bg-black group-hover:bg-accent transition"
                style={{
                  maskImage: "url(/assets/icons/web.svg)",
                  WebkitMaskImage: "url(/assets/icons/web.svg)",
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskPosition: "center"
                }}
              ></div>

            </a>

            {/* LinkedIn */}
            {/* <a 
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              className="group"
            >
              <div
                className="w-7 h-7 bg-black group-hover:bg-accent transition"
                style={{
                  maskImage: "url(/assets/icons/linkedin.svg)",
                  WebkitMaskImage: "url(/assets/icons/linkedin.svg)",
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskPosition: "center"
                }}
              ></div>
            </a> */}

            {/* YouTube */}
            <a 
              href="https://www.youtube.com/@gssd_ua"
              target="_blank"
              rel="noreferrer"
              className="group"
            >
              <div
                className="w-9 h-9 bg-black group-hover:bg-accent transition"
                style={{
                  maskImage: "url(/assets/icons/youtube.svg)",
                  WebkitMaskImage: "url(/assets/icons/youtube.svg)",
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskPosition: "center"
                }}
              ></div>
            </a>


          </div>

          <div className="mt-6 text-right">
            <div className="text-md mb-1">email</div>
            <div className="text-xl font-semibold">nebopole@ukr.net</div>
          </div>

        </div>
      </div>

      <div className="w-full border-t p-4 flex justify-center text-s mt-4">
        © 2023 - 2025 GSSD || All Rights Reserved
      </div>
    </section>
  );
}
