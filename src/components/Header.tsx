import DarkLogo from '../../public/img/logo-dark.png';
import LightLogo from '../../public/img/logo-light.png';
import ThemeImgDark from '../../public/img/theme-img-dark.png';
import ThemeImgLight from '../../public/img/theme-img-light.png';
import { Props } from './Container';

export default function Header({ isDark, setIsDark }: Props) {
  return (
    <header className="header">
      <Logo
        isDark={isDark}
        setIsDark={setIsDark}
      />
      <Theme
        isDark={isDark}
        setIsDark={setIsDark}
      />
    </header>
  );
}

function Logo({ isDark }: Props) {
  return (
    <img
      src={isDark ? DarkLogo : LightLogo}
      alt="Логотип"
    />
  );
}

function Theme({ isDark, setIsDark }: Props) {
  return (
    <div
      className={`theme-btn ${isDark ? 'dark' : 'light'}`}
      onClick={setIsDark}>
      <img
        src={isDark ? ThemeImgDark : ThemeImgLight}
        alt="Смена темы"
      />
    </div>
  );
}
