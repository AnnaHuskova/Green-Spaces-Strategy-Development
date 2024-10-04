import { memo } from 'react';
import { NavMenu } from '../NavMenu';
import { ReactComponent as Logo } from '../../assets/images/logo-colored.svg';

const Header = memo(() => {
    return (
        <header
            className='flex flex-row justify-between w-full pl-2 md:pl-5 bg-white shadow-md font-sans text-base font-normal'
        >
          <a href="/" target="_self">
            <div>
              <Logo className='block h-11 p-1 md:h-14 w-auto' />
            </div>
          </a>
                  <NavMenu />
          <div className='bg-accent'>
            <h1 className='md:hidden font-sans font-bold text-[12px] mx-3 py-3'>{'<'}GSSD{'>'}</h1>
            <h1 className='hidden md:block font-sans font-bold text-base mx-6 py-4'>{'<'}Green Spaces Strategy Development{'>'}</h1>
          </div>
        </header>
    );
});

export { Header };
