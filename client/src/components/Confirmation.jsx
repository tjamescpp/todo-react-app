export default function Confirmation() {
    return (
        <div className="overlay">
            <div id="confirmation">
                <p>Are you sure you want to delete?</p>
                <button type="button">Delete</button>
                <button type="button">Cancel</button>
            </div>
        </div>
    );
}
