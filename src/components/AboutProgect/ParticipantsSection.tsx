import React from 'react';
import ParticipantCard from './ParticipantCard';
import { Feature } from 'geojson';

interface ParticipantsSectionProps {
  title: string;
  participants: Feature[];
  category: string; // "jedi" или "team"
}

const ParticipantsSection: React.FC<ParticipantsSectionProps> = ({ title, participants, category }) => {
  const filtered = participants.filter((p) => (p.properties as any)?.category === category);

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="flex flex-wrap gap-6 justify-center">
        {filtered.map((feature, idx) => {
          const props = feature.properties as any;
          return (
            <ParticipantCard
              key={props._id ?? idx}
              name={props.name}
              greenAreas={props.greenAreas}
              statement={props.statement}
              description={props.description}
              organization={props.organization}
              orgWeb={props.orgWeb}
              city={props.city}
              photoUrl={props.photoUrl}
              fbLink={props.fbLink}
              personalWeb={props.personalWeb}
              LinkedinLink={props.LinkedinLink}
              youTubeLink={props.youTubeLink}
            />
          );
        })}
      </div>
    </section>
  );
};

export default ParticipantsSection;

// import ParticipantCard from './ParticipantCard';
// import { Feature } from 'geojson';

// interface Props {
//   title: string;
//   participants: [];
// }

// const ParticipantsSection: React.FC<Props> = ({ title, participants }) => (
//   <section>
//     <h2 className="text-xl font-bold mb-4">{title}</h2>
//     <div className="grid grid-cols-3 gap-4">
//       {participants.map((p, idx) => (
//         <ParticipantCard key={idx} participant={p} />
//       ))}
//     </div>
//   </section>
// );

// export default ParticipantsSection;