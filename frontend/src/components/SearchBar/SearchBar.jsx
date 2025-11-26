import { FaSearch } from "react-icons/fa";
import styles from "./SearchBar.module.css";

export default function SearchBar({ placeholder, value, onChange, children }) {
    return (
        <div className={styles.searchBarContainer}>
            <div className={styles.icon}>
                <FaSearch />
            </div>

            <input
                className={styles.input}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
            />

            {children /* inserção do select de especie na barra */}
        </div>
    );
}
