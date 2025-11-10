import React from "react";
import styles from "./CardExpanded.module.css";
import { usePetContext } from "../../contexts/PetContext.jsx";

function CardExpanded() {
    const { selectedPet, setSelectedPet, getImageUrl, species } = usePetContext();

    const pet = selectedPet;
    const image = getImageUrl(pet);
    const onClose = () => setSelectedPet(null);
    if (!pet) return null;
    return (
        <div className={styles.overlay}>
            <div className={styles.expandedCard}>
                <button className={styles.closeButton} onClick={onClose}>&times;</button>
                {image && <img className={styles.cardImage} src={image} alt={pet.name} />}
                <div className={styles.cardBody}>
                    <h2 className={styles.cardTitle}>{pet.name}</h2>
                    {pet.breed_group && (
                        <h4 className={styles.cardSubtitle}><strong>Group:</strong> {pet.breed_group}</h4>
                    )}
                    {pet.bred_for && (
                        <p className={styles.cardDescription}><strong>Bred for:</strong> {pet.bred_for}</p>
                    )}
                    {pet.temperament && (
                        <p className={styles.cardTemperament}><strong>Temperament:</strong> {pet.temperament}</p>
                    )}
                    {pet.origin && (
                        <p className={styles.cardOrigin}><strong>Origin:</strong> {pet.origin}</p>
                    )}
                    {pet.life_span && (
                        <p className={styles.cardLifeSpan}><strong>Life Expectancy:</strong> {pet.life_span}</p>
                    )}
                    {pet.weight && (
                        <p className={styles.cardWeight}><strong>Weight:</strong> {pet.weight.metric} kg ({pet.weight.imperial} lbs)</p>
                    )}
                    {pet.height && (
                        <p className={styles.cardHeight}><strong>Height:</strong> {pet.height.metric} cm ({pet.height.imperial} in)</p>
                    )}
                    {species && (
                        <span className={styles.cardSpecies}>{species.charAt(0).toUpperCase() + species.slice(1)}</span>
                    )}
                    {pet.description && (
                        <p className={styles.cardFullDescription}><strong>Description:</strong> {pet.description}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CardExpanded;
