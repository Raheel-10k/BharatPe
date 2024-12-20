import { useNavigate } from 'react-router-dom';

function SearchValueCard({ 
    searchQuery, 
    setSearchQuery, 
    searchField, 
    setSearchField, 
    handleSearch, 
    searchResult 
}) {
    const navigate = useNavigate();

    const handleUserClick = (user) => {
        navigate("/payment", {
            state: {
                toMerchantId: user.merchantId,
                user: user
            }
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-center">Search for Users</h3>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
                <select
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="phoneNumber">Phone Number</option>
                    <option value="name">Name</option>
                    <option value="businessName">Business Name</option>
                    <option value="email">Email</option>
                </select>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter search value"
                    className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition"
                >
                    Search
                </button>
            </div>

            {/* Search Results */}
            {searchResult && searchResult.length > 0 ? (
                <div className="space-y-4">
                    {searchResult.map((user) => (
                        <div
                            key={user.merchantId}
                            onClick={() => handleUserClick(user)}
                            className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                        >
                            <h4 className="font-semibold">{user.name}</h4>
                            <p className="text-sm text-gray-600">{user.businessName}</p>
                            <p className="text-sm text-gray-600">{user.phoneNumber}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                    ))}
                </div>
            ) : searchResult && searchResult.length === 0 ? (
                <div className="text-center text-gray-600">No users found</div>
            ) : null}
        </div>
    );
}

export default SearchValueCard;
