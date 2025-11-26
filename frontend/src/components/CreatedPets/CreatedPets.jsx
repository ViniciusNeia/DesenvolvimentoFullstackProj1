import React, { useContext } from "react";
import styles from "./CreatedPets.module.css";
import { usePetContext } from "../../contexts/PetContext.jsx";
import Card from "../Card/Card.jsx";
import SearchBar from "../SearchBar/SearchBar.jsx";
import { useEffect } from "react";

function CreatedPets() {
    const { createdPets, createdSearch, setCreatedSearch, checkCreatedPetsSearch } = usePetContext();

    const filteredPets = createdPets.filter((pet) => {
        const txt = createdSearch.toLowerCase();
        return (
            pet.name?.toLowerCase().includes(txt) ||
            pet.description?.toLowerCase().includes(txt) ||
            pet.breed?.toLowerCase().includes(txt)
        );
    });

    useEffect(() => {
        checkCreatedPetsSearch(filteredPets, createdSearch);
    }, [createdSearch]);

    return (
        <div className={styles.container}>

            <SearchBar
                placeholder="Buscar seu pet..."
                value={createdSearch}
                onChange={setCreatedSearch}
            />

            <div className={styles.cardsContainer}>
                {filteredPets.map((pet) => (
                    <Card key={pet.id} pet={pet} image={pet.imageUrl} title={pet.name} />
                ))}
            </div>

        </div>
    );
}


export default CreatedPets;
