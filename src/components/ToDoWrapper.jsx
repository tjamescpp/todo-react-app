import { useEffect, useRef, useState } from 'react';

export default function ToDoWrapper({ children }) {
    const listRef = useRef(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (listRef.current) {
                setScrolled(listRef.current.scrollTop > 0);
            }
        };

        const listEl = listRef.current;
        listEl.addEventListener('scroll', handleScroll);

        return () => {
            listEl.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div
            id="toDoWrapper"
            ref={listRef}
            className={scrolled ? 'scrolled' : ''}
        >
            {children}
        </div>
    );
}
