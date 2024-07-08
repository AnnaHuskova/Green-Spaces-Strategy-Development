import { memo } from 'react';
// import { AppBar, Toolbar, Typography, Box } from '@mui/material';
// import { NavMenu } from '../NavMenu';
const Logo = require( "./together-logo.png");


const Footer = memo(() => {
  return <footer className = "flex flex-row min-h-20 justify-between items-center">
    <img className='h-20 w-auto' src={Logo} alt='Логотип "Прямуємо Разом"'/>
    <label className='mx-6 my-4 text-sm text-right'>Платформа Green spaces strategy development створена за підтримки Європейського Союзу<br/>
в рамках Стипендіальної програми для лідерів громадянського суспільства країн Східного партнерства.<br/>
Матеріали, опубліковані на платформі, відображають позицію НебоПоле.Лабс (NeboPole.Labs, ГО)  і не обов’язково відображають позицію Європейського Союзу.</label>
  </footer>
})

export {Footer};
