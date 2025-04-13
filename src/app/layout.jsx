// Context
import { ContextProvider } from './context/AppContext';

// Fonts
import { Roboto, Open_Sans } from 'next/font/google';

// Components
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import HorizontalDivider from './components/dividers/HorizontalDivider';
import SidePanel from './components/sidepanel/SidePanel';

// Styles
import '@/styles/globals.scss';

const roboto = Roboto({
	variable: '--font-roboto',
	subsets: ['latin'],
});

const openSans = Open_Sans({
	variable: '--font-open-sans',
	subsets: ['latin'],
});

export const metadata = {
	title: 'Yoyo Collector',
	description:
		'A public yoyo collection database where users can create, manage, and share their collections with the world',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body className={`${roboto.variable} ${openSans.variable}`}>
				<ContextProvider>
					<Header />
					{/* <SidePanel /> */}
					<main>{children}</main>
					<HorizontalDivider />
					<Footer />
				</ContextProvider>
			</body>
		</html>
	);
}
