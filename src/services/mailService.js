import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const supportEmail = 'YoyoCollectorTeam@gmail.com';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.NEXT_PUBLIC_EMAIL,
		pass: process.env.EMAIL_PASSWORD,
	},
});

const getTemplate = (templateName, replacements = {}) => {
	const filePath = path.resolve(
		'services/emailTemplates',
		`${templateName}.html`
	);
	let template = fs.readFileSync(filePath, 'utf8');

	for (let key in replacements) {
		const regex = new RegExp(`{{${key}}}`, 'g');
		template = template.replace(regex, replacements[key]);
	}

	return template;
};

const sendContactForm = async (name, email, message) => {
	const htmlContent = getTemplate('contactForm', {
		name,
		email,
		message,
	});

	const mailOptions = {
		from: process.env.NEXT_PUBLIC_EMAIL,
		to: process.env.PERSONAL_EMAIL,
		subject: `Contact Us Message From ${name}`,
		html: htmlContent,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log('Contact Us message sent successfully');
	} catch (err) {
		console.error('Error sending email: ', err);
	}
};

const sendPasswordResetEmail = async (user, resetToken) => {
	const { email } = user;

	const resetLink = `https://localhost:5173/reset-password?token=${resetToken}`;

	const htmlContent = getTemplate('passwordReset', {
		resetLink,
		token: resetToken,
		supportEmail,
	});

	const mailOptions = {
		from: process.env.NEXT_PUBLIC_EMAIL,
		to: email,
		subject: 'Password Reset Requested',
		html: htmlContent,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log('Password reset email sent successfully');
	} catch (err) {
		console.error('Error sending email: ', err);
	}
};

const sendVerificationEmail = async (user, verificationToken) => {
	const { email } = user;

	const verifyLink = `https://localhost:5173/?token=${verificationToken}`;

	const htmlContent = getTemplate('emailVerification', {
		verifyLink,
		token: verificationToken,
		supportEmail,
	});

	const mailOptions = {
		from: process.env.NEXT_PUBLIC_EMAIL,
		to: email,
		subject: 'Email Verification',
		html: htmlContent,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log('Verification email sent successfully');
	} catch (err) {
		console.error('Error sending email: ', err);
	}
};

export default {
	sendContactForm,
	sendPasswordResetEmail,
	sendVerificationEmail,
};
