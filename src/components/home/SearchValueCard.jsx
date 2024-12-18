function SearchValueCard({ user, onClick }) {
    return (
        <div
            onClick={onClick}
            className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition"
        >
            <h3 className="text-lg font-semibold">
                {user.name || "Unknown User"}
            </h3>
            <p>{user.email}</p>
            <p>{user.businessName}</p>
            <p>{user.phoneNumber}</p>
        </div>
    );
}

export default SearchValueCard;
