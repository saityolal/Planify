

 function LogoutComponent() {
    return (
        <div className="container">
            <div className="app-card p-5 mx-auto" style={{ maxWidth: "560px" }}>
                <p className="text-primary fw-semibold mb-2">Session ended</p>
                <h1 className="fw-bold">Logged out successfully</h1>
                <p className="text-muted mb-0">You can log in again whenever you are ready.</p>
            </div>
        </div>
    );
}

export default LogoutComponent