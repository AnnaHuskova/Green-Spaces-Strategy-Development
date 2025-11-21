import React from 'react';
import ParticipantCard from './ParticipantCard';
import { Feature } from 'geojson';

export interface AboutMainContentProps {
  participants: Feature[];
}

const AboutMainContent: React.FC<AboutMainContentProps> = ({ participants }) => {
  if (!participants || participants.length === 0) {
    return (
      <div className="text-center w-full py-8 text-gray-500 font-sans">
        Даних про учасників немає
      </div>
    );
  }

  const jediParticipants = participants.filter(
    (p: any) => p.properties?.category === 'jedi'
  );
  const teamParticipants = participants.filter(
    (p: any) => p.properties?.category === 'team'
  );

  return (
    <div className="flex flex-col gap-20 w-full mt-20">
  
      <section id="team">
        <h2 className="text-2xl font-bold mb-9 font-sans border-b pb-1">🚀 КОМАНДА проєкту</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {teamParticipants.map((feature: any, idx) => (
            <ParticipantCard key={`team-${idx}`} {...feature.properties}/>
          ))}
        </div>
      </section>
      <section id="contributors">
        <h2 className="text-2xl font-bold mb-9 font-sans border-b pb-1">🧙 ДЖЕДАЇ міських зелених зон</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {jediParticipants.map((feature: any, idx) => (
            <ParticipantCard key={`jedi-${idx}`} {...feature.properties} />
          ))}

        </div>
        {/* CTA блок */}
<div className="w-full flex justify-center mt-16 px-4">
  <div className="
      flex flex-col md:flex-row 
      items-center md:items-center 
      gap-6 md:gap-10
      text-center md:text-right
    ">

    {/* ТЕКСТ */}
    <p className="text-xl font-semibold font-sans leading-tight">
      Якщо Вас турбує<br className="hidden md:block" />
      зебереження зелених просторів<br className="hidden md:block" />
      міста — заповніть 👉
    </p>

    {/* КНОПКА */}
    <a
      href="https://forms.gle/braoFkT7vNWCkYVbA"
      target="_blank"
      rel="noopener noreferrer"
      className="
        px-10 py-4 
        bg-white 
        text-black 
        rounded-2xl 
        text-xl font-bold 
        whitespace-nowrap

        animate-auraBreath    /* ← ПУЛЬСИРУЮЩЕЕ СВЕЧЕНИЕ ВОКРУГ */

        hover:bg-accent       /* ← ЗЕЛЁНАЯ ПРИ HOVER */
        transition-all
      "
    >
      Профіль “Джедая”
    </a>
  </div>
</div>
      </section>

    </div>
  );
};

export default AboutMainContent;