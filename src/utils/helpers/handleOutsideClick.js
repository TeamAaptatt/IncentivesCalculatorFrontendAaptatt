import { useRef } from "react";

const dropdownRef = useRef(null);

export const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        return false;
    }
};
