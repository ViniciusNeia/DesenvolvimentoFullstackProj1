import React, { useState, useEffect } from "react";
import styles from "./CreatePetModal.module.css";
import { usePetContext } from "../PetContext.jsx";

function CreatePetModal({ isOpen, onClose }) {
  const { species: defaultSpecies, showPopupModal, addCreatedPet } = usePetContext();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [breedDetails, setBreedDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [breedsList, setBreedsList] = useState([]);
  const [selectedBreedId, setSelectedBreedId] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState(defaultSpecies || "dog");

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    const apiBase = selectedSpecies === "dog" ? "https://api.thedogapi.com/v1" : "https://api.thecatapi.com/v1";
    (async () => {
      try {
        const res = await fetch(`${apiBase}/breeds`);
        const data = await res.json();
        if (mounted && Array.isArray(data)) setBreedsList(data);
      } catch (err) {
        console.error("failed to fetch breeds list", err);
        setBreedsList([]);
      }
    })();
    return () => (mounted = false);
  }, [isOpen, selectedSpecies]);

  useEffect(() => {
    if (!selectedBreedId) return setBreedDetails(null);
    const found = breedsList.find((b) => String(b.id) === String(selectedBreedId) || b.name === selectedBreedId);
    setBreedDetails(found || null);
  }, [selectedBreedId, breedsList]);

  function makeImageUrl(b) {
    if (!b) return null;
    const id = b.reference_image_id || b.image?.id;
    if (!id) return null;
    return `https://cdn2.the${selectedSpecies}api.com/images/${id}.jpg`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !selectedBreedId) return showPopupModal("Campos faltando", "Nome e raça são obrigatórios", "warning");
    setLoading(true);
    const payload = { name, breed: breedDetails?.name || "", age: age || null, description: description || null, breedDetails, species: selectedSpecies };
    try {
      const resp = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || "Erro ao salvar pet");
      }
      const data = await resp.json();
      const created = {
        id: data.id,
        name,
        age,
        description,
        breed: breedDetails?.name || "",
        species: selectedSpecies,
        breedDetails: breedDetails || null,
        imageUrl: makeImageUrl(breedDetails),
      };
      addCreatedPet(created);
      showPopupModal("Sucesso", "Pet cadastrado com sucesso", "success");
      // reset
      setName("");
      setAge("");
      setSelectedBreedId("");
      setDescription("");
      setBreedDetails(null);
      onClose();
    } catch (err) {
      console.error(err);
      showPopupModal("Erro", err.message || "Erro ao salvar pet", "error");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  const previewImage = makeImageUrl(breedDetails);

  return (
    <div className={styles.overlay}>
      <div className={styles.expandedCard}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        {previewImage && <img className={styles.cardImage} src={previewImage} alt={breedDetails?.name || 'preview'} />}
        <div className={styles.cardBody}>
          <h2 className={styles.cardTitle}>Cadastrar Pet</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <label>Nome</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />

            <label>Idade</label>
            <input value={age} onChange={(e) => setAge(e.target.value)} />

            <label>Espécie</label>
            <div className="selectSpecies">
              <select value={selectedSpecies} onChange={(e) => setSelectedSpecies(e.target.value)}>
                <option value="dog">Cachorro</option>
                <option value="cat">Gato</option>
              </select>
            </div>

            <label>Raça</label>
            <div className={styles.breedRow}>
              <select value={selectedBreedId} onChange={(e) => setSelectedBreedId(e.target.value)}>
                <option value="">-- Selecionar raça --</option>
                {breedsList.map((b) => (
                  <option key={b.id || b.name} value={b.id || b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            {breedDetails && (
              <div className={styles.breedDetails}>
                <h4 className={styles.cardSubtitle}>{breedDetails.name}</h4>
                {breedDetails.temperament && <p className={styles.cardTemperament}><strong>Temperamento:</strong> {breedDetails.temperament}</p>}
                {breedDetails.life_span && <p className={styles.cardLifeSpan}><strong>Expectativa de vida:</strong> {breedDetails.life_span}</p>}
                {breedDetails.origin && <p className={styles.cardOrigin}><strong>Origem:</strong> {breedDetails.origin}</p>}
              </div>
            )}

            <label>Descrição</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

            <div className={styles.actions}>
              <button type="submit" className={styles.primary} disabled={loading}>Salvar</button>
              <button type="cancell" onClick={onClose}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePetModal;
