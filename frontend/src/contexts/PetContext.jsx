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
    const [createdPets, setCreatedPets] = useState([]);

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
        if (!pet){
            return null;
        }
        if (pet.imageUrl){ 
            return pet.imageUrl;
        }
        const petSpecies = pet.species || species || 'dog';
        if (pet.reference_image_id) {
            return `https://cdn2.the${petSpecies}api.com/images/${pet.reference_image_id}.jpg`;
        }
        const refId = pet.breedDetails?.reference_image_id || pet.breedDetails?.image?.id || pet.image?.id;
        if (refId) return `https://cdn2.the${petSpecies}api.com/images/${refId}.jpg`;
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


    useEffect(() => {
        let mounted = true;
        async function loadCreatedPets() {
            try {
                const resp = await fetch('/api/pets', { credentials: 'include' });
                if (!mounted) return;
                if (resp.status === 401) {
                    return;
                }
                if (!resp.ok) {
                    const err = await resp.json().catch(() => ({}));
                    showPopupModal('Erro', err.error || 'Falha ao carregar pets', 'error');
                    return;
                }
                const data = await resp.json();
                const list = Array.isArray(data) ? data : [];

    
                async function enrichPet(p) {
                    const petCopy = { ...p };
                    const specie = petCopy.species || 'dog';
                    const makeImageUrl = (b) => {
                        if (!b) return null;
                        const id = b.reference_image_id || b.image?.id;
                        if (!id) return null;
                        return `https://cdn2.the${specie}api.com/images/${id}.jpg`;
                    };

                    if (petCopy.breedDetails) {
                        petCopy.imageUrl = petCopy.imageUrl || makeImageUrl(petCopy.breedDetails);
                        return petCopy;
                    }

                    try {
                        const apiBase = specie === 'dog' ? 'https://api.thedogapi.com/v1' : 'https://api.thecatapi.com/v1';
                        const q = encodeURIComponent(petCopy.breed || '');
                        if (!q) return petCopy;
                        const resp2 = await fetch(`${apiBase}/breeds/search?q=${q}`);
                        if (!resp2.ok) return petCopy;
                        const arr = await resp2.json();
                        if (Array.isArray(arr) && arr.length > 0) {
                            const b = arr[0];
                            petCopy.breedDetails = b;
                            petCopy.imageUrl = makeImageUrl(b);
                        }
                    } catch (err) {
                        console.error('enrichPet error', err);
                    }
                    return petCopy;
                }

                const enriched = await Promise.all(list.map(enrichPet));
                setCreatedPets(enriched);
            } catch (err) {
                console.error('loadCreatedPets error', err);
            }
        }
        loadCreatedPets();
        return () => { mounted = false; };
    }, []);

    const deleteCreatedPet = async (petId) => {
        try {
            const resp = await fetch(`/api/pets/${petId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!resp.ok) {
                const err = await resp.json().catch(() => ({}));
                throw new Error(err.error || 'Erro ao deletar pet');
            }
            setCreatedPets(prev => prev.filter(p => p.id !== petId));
            if (selectedPet?.id === petId) setSelectedPet(null);
            showPopupModal('Sucesso', 'Pet deletado', 'success');
            return true;
        } catch (err) {
            console.error('deleteCreatedPet error', err);
            showPopupModal('Erro', err.message || 'Erro ao deletar pet', 'error');
            return false;
        }
    };

    const updateCreatedPet = async (petId, updates) => {
        try {
            const resp = await fetch(`/api/pets/${petId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updates),
            });
            if (!resp.ok) {
                const err = await resp.json().catch(() => ({}));
                throw new Error(err.error || 'Erro ao atualizar pet');
            }
            const updated = await resp.json();
            setCreatedPets(prev => prev.map(p => (p.id === petId ? { ...p, ...updated } : p)));
            if (selectedPet?.id === petId) setSelectedPet(prev => ({ ...prev, ...updated }));
            showPopupModal('Sucesso', 'Pet atualizado', 'success');
            return updated;
        } catch (err) {
            console.error('updateCreatedPet error', err);
            showPopupModal('Erro', err.message || 'Erro ao atualizar pet', 'error');
            throw err;
        }
    };

    const value = {
        species,
        searchValue,
        searchResults,
        processedSearchResults,
        selectedPet,
        createdPets,

        setSpecies,
        setSearchValue,
        setSelectedPet,
        setCreatedPets,
        addCreatedPet: (pet) => setCreatedPets(prev => [pet, ...prev]),
        deleteCreatedPet,
        updateCreatedPet,
        loadCreatedPets: async () => {
            try {
                const resp = await fetch('/api/pets', { credentials: 'include' });
                if (!resp.ok) return;
                const data = await resp.json();
                const list = Array.isArray(data) ? data : [];
                const enrichPet = async (p) => {
                    const petCopy = { ...p };
                    const specie = petCopy.species || 'dog';
                    const makeImageUrl = (b) => {
                        if (!b) return null;
                        const id = b.reference_image_id || b.image?.id;
                        if (!id) return null;
                        return `https://cdn2.the${specie}api.com/images/${id}.jpg`;
                    };
                    if (petCopy.breedDetails) {
                        petCopy.imageUrl = petCopy.imageUrl || makeImageUrl(petCopy.breedDetails);
                        return petCopy;
                    }
                    try {
                        const apiBase = specie === 'dog' ? 'https://api.thedogapi.com/v1' : 'https://api.thecatapi.com/v1';
                        const q = encodeURIComponent(petCopy.breed || '');
                        if (!q) return petCopy;
                        const resp2 = await fetch(`${apiBase}/breeds/search?q=${q}`);
                        if (!resp2.ok) return petCopy;
                        const arr = await resp2.json();
                        if (Array.isArray(arr) && arr.length > 0) {
                            const b = arr[0];
                            petCopy.breedDetails = b;
                            petCopy.imageUrl = makeImageUrl(b);
                        }
                    } catch (err) {
                        console.error('enrichPet error', err);
                    }
                    return petCopy;
                };
                const enriched = await Promise.all(list.map(enrichPet));
                setCreatedPets(enriched);
            } catch (err) {
                console.error('loadCreatedPets error', err);
            }
        },
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
