import React from 'react';

export type Participant = {
  category?: string; // "jedi" или "team"
  name?: string;
  greenAreas?: string;
  statement?: string;
  description?: string;
  organization?: string;
  orgWeb?: string;
  city?: string;
  photoUrl?: string;
  fbLink?: string;
  personalWeb?: string;
  LinkedinLink?: string;
  youTubeLink?: string;
};

const ParticipantCard: React.FC<Participant> = ({
  category,
  name,
  greenAreas,
  statement,
  description,
  organization,
  orgWeb,
  city,
  photoUrl,
  fbLink,
  personalWeb,
  LinkedinLink,
  youTubeLink,
  
}) => {

  const getPhotoSrc = (url?: string) => {
  if (!url) return "/assets/icons/default-avatar.svg";

  if (url.startsWith("http")) return url;

  return `/participants/${url}`; // <= путь от public/
};


  return (
    <div className="border-1 border-cyan-300 rounded-3xl p-3 flex flex-col items-center w-full md:w-108 bg-white shadow-md">
      <img
        src={getPhotoSrc(photoUrl)}
        alt={name || "No name"}
        className="w-48 h-48 object-cover rounded-full mb-4"
      />
      <h2 className="text-xl font-bold text-center">{name || "Без імені"}</h2>
      <p className="text-lg text-center mt-2">🌳 {greenAreas || "Невідомо"}</p>
      <p className="italic text-center text-sm mt-1 mb-2">“{statement || "</>"}”</p>
      <p className="text-center text-md">{description || "</>"}
      </p>{organization && (
        <p className="mt-1 text-center">
          <a href={orgWeb || "#"} target="_blank" rel="noreferrer" className="underline">
            {organization}
          </a>
        </p>
      )}
      {city && <p className="text-center">{`м. ${city}`}</p>}

          <div className="flex justify-center mt-3 gap-4">
            {fbLink && fbLink.trim() && (
              <a href={fbLink} target="_blank" rel="noreferrer">
                <img src="/assets/icons/facebook.svg" alt="Facebook" className="w-6 h-6" />
              </a>
            )}

            {personalWeb && personalWeb.trim() && (
              <a href={personalWeb} target="_blank" rel="noreferrer">
                <img src="/assets/icons/web.svg" alt="Website" className="w-6 h-6" />
              </a>
            )}

            {LinkedinLink && LinkedinLink.trim() && (
              <a href={LinkedinLink} target="_blank" rel="noreferrer">
                <img src="/assets/icons/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
              </a>
            )}

            {youTubeLink && youTubeLink.trim() && (
              <a href={youTubeLink} target="_blank" rel="noreferrer">
                <img src="/assets/icons/youtube.svg" alt="YouTube" className="w-6 h-6" />
              </a>
            )}
          </div>
    </div>
  );
};

export default ParticipantCard;

