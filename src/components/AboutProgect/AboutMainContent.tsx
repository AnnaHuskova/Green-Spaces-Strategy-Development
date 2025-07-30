// import ParticipantsSection from './ParticipantsSection';
// import { Feature } from 'geojson';

// interface Props {
//   participants?:  Feature[];
// }

// const AboutMainContent: React.FC<Props> = ({ participants }) => {
//   if (!participants) return <div>Loading...</div>;

//   const jedi = participants.filter(p => p.properties?.category === 'jedi');
//   const team = participants.filter(p => p.properties?.category === 'team');

//   return (
//     <main className="flex flex-col gap-6">
//       <section id="description">
//         <h1>Вітаємо 👋 на платформі проєкту <b>Green Spaces Strategy Development</b></h1>
//         <p>GSSD – це проєкт, що спрямований на збереження та розвиток міських зелених зон...</p>
//       </section>

//       <ParticipantsSection title="ДЖЕДАЇ міських зелених зон" participants={jedi} />
//       <ParticipantsSection title="КОМАНДА проєкту" participants={team} />
//     </main>
//   );
// };

// export default AboutMainContent;


// import React from 'react';
// import { Feature } from "geojson";
// import ParticipantCard from './ParticipantCard';

// // type Participant = {
// //   type: string;
// //   geometry: {
// //     type: string;
// //     coordinates: [number, number];
// //   };
// //   properties: {
// //     category: string;
// //     city: string;
// //     description: string;
// //     fbLink?: string;
// //     greenAreas: string;
// //     name: string;
// //     orgWeb: string;
// //     organization: string;
// //     otherLink?: string;
// //     personalWeb?: string;
// //     photoUrl: string;
// //     statement: string;
// //   };
// // };

// interface AboutMainContentProps {
//   participants: {
//     type: string;
//     geometry: {
//       type: string;
//       coordinates: [number, number];
//     };
//     properties: any;
//   }[];
// }

// const AboutMainContent: React.FC<AboutMainContentProps> = ({ participants }) => {
//   const jedi = participants.filter(p => p.properties.category === 'jedi');
//   const team = participants.filter(p => p.properties.category === 'team');

//   return (
//     <div className="flex flex-col w-full px-4 md:px-8 lg:px-16">
//       <section className="mb-10">
//         <h2 className="text-lg font-bold mb-4">🧙 ДЖЕДАЇ міських зелених зон</h2>
//         <div className="flex flex-wrap gap-6">
//           {jedi.map((p, i) => (
//             <ParticipantCard key={i} {...p.properties} />
//           ))}
//         </div>
//       </section>

//       <section>
//         <h2 className="text-lg font-bold mb-4">🛠 КОМАНДА проєкту</h2>
//         <div className="flex flex-wrap gap-6">
//           {team.map((p, i) => (
//             <ParticipantCard key={i} {...p.properties} />
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default AboutMainContent;

import React from 'react';
import ParticipantCard from './ParticipantCard';
import { Feature } from 'geojson';

export interface AboutMainContentProps {
  participants: Feature[];
}

const AboutMainContent: React.FC<AboutMainContentProps> = ({ participants }) => {
  if (!participants || participants.length === 0) {
    return (
      <div className="text-center w-full py-8 text-gray-500">
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
      {/* Раздел Джедаї */}
      <section>
        <h2 className="text-2xl font-bold mb-9">🧙 ДЖЕДАЇ міських зелених зон</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {jediParticipants.map((feature: any, idx) => (
            <ParticipantCard key={`jedi-${idx}`} {...feature.properties} />
          ))}
        </div>
      </section>

      {/* Раздел Команда */}
      <section>
        <h2 className="text-2xl font-bold mb-9">🌱 КОМАНДА проєкту</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamParticipants.map((feature: any, idx) => (
            <ParticipantCard key={`team-${idx}`} {...feature.properties} />
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
  //           {...props} // ✅ Передаємо поля у картку
  //         />
  //       );
  //     })}
  //   </div>
  // );
};

export default AboutMainContent;