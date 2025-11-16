import Banner from "../Banner/Banner.jsx";
import Footer from "../Footer/Footer.jsx";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import SearchPets from "../SearchPets/SearchPets.jsx";
import CreatePetModal from "../CreatePetModal/CreatePetModal.jsx";
import CreatedPets from "../CreatedPets/CreatedPets.jsx";
import { useState } from "react";
import CardExpanded from "../CardExpanded/CardExpanded.jsx";
import { usePetContext } from "../../contexts/PetContext.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";

function Home() {
    const [openCreate, setOpenCreate] = useState(false);
    const [view, setView] = useState('search');
    const { selectedPet } = usePetContext();
    const { user, logout } = useAuth();
    return (
        <div className="homeMain">
            <div className={styles.header}>
                    <button className={styles.logoutButton} onClick={logout}>{user ? 'Sair' : 'Login'}</button>
                    <Link to="/home" className={styles.logo}>
                    Pet Care
                </Link>
                <button className={styles.addPetButton} onClick={() => setOpenCreate(true)}>Cadastrar Pet</button>
            </div>
            <Banner />
            <div className={styles.controlsWrapper}>
                <div className={styles.viewToggle}>
                    <button className={`${styles.toggleBtn} ${view === 'search' ? styles.active : ''}`} onClick={() => setView('search')}>Buscar Raças</button>
                    <button className={`${styles.toggleBtn} ${view === 'created' ? styles.active : ''}`} onClick={() => setView('created')}>Seus Pets</button>
                </div>
            </div>

            {view === 'search' ? <SearchPets /> : <CreatedPets />}

            <CreatePetModal isOpen={openCreate} onClose={() => setOpenCreate(false)} />
            {selectedPet && <CardExpanded />}
            <Footer />
        </div>
    );
}

export default Home;
