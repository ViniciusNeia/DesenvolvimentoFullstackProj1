import React, { useState } from "react";
import styles from "./CardExpanded.module.css";
import { usePetContext } from "../../contexts/PetContext.jsx";

function CardExpanded() {
  const { selectedPet, setSelectedPet, getImageUrl } = usePetContext();

  const pet = selectedPet;
  if (!pet) return null;

  const image = getImageUrl(pet);
  const breed = pet?.breedDetails || {};
  const apiDescription = breed.description || breed.temperament || breed.bred_for;

  const { deleteCreatedPet, updateCreatedPet } = usePetContext();

  const isLocal = pet.isLocal === true;

  const onClose = () => setSelectedPet(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(pet?.name || "");
  const [editAge, setEditAge] = useState(pet?.age || "");
  const [editDescription, setEditDescription] = useState(pet?.description || "");

  return (
    <div className={styles.overlay}>
      <div className={styles.expandedCard}>
        
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        {image && <img className={styles.cardImage} src={image} alt={pet.name} />}

        <div className={styles.cardBody}>

          {isEditing ? (
            <div className={styles.editFormTop}>
              <label>Nome</label>
              <input value={editName} onChange={(e) => setEditName(e.target.value)} />

              <label>Idade</label>
              <input value={editAge} onChange={(e) => setEditAge(e.target.value)} />

              <label>Descrição</label>
              <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            </div>
          ) : (
            <h2 className={styles.cardTitle}>
              {pet.name}
              {pet.breed && <span className={styles.cardBreed}> {pet.breed}</span>}
            </h2>
          )}

          {breed.temperament && (
            <p className={styles.cardTemperament}><strong>Temperamento:</strong> {breed.temperament}</p>
          )}
          {breed.life_span && (
            <p className={styles.cardLifeSpan}><strong>Expectativa de vida:</strong> {breed.life_span}</p>
          )}
          {breed.origin && (
            <p className={styles.cardOrigin}><strong>Origem:</strong> {breed.origin}</p>
          )}

          {!isEditing && isLocal && (
            <>
              {pet.age && (
                <p className={styles.cardAge}><strong>Idade:</strong> {pet.age}</p>
              )}

              {pet.description && (
                <p className={styles.cardFullDescription}><strong>Descrição:</strong> {pet.description}</p>
              )}
            </>
          )}

          {isLocal && (
            <div className={styles.actionFooter}>
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className={styles.actionButton}
                  >
                    Editar
                  </button>

                  <button
                    onClick={async () => {
                      const ok = await deleteCreatedPet(pet.id);
                      if (ok) onClose();
                    }}
                    className={styles.deleteButton}
                  >
                    Deletar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={async () => {
                      await updateCreatedPet(pet.id, {
                        name: editName,
                        age: editAge,
                        description: editDescription,
                      });
                      setIsEditing(false);
                    }}
                    className={styles.actionButton}
                  >
                    Salvar
                  </button>

                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(pet.name);
                      setEditAge(pet.age);
                      setEditDescription(pet.description);
                    }}
                    className={styles.deleteButton}
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default CardExpanded;
