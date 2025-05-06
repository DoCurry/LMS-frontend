import { useState } from 'react';

export default function BookmarksPage() {
  // Sample initial bookmarks
  const [bookmarks, setBookmarks] = useState([
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      price: 14.99,
      coverImg: "/api/placeholder/200/300",
      category: "Fiction",
      format: "Hardcover",
      rating: 4.5,
      year: 2020,
      isbn: "9780525559474",
      language: "English",
      publisher: "Viking",
      stock: 10,
      physicalAccess: true,
      description: "A dazzling novel about all the choices that go into a life well lived.",
      popularity: 95
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      price: 16.99,
      coverImg: "/api/placeholder/200/300",
      category: "Self-Help",
      format: "Paperback",
      rating: 4.8,
      year: 2018,
      isbn: "9780735211292",
      language: "English",
      publisher: "Avery",
      stock: 15,
      physicalAccess: true,
      description: "Tiny Changes, Remarkable Results: An Easy & Proven Way to Build Good Habits & Break Bad Ones.",
      popularity: 98
    },
    {
      id: 3,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      price: 12.99,
      coverImg: "/api/placeholder/200/300",
      category: "Mystery",
      format: "Paperback",
      rating: 4.3,
      year: 2019,
      isbn: "9781250301697",
      language: "English",
      publisher: "Celadon Books",
      physicalAccess: false,
      description: "A shocking psychological thriller about a woman's act of violence against her husband.",
      popularity: 90
    }
  ]);

  // Function to remove a bookmark
  const removeBookmark = (id:any) => {
    setBookmarks(bookmarks.filter(book => book.id !== id));
  };

  // Function to render stars based on rating
  const renderStars = (rating:any) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="text-yellow-500">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-500">½</span>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h1 className="text-3xl font-bold text-center text-blue-800">Book Marks</h1>
      </header>
      
      {/* Bookmarks Container */}
      <div className="max-w-6xl mx-auto">
        {bookmarks.length > 0 ? (
          bookmarks.map(book => (
            <div key={book.id} className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
              <div className="flex items-center px-4 py-3">
                {/* Book Cover */}
                <div className="flex-shrink-0 mr-4">
                  <img 
                    src={book.coverImg} 
                    alt={`Cover of ${book.title}`} 
                    className="h-24 w-16 object-cover rounded shadow"
                  />
                </div>
                
                {/* Essential Book Details */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">{book.title}</h2>
                      <p className="text-sm text-gray-600">by {book.author} • {book.year} • {book.publisher}</p>
                      
                      <div className="flex items-center mt-1">
                        <div className="flex text-sm">
                          {renderStars(book.rating)}
                        </div>
                        <span className="ml-1 text-xs text-gray-600">({book.rating})</span>
                        <span className="mx-2 text-gray-400">|</span>
                        <span className="text-sm text-gray-700">{book.category}</span>
                        <span className="mx-2 text-gray-400">|</span>
                        <span className="text-sm text-gray-700">{book.format}</span>
                      </div>
                      
                      <div className="mt-1 flex flex-wrap items-center text-sm">
                        <p className="text-gray-700 mr-4"><span className="font-medium">Price:</span> ${book.price.toFixed(2)}</p>
                        <p className="text-gray-700 mr-4"><span className="font-medium">ISBN:</span> {book.isbn}</p>
          
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <button 
                      onClick={() => removeBookmark(book.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded transition duration-300 ml-2 flex-shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-xl text-gray-600">You have no bookmarks.</p>
            <p className="mt-2 text-gray-500">Add some books to your bookmarks to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
}