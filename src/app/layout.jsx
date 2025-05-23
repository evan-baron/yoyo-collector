// Libraries
import { cookies } from 'next/headers';
import userService from '@/services/userService';
import likesService from '@/services/likesService';
import sessionService from '@/services/sessionService';
import dayjs from 'dayjs';

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
	let user;
	let likes;

	const cookieStore = await cookies();
	const tokenFromCookie = cookieStore.get('session_token')?.value;

	const token = tokenFromCookie;

	if (token) {
		const response = await sessionService.getSessionByToken(token);

		const { user_id, expires_at, remember_me } = response;

		const tokenValid = dayjs(expires_at).isAfter(dayjs());

		if (!tokenValid) {
			console.log('From layout.jsx: token expired');
		}

		if (token && tokenValid) {
			await sessionService.extendSession(user_id, token, remember_me);
		}

		try {
			const userResponse = await userService.getUserById(user_id);

			if (userResponse.password) {
				delete userResponse.password;
			}

			user = userResponse;

			const { userLikes } = await likesService.getAllLikesByUserId(user_id);

			likes = userLikes;
		} catch (err) {
			// Handling this silently, but this means there's no active user or token in the browser
		}
	}

	return (
		<html lang='en'>
			<body className={`${roboto.variable} ${openSans.variable}`}>
				<ContextProvider initialUser={user} initialLikes={likes}>
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
