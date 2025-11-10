import Banner from "../Banner/Banner.jsx";
import Footer from "../Footer/Footer.jsx";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import SearchPets from "../SearchPets/SearchPets.jsx";

function Home() {
    return (
        <div className="homeMain">
            <div className={styles.header}>
                <Link to="/" className={styles.logo}>
                    Pet Care
                </Link>
            </div>
            <Banner />
            <SearchPets />
            <Footer />
        </div>
    );
}

export default Home;
