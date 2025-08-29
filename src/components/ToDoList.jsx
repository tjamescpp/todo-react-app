export default function ToDoList({ children }) {
    return (
        <div id="toDoList">
            <div id="contentHeader">
                <p>Tasks</p>
            </div>
            {children}
        </div>
    );
}
