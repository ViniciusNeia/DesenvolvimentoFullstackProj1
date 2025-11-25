import React, { useState } from "react";
import styles from "./CardExpanded.module.css";
import { usePetContext } from "../../contexts/PetContext.jsx";

function CardExpanded() {
  const {
    selectedPet,
    setSelectedPet,
    getImageUrl,
    deleteCreatedPet,
    updateCreatedPet
  } = usePetContext();

  const pet = selectedPet;
  if (!pet) return null;

  const image = getImageUrl(pet);

  const breed = pet?.breedDetails || {
    description: pet.description,
    temperament: pet.temperament,
    life_span: pet.life_span,
    origin: pet.origin,
    bred_for: pet.bred_for,
    breed_group: pet.breed_group,
    weight: pet.weight,
    height: pet.height
  };

  const apiDescription =
    breed.description ||
    breed.bred_for ||
    breed.temperament;

  const isLocal = pet.isLocal === true;
  const onClose = () => setSelectedPet(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(pet.name || "");
  const [editAge, setEditAge] = useState(pet.age || "");
  const [editDescription, setEditDescription] = useState(pet.description || "");

  return (
    <div className={styles.overlay}>
      <div className={styles.expandedCard}>

        <button className={styles.closeButton} onClick={onClose}>&times;</button>

        {image && (
          <img className={styles.cardImage} src={image} alt={pet.name} />
        )}

        <div className={styles.cardBody}>

          {!isEditing ? (
            <h2 className={styles.cardTitle}>
              {pet.name}
              {pet.breed && <span className={styles.cardBreed}> – {pet.breed}</span>}
            </h2>
          ) : (
            <div className={styles.editFormTop}>
              <label>Nome</label>
              <input value={editName} onChange={(e) => setEditName(e.target.value)} />

              <label>Idade</label>
              <input value={editAge} onChange={(e) => setEditAge(e.target.value)} />

              <label>Descrição</label>
              <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            </div>
          )}

          {apiDescription && (
            <section className={styles.section}>
              <h3>Sobre</h3>
              <p>{apiDescription}</p>
            </section>
          )}

          <section className={styles.section}>
            <h3>Características</h3>

            {breed.temperament && (
              <p><strong>Temperamento:</strong> {breed.temperament}</p>
            )}

            {breed.life_span && (
              <p><strong>Expectativa de Vida:</strong> {breed.life_span}</p>
            )}

            {breed.origin && (
              <p><strong>Origem:</strong> {breed.origin}</p>
            )}

            {breed.weight && (
              <p>
                <strong>Peso:</strong> {breed.weight.metric} kg
                <span className={styles.lightText}> ({breed.weight.imperial} lbs)</span>
              </p>
            )}

            {breed.height && (
              <p>
                <strong>Altura:</strong> {breed.height.metric} cm
                <span className={styles.lightText}> ({breed.height.imperial} in)</span>
              </p>
            )}
          </section>

          {isLocal && !isEditing && (
            <section className={styles.section}>
              <h3>Informações do Pet</h3>

              {pet.age && <p><strong>Idade:</strong> {pet.age}</p>}

              {pet.description && (
                <p><strong>Descrição:</strong> {pet.description}</p>
              )}
            </section>
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
                        description: editDescription
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
