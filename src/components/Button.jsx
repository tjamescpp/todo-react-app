export default function Button({ className, type, id, children }) {
    return (
        <button className={className} type={type} id={id}>
            {children}
        </button>
    );
}
