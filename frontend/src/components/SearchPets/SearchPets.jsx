import React from "react";
import { FaSearch } from "react-icons/fa";
import styles from "./SearchPets.module.css";
import Card from "../Card/Card.jsx";
import CardExpanded from "../CardExpanded/CardExpanded.jsx";
import { usePetContext } from "../PetContext.jsx";

function SearchPets() {
    const {
        species,
        searchValue,
        processedSearchResults,
        selectedPet,
        setSpecies,
        setSearchValue
    } = usePetContext();

    return (
        <div className="container mt-4">
            <div className={styles.searchBarContainer}>
                <div className={styles.icon}>
                    <FaSearch />
                </div>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Type a breed..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <select
                    className={styles.toggleButtonGroup}
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                >
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                </select>
            </div>


            <div className={styles.cardsContainer}>
                {processedSearchResults.map((pet, idx) => (
                    <Card
                        key={pet.id || idx}
                        image={pet.imageUrl}
                        title={pet.displayName}
                        subtitle={pet.breed_group}
                        description={pet.bred_for}
                        temperament={pet.temperament}
                        lifeSpan={pet.life_span}
                        origin={pet.origin}
                        weight={pet.weight}
                        height={pet.height}
                        species={species}
                        pet={pet}
                    />
                ))}
            </div>

            {selectedPet && <CardExpanded />}
        </div>
    );
}

export default SearchPets;
