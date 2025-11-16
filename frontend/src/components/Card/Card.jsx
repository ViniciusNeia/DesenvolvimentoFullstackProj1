import React from "react";
import styles from "./Card.module.css";
import { usePetContext } from "../PetContext.jsx";

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
    const breed = pet?.breedDetails || { temperament, life_span: lifeSpan, origin, weight, height, bred_for: description, breed_group: subtitle };
    const apiDescription = breed.description || breed.temperament || breed.bred_for;
    return (
        <div className={styles.floatingCard} onClick={handleClick} style={{ cursor: pet ? "pointer" : "default" }}>
            {image && (
                <img className={styles.cardImage} src={image} alt={title} />
            )}
            <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{title}</h3>

                {pet?.age && (
                    <p className={styles.cardAge}><strong>Age:</strong> {pet.age}</p>
                )}

                {subtitle || breed.breed_group ? (
                    <h4 className={styles.cardSubtitle}>
                        <strong>Group:</strong> {subtitle || breed.breed_group}
                    </h4>
                ) : null}

                {pet?.description && (
                    <p className={styles.cardDescription}>
                        <strong>Description:</strong> {pet.description}
                    </p>
                )}

                {apiDescription && (
                    <p className={styles.cardApiDescription}>
                        <strong>Breed Info:</strong> {apiDescription}
                    </p>
                )}

                {breed.temperament && (
                    <p className={styles.cardTemperament}>
                        <strong>Temperament:</strong> {breed.temperament}
                    </p>
                )}

                {breed.origin && (
                    <p className={styles.cardOrigin}>
                        <strong>Origin:</strong> {breed.origin}
                    </p>
                )}

                {breed.life_span && (
                    <p className={styles.cardLifeSpan}>
                        <strong>Life Expectancy:</strong> {breed.life_span}
                    </p>
                )}

                {breed.weight && (
                    <p className={styles.cardWeight}>
                        <strong>Weight:</strong> {breed.weight.metric} kg ({breed.weight.imperial} lbs)
                    </p>
                )}

                {breed.height && (
                    <p className={styles.cardHeight}>
                        <strong>Height:</strong> {breed.height.metric} cm ({breed.height.imperial} in)
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
