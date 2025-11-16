import React, { useState } from "react";
import styles from "./CardExpanded.module.css";
import { usePetContext } from "../PetContext.jsx";

function CardExpanded() {
    const { selectedPet, setSelectedPet, getImageUrl, species } = usePetContext();

    const pet = selectedPet;
    const image = getImageUrl(pet);
        const breed = pet?.breedDetails || pet || {};
        const apiDescription = breed.description || breed.temperament || breed.bred_for;
        const { deleteCreatedPet, updateCreatedPet } = usePetContext();
        const petSpecies = pet?.species || species || '';
    const isLocal = !!pet?.ownerUid;
    const onClose = () => setSelectedPet(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(pet?.name || "");
    const [editAge, setEditAge] = useState(pet?.age || "");
    const [editDescription, setEditDescription] = useState(pet?.description || "");
    if (!pet) return null;
    return (
        <div className={styles.overlay}>
            <div className={styles.expandedCard}>
                <button className={styles.closeButton} onClick={onClose}>&times;</button>
                {image && <img className={styles.cardImage} src={image} alt={pet.name} />}
                <div className={styles.cardBody}>
                    {isLocal && petSpecies && (
                        <div className={styles.topBadgeContainer}>
                            <span className={styles.cardSpecies}>{petSpecies.charAt(0).toUpperCase() + petSpecies.slice(1)}</span>
                        </div>
                    )}

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
                        (!isLocal) ? (
                            <>
                                        <h2 className={styles.cardTitle}>{petSpecies ? petSpecies.charAt(0).toUpperCase() + petSpecies.slice(1) : ''}</h2>
                                        {(() => {
                                            const breedName = pet?.name || breed?.name || '';
                                            if (!breedName) return null;
                                            if (breedName === (petSpecies || '')) return null;
                                            return <h4 className={styles.cardSubtitle}>{breedName}</h4>;
                                        })()}
                            </>
                        ) : (
                            (() => {
                                const displayBreed = pet?.breed || breed?.name || "";
                                return (
                                    <h2 className={styles.cardTitle}>
                                        {pet.name}
                                        {displayBreed && (
                                            <span className={styles.cardBreed}> {displayBreed}</span>
                                        )}
                                    </h2>
                                );
                            })()
                        )
                    )}

                    {breed.breed_group && (
                        <h4 className={styles.cardSubtitle}><strong>Group:</strong> {breed.breed_group}</h4>
                    )}
                    {breed.bred_for && (
                        <p className={styles.cardDescription}><strong>Bred for:</strong> {breed.bred_for}</p>
                    )}
                    {breed.temperament && (
                        <p className={styles.cardTemperament}><strong>Temperament:</strong> {breed.temperament}</p>
                    )}
                    {breed.origin && (
                        <p className={styles.cardOrigin}><strong>Origin:</strong> {breed.origin}</p>
                    )}
                    {breed.life_span && (
                        <p className={styles.cardLifeSpan}><strong>Life Expectancy:</strong> {breed.life_span}</p>
                    )}
                    {breed.weight && (
                        <p className={styles.cardWeight}><strong>Weight:</strong> {breed.weight.metric} kg ({breed.weight.imperial} lbs)</p>
                    )}
                    {breed.height && (
                        <p className={styles.cardHeight}><strong>Height:</strong> {breed.height.metric} cm ({breed.height.imperial} in)</p>
                    )}

                    {(!isLocal) ? (
                        apiDescription && (
                            <p className={styles.cardFullDescription}><strong>Breed Info:</strong> {apiDescription}</p>
                        )
                    ) : (
                        !isEditing && (
                            <>
                                {pet?.age && (
                                    <p className={styles.cardAge}><strong>Age:</strong> {pet.age}</p>
                                )}

                                {pet.description && (
                                    <p className={styles.cardFullDescription}><strong>Your description:</strong> {pet.description}</p>
                                )}

                                {apiDescription && (
                                    <p className={styles.cardFullDescription}><strong>Breed Info:</strong> {apiDescription}</p>
                                )}
                            </>
                        )
                    )}
            {isLocal && (
                <div className={styles.actionFooter}>
                    {!isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(true)} className={styles.actionButton}>Editar</button>
                            <button onClick={async () => { const ok = await deleteCreatedPet(pet.id); if (ok) onClose(); }} className={styles.deleteButton}>Deletar</button>
                        </>
                    ) : (
                        <>
                            <button onClick={async () => {
                                try {
                                    await updateCreatedPet(pet.id, { name: editName, age: editAge, description: editDescription });
                                    setIsEditing(false);
                                } catch (err) {
                                    // handled in context
                                }
                            }} className={styles.actionButton}>Salvar</button>
                            <button onClick={() => { setIsEditing(false); setEditName(pet.name); setEditAge(pet.age); setEditDescription(pet.description); }} className={styles.deleteButton}>Cancelar</button>
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
