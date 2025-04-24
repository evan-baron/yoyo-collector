// Libraries
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import userService from '@/services/userService';

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
	const cookieStore = await cookies();
	const token = cookieStore.get('session_token')?.value;
	let user = null;

	if (token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			user = await userService.getUserById(decoded.userId);
			if (user?.password) delete user.password;
		} catch (err) {
			console.error('Token authentication error in layout.jsx:', err);
		}
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
