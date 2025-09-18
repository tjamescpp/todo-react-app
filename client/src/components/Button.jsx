export default function Button({ className, type, id, onClick, children }) {
    return (
        <button className={className} type={type} id={id} onClick={onClick}>
            {children}
        </button>
    );
}
