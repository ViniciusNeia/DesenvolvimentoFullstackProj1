import React from "react";
import { usePetContext } from "../../contexts/PetContext.jsx";
import Card from "../Card/Card.jsx";
import styles from "./CreatedPets.module.css";

function CreatedPets() {
  const { createdPets } = usePetContext();
  if (!createdPets || createdPets.length === 0) return null;
  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {createdPets.map((p) => (
          <Card
            key={p.id}
            image={p.imageUrl}
            title={p.name}
            description={p.description}
            temperament={p.breedDetails?.temperament || p.temperament}
            lifeSpan={p.breedDetails?.life_span || p.life_span}
            origin={p.breedDetails?.origin || p.origin}
            weight={p.breedDetails?.weight || p.weight}
            height={p.breedDetails?.height || p.height}
            species={p.species}
            pet={p}
          />
        ))}
      </div>
    </div>
  );
}

export default CreatedPets;
