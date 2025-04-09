'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

// Create the context provider component
export const ContextProvider = ({ children }) => {
	const [component, setComponent] = useState('home');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalType, setModalType] = useState(null);

	// Returning the context provider with the values
	return (
		<AppContext.Provider
			value={{
				component,
				isModalOpen,
				modalType,
				setComponent,
				setIsModalOpen,
				setModalType,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

// Custom hook to access context
export const useAppContext = () => useContext(AppContext);
