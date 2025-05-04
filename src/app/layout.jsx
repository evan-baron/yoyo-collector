// Libraries
import userService from '@/services/userService';
import { validateAndExtendSession } from '@/lib/auth/validateAndExtend';

// Context
import { ContextProvider } from './context/AppContext';

// Fonts
import { Roboto, Open_Sans } from 'next/font/google';

// Components
import Header from './components/header/header';
import Footer from './components/footer/footer';
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

export default async function RootLayout({ children }) {
	const { user_id } = validateAndExtendSession('layout.jsx');

	let user;

	try {
		const userResponse = await userService.getUserById(user_id);

		if (userResponse.password) {
			delete userResponse.password;
		}

		user = userResponse;
	} catch (err) {
		// Handling this silently, but this means there's no active user or token in the browser
	}

	return (
		<html lang='en'>
			<body className={`${roboto.variable} ${openSans.variable}`}>
				<ContextProvider initialUser={user}>
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
