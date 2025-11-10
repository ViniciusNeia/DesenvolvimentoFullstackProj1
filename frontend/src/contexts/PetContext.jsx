import React, { createContext, useContext, useState, useRef, useEffect, useMemo } from 'react';
import Popup from '../components/PopUp/Popup.jsx';

const PetContext = createContext();

export const usePetContext = () => {
    const context = useContext(PetContext);
    if (!context) {
        throw new Error('usePetContext must be used within a PetProvider');
    }
    return context;
};

export const PetProvider = ({ children }) => {
    const [species, setSpecies] = useState("dog");
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState("info");

    const debounceTimeout = useRef();

    const showPopupModal = (title, message, type = "info") => {
        setPopupTitle(title);
        setPopupMessage(message);
        setPopupType(type);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setPopupTitle("");
        setPopupMessage("");
        setPopupType("info");
    };

    const handleSearch = async (value = searchValue, specie = species) => {
        try {
            let url = "";
            if (specie === "dog") {
                url = value
                    ? `https://api.thedogapi.com/v1/breeds/search?q=${value}`
                    : `https://api.thedogapi.com/v1/breeds`;
            } else if (specie === "cat") {
                url = value
                    ? `https://api.thecatapi.com/v1/breeds/search?q=${value}`
                    : `https://api.thecatapi.com/v1/breeds`;
            }
            const response = await fetch(url);
            const data = await response.json();
            if (!data || (Array.isArray(data) && data.length === 0)) {
                showPopupModal(
                    "No Results Found",
                    "We couldn't find any pets matching your search. Try searching for a different breed or check your spelling.",
                    "warning"
                );
                setSearchResults([]);
            } else {
                setSearchResults(data);
            }
        } catch (error) {
            showPopupModal(
                "Search Error",
                "There was an error while searching for pets. Please check your internet connection and try again.",
                "error"
            );
            setSearchResults([]);
        }
    };

    const getImageUrl = (pet) => {
        if (pet.reference_image_id) {
            return `https://cdn2.the${species}api.com/images/${pet.reference_image_id}.jpg`;
        }
        return null;
    };

    const processedSearchResults = useMemo(() => {
        return searchResults.map(pet => ({
            ...pet,
            imageUrl: getImageUrl(pet),
            displayName: pet.name || 'Unknown Breed',
            hasImage: !!pet.reference_image_id
        }));
    }, [searchResults, species]);

    useEffect(() => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            handleSearch(searchValue, species);
        }, 500);
        return () => clearTimeout(debounceTimeout.current);
    }, [searchValue, species]);

    const value = {
        species,
        searchValue,
        searchResults,
        processedSearchResults,
        selectedPet,

        setSpecies,
        setSearchValue,
        setSelectedPet,
        handleSearch,
        getImageUrl,
        showPopupModal,
        closePopup
    };

    return (
        <PetContext.Provider value={value}>
            {children}
            <Popup
                isOpen={isPopupOpen}
                onClose={closePopup}
                title={popupTitle}
                message={popupMessage}
                type={popupType}
            />
        </PetContext.Provider>
    );
};
