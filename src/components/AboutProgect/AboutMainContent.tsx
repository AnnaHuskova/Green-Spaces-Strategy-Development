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
    <div className="flex flex-col gap-10 w-full">
    
      <section id="contributors">
        <h2 className="text-2xl font-bold mb-9 font-sans">🧙 ДЖЕДАЇ міських зелених зон</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {jediParticipants.map((feature: any, idx) => (
            <ParticipantCard key={`jedi-${idx}`} {...feature.properties} />
          ))}
        </div>
      </section>

      
      <section id="team">
        <h2 className="text-2xl font-bold mb-9 font-sans">🌱 КОМАНДА проєкту</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {teamParticipants.map((feature: any, idx) => (
            <ParticipantCard key={`team-${idx}`} {...feature.properties}/>
          ))}
        </div>
      </section>
    </div>
  );

  // return (
  //   <div className="flex flex-wrap gap-6 justify-center w-full px-4 md:px-8 lg:px-16">
  //     {participants.map((p: Feature, i: number) => {
  //       // Перевірка properties
  //       const props = p.properties as Record<string, any> | null;

  //       if (!props) return null;

  //       return (
  //         <ParticipantCard
  //           key={i}
  //           {...props} //  Передаємо поля у картку
  //         />
  //       );
  //     })}
  //   </div>
  // );
};

export default AboutMainContent;