export default function Confirmation({
    setDeleteProject,
    handleDeleteProject,
    projectName,
}) {
    const handleDelete = () => {
        setDeleteProject(null);
        handleDeleteProject(projectName);
    };
    const handleCancel = () => {
        setDeleteProject(null);
    };

    return (
        <div className="overlay">
            <div id="confirmation">
                <p>Are you sure you want to delete?</p>
                <div id="confirmationBtn">
                    <button
                        id="confirmationDeleteBtn"
                        type="button"
                        onClick={() => handleDelete()}
                    >
                        Delete
                    </button>
                    <button
                        id="confirmationCancelBtn"
                        type="button"
                        onClick={() => handleCancel()}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
