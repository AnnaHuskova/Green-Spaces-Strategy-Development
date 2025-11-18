
import React, { useState } from "react";
import { motion } from "framer-motion";
import birdIcon from "../../assets/icons/bird.svg";

export default function BirdsMorph() {
  const [open, setOpen] = useState(false);
  const isMobile = window.innerWidth < 1200;
  const glowAnimation = `
    @keyframes pulseGlow {
      0% {
        box-shadow: 0 0 4px rgba(0,255,41,0.6), 0 0 10px rgba(34,197,94,0.2);
        border-color: rgba(0,255,41,1);
      }
      50% {
        box-shadow: 0 0 10px rgba(0,255,41,0.4), 0 0 18px rgba(34,197,94,0.4);
        border-color: rgba(0,255,41,1);
      }
      100% {
        box-shadow: 0 0 4px rgba(0,255,41,1), 0 0 10px rgba(34,197,94,0.2);
        border-color: rgba(0,255,41,1);
      }
    }
    `;

  return (
       <motion.div
      layout
      transition={{
        type: "spring",
        stiffness: 160,
        damping: 24,
        mass: 0.8
      }}
      onClick={() => setOpen(!open)}
      className={`
        fixed z-50 cursor-pointer bg-white shadow-xl
        flex flex-col overflow-hidden
        ${open 
          ? "border-0" 
          : "border animate-[pulseGlow_2.2s_ease-in-out_infinite]"
        }
        ${isMobile
          ? `
              right-2
              ${open
                ? "left-0 right-0 bottom-0 w-full h-[75vh] rounded-t-2xl p-6"
                : "bottom-[130px] w-[62px] h-[62px] rounded-full"}
            `
          : `
              top-[250px] right-[12px]
            `
        }
      `}
      style={{
        ...(isMobile
          ? {}
          : {
              borderRadius: open ? 20 : 999,
              width: open ? 360 : 61,
              height: open ? "auto" : 61,
              padding: open ? "24px" : 0,
            }),
      }}
    >

  <style>{glowAnimation}</style>


      {/* === ICON === */}
      <motion.img
        src={birdIcon}
        alt="bird"
        layout
        transition={{ type: "spring", stiffness: 190, damping: 21 }}
        className="pointer-events-none"
        style={{
          width: 54,
          height: 54,
          position: open ? "absolute" : "relative",
          right: open ? 16 : 0,
          top: open ? 16 : 0,
          margin: open ? 0 : "auto",
          filter: open ? "brightness(0) saturate(100%) invert(56%) sepia(78%) saturate(447%) hue-rotate(74deg) brightness(95%) contrast(90%)" : "none",
          opacity: open ? 0.8 : 1,
          
        }}
      />

      {/* === CONTENT === */}
      {open && (
        <motion.div
           initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="mt-16 text-base leading-5 overflow-y-auto pr-2"
          style={{
            maxHeight: isMobile ? "calc(75vh * 0.75)" : "300px",
          }}
        >
          <h2 className="text-lg font-semibold mb-4">
            Чим годувати пташок:
          </h2>

          <div className="space-y-3">
            <p>🐥 <b>Зерноїдні:</b>  Дроблена пшениця, кукурудза, рис, вівсянка, просо. Дроблена квасоля, чечевиця, льон, горох. Насіння клена та ясена. Насіння бур’янів - лободи, кропиви, кінського щавлю, лопуха.</p>
            <p>🐦 <b>Комахоїдні:</b> Сире подрібнене насіння соняшника, кавуна, дині, гарбуза, кабачків. Несолене сало, м'ясо, горіхи.</p>
            <p>🦃 <b>Дрозди:</b> Сушені та свіжі ягоди, фрукти – горобина, бузина, калина, дерен та глід. Натерта морква, гарбуз, яблуко.</p>
            <p>🦅 <b>Вранові:</b> варене і натерте яйце, сир, м'який корм для собак.</p>
            <p>🐦 <b>Дятли:</b> Шишки, жолуді, лісові горіхи, колоті волоські горіхи.</p>
            <p>🦆 <b>Водоплавні:</b> Пшениця, ячмінь, кукурудза, гарбузове насіння.</p>
          </div>

          <p className="mt-6 text-base opacity-80">
            Рекомендації розроблені:{" "}
            <a
              href="https://www.facebook.com/tetdemch"
              target="_blank"
              rel="noreferrer"
              className="text-green-600 underline font-semibold"
            >
              Тетяна Демченко
            </a>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

