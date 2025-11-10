import React from "react";
import styles from "./Footer.module.css";
import { FaGithub } from "react-icons/fa";


function Footer() {
    return (
        <footer className={styles.footer}>
            <div>
                <div className={styles.title}>PetCare Tips</div>
                <div className={styles.rights}>© 2024 PetCare Tips</div>
            </div>
            <div className={styles.contactContainer}>
                <div className={styles.contact}>
                    <div className={styles.contact}>
                        <a href="https://github.com/Bnorbis" target="_blank" rel="noopener noreferrer">
                            Bruna Naian <FaGithub />
                        </a>
                    </div>
                    <a href="https://github.com/ViniciusNeia" target="_blank" rel="noopener noreferrer">
                        Vinicius Neia <FaGithub />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;