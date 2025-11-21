import React from "react";
import epcsf from "../../assets/partners/epcsf.png";
import eu from "../../assets/partners/eu.png";
import pcsc from "../../assets/partners/PCSC.svg";
import houseEurope from "../../assets/partners/houseeurope.png";

export default function PartnersSection() {
  return (
    <section id="partners" className="mt-16 mb-10">
      <h2 className="text-2xl font-bold mb-9 font-sans border-b pb-1">
        Партнери
      </h2>

      <div className="flex flex-wrap justify-center gap-8 mt-6">
        <img src={epcsf} alt="EPCSF" className="h-10 object-contain" />
        <img src={pcsc} alt="EPCSF" className="h-14 object-contain" />
        <img src={eu} alt="EU" className="h-14 object-contain" />
        <img src={houseEurope} alt="House of Europe" className="h-14 object-contain" />
      </div>
    </section>
  );
}
