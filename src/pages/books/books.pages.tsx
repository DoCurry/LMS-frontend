import { Button } from "flowbite-react";
import { useState } from "react";

function BooksPage() {
  const [orderQty, setOrderQty] = useState(1);
  const inStock = 15;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Book Cover */}
      <img
        src="/book-cover.jpg"
        alt="Book Cover"
        className="w-full h-auto rounded-lg shadow-md"
      />

      {/* Book Info */}
      <div>
        <h1 className="text-3xl font-bold mb-2">The Art of Writing Code</h1>
        <p className="text-gray-600 mb-1">
          Genre: <span className="font-medium">Programming</span>
        </p>
        <p className="text-gray-600 mb-1">
          Author: <span className="font-medium">Jane Developer</span>
        </p>
        <p className="text-gray-600 mb-1">
          Publisher: <span className="font-medium">Tech Books Co.</span>
        </p>
        <p className="text-xl text-green-600 font-semibold mb-4">$29.99</p>

        <div className="mb-4">
          <label htmlFor="quantity" className="block mb-1 font-medium">
            Quantity:
          </label>
          <input
            type="number"
            id="quantity"
            value={orderQty}
            min="1"
            max={inStock}
            onChange={(e) => setOrderQty(parseInt(e.target.value))}
            className="w-24 rounded-lg border border-gray-300 p-2"
          />
          <p className="text-sm text-gray-500 mt-1">
            In stock: {inStock} copies
          </p>
        </div>

        <p className="text-gray-700 mb-4">
          <strong>Description:</strong>
          <br />
          Learn how to write clean, maintainable, and effective code. This book
          guides you through coding best practices, real-world applications, and
          design principles.
        </p>

        <div className="flex gap-4">
          <Button color="purple">Add to Cart</Button>
          <Button color="success">Buy Now</Button>
        </div>

        {/* Placeholder for future reviews */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Book Reviews</h2>
          <p className="text-sm text-gray-500">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}

export default BooksPage;
