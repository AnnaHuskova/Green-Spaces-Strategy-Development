import React from 'react';
import AboutLeftNav from '../../components/AboutProgect/AboutLeftNav';
import AboutRight from '../../components/AboutProgect/AboutRight';
import AboutMainContent from '../../components/AboutProgect/AboutMainContent';
import UpArrow from '../../assets/icons/up-arrow.svg';
import { Feature } from 'geojson';
export interface AboutPageProps {
  participants: Feature[];
}

const AboutPage: React.FC<AboutPageProps> = ({ participants = [] }) => {
  return (
    <div className="flex flex-row h-full w-full">
      <section className="hidden md:block md:w-1/5 p-4">
        <div className="sticky top-4"><AboutLeftNav /></div>

      </section>
    
      <main className="w-full md:w-3/5 p-4">
        <section 
            id="description" 
            className="mt-10 mb-8 text-lg leading-relaxed space-y-4 font-sans"
          >
            <h1 className="text-2xl font">
              <b>Вітаємо</b>👋 на платформі проєкту 
              <b className="ml-1">Green Spaces Strategy Development</b>
            </h1>
            <p className="text-gray-700">
              <b>GSSD</b> – це проєкт, що спрямований на збереження та розвиток міських зелених зон. 
              Інтерактивна платформа створена з метою підвищення обізнаності громади щодо поточного стану 
              та алгоритму дій для розвитку зеленого ландшафту міста.
            </p>
            <p className="text-gray-700">
              Спрощення взаємодії між містянами та органами місцевого самоврядування – 
              важливий крок для діалогу та розвитку міста.
            </p>
        </section>

        <section className='md:mt-10'>
        <AboutMainContent participants={participants} />
        </section>
      </main>

      <section className="hidden md:block md:w-1/5 p-4">
        <AboutRight/>
      </section>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="block sm:hidden fixed bottom-6 right-6 bg-lime-300 p-3 rounded-md shadow-lg"
      >
        <img src={UpArrow} alt="Up" className="w-6 h-6" />
      </button>

    </div>
  );
};

export { AboutPage };




// import { FC } from "react";
// import { Feature } from "geojson";
// import { AboutMainContent } from '../../components/AboutProgect';

// interface AboutPageProps {
//   participants?: Participant[];
// }

// export const AboutPage: FC<AboutPageProps> = ({ participants }) => {
//   return (
//     <div className="flex flex-row h-full w-full">
//       {/* Ліва колонка — Навігація */}
//       <div className="w-1/5 p-4 border-r border-gray-300">
//         <ul className="mt-4 space-y-2">
// 			<li className="text-blue-600 cursor-pointer">Опис</li>
// 			<li className="text-blue-600 cursor-pointer">Контриб’ютори</li>
// 			<li className="text-blue-600 cursor-pointer">Команда</li>
// 			<li className="text-blue-600 cursor-pointer">Контакти</li>
// 			<li className="text-blue-600 cursor-pointer">Партнери</li>
//         </ul>
//       </div>

//       {/* Центральна колонка — Контент */}
//       <div className="w-3/5 p-4">
//         <h1 className="text-2xl font-bold mb-4">Про проєкт</h1>
//         <AboutMainContent participants={participants as Participant[]} />
//       </div>

//       {/* Права колонка — Пуста */}
//       <div className="w-1/5 p-4 border-l border-gray-300">
//         {/* Права панель — пусто */}
//       </div>
//     </div>
//   );
// };

// import React, { useEffect, useState } from 'react';
// import AboutDescription from '../components/AboutPage/AboutDescription';
// import ContributorsSection from '../components/AboutPage/ContributorsSection';
// import TeamSection from '../components/AboutPage/TeamSection';
// import PartnersSection from '../components/AboutPage/PartnersSection';

// export const AboutPage = () => {
//   const [contributors, setContributors] = useState([]);
//   const [team, setTeam] = useState([]);

//   useEffect(() => {
//     fetch('/api/contributors')
//       .then(res => res.json())
//       .then(data => {
//         setContributors(data.filter((p) => p.category === 'jedi'));
//         setTeam(data.filter((p) => p.category === 'team'));
//       });
//   }, []);

//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className="grid grid-cols-[1fr_3fr_1fr] gap-4 flex-grow px-4 py-10">
//         {/* LEFT SIDEBAR: навігація по сторінці */}
//         <aside className="pl-4 pr-2 border-r border-gray-200 text-sm">
//           <ul className="space-y-3 sticky top-20">
//             <li><a href="#about" className="hover:text-green-600">ОПИС</a></li>
//             <li><a href="#contributors" className="hover:text-green-600">КОНТРИБ'ЮТОРИ</a></li>
//             <li><a href="#team" className="hover:text-green-600">КОМАНДА</a></li>
//             <li><a href="#partners" className="hover:text-green-600">ПАРТНЕРИ</a></li>
//           </ul>
//         </aside>

//         {/* CENTER: контент секцій */}
//         <main className="space-y-16 px-6">
//           <section id="about">
//             <AboutDescription />
//           </section>
//           <section id="contributors">
//             <ContributorsSection data={contributors} />
//           </section>
//           <section id="team">
//             <TeamSection data={team} />
//           </section>
//           <section id="partners">
//             <PartnersSection />
//           </section>
//         </main>

//         {/* RIGHT SIDEBAR (вільна секція) */}
//         <div className="pr-4"></div>
//       </div>
//     </div>
//   );
// };