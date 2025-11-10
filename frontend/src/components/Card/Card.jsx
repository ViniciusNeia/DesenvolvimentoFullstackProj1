import React from "react";
import styles from "./Card.module.css";
import { usePetContext } from "../../contexts/PetContext.jsx";

function capitalizeFirstLetter(str) {
    if (typeof str !== "string" || str.length === 0) {
        return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function Card({
                  image,
                  title,
                  subtitle,
                  description,
                  temperament,
                  lifeSpan,
                  origin,
                  weight,
                  height,
                  species,
                  pet
              }) {
    const { setSelectedPet } = usePetContext();

    const handleClick = () => {
        if (pet) {
            setSelectedPet(pet);
        }
    };
    return (
        <div className={styles.floatingCard} onClick={handleClick} style={{ cursor: pet ? "pointer" : "default" }}>
            {image && (
                <img className={styles.cardImage} src={image} alt={title} />
            )}
            <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{title}</h3>

                {subtitle && (
                    <h4 className={styles.cardSubtitle}>
                        <strong>Group:</strong> {subtitle}
                    </h4>
                )}

                {description && (
                    <p className={styles.cardDescription}>
                        <strong>Bred for:</strong> {description}
                    </p>
                )}

                {temperament && (
                    <p className={styles.cardTemperament}>
                        <strong>Temperament:</strong> {temperament}
                    </p>
                )}

                {origin && (
                    <p className={styles.cardOrigin}>
                        <strong>Origin:</strong> {origin}
                    </p>
                )}

                {lifeSpan && (
                    <p className={styles.cardLifeSpan}>
                        <strong>Life Expectancy:</strong> {lifeSpan}
                    </p>
                )}

                {weight && (
                    <p className={styles.cardWeight}>
                        <strong>Weight:</strong> {weight.metric} kg ({weight.imperial} lbs)
                    </p>
                )}

                {height && (
                    <p className={styles.cardHeight}>
                        <strong>Height:</strong> {height.metric} cm ({height.imperial} in)
                    </p>
                )}

                {species && (
                    <span className={styles.cardSpecies}>
                        {capitalizeFirstLetter(species)}
                    </span>
                )}
            </div>
        </div>
    );
}

export default Card;
