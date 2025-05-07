// src/pages/books/book-details.page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function BookDetailsPage() {
  const [orderQty, setOrderQty] = useState(1);
  const inStock = 15;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="w-full max-h-[500px] overflow-hidden rounded-lg shadow-md">
        <img
          src="/book-cover.jpg"
          alt="Book Cover"
          className="w-full object-cover"
        />
      </Card>

      <div>
        <h1 className="text-3xl font-bold mb-2">The Art of Writing Code</h1>

        <div className="space-y-1 text-sm text-gray-600 mb-4">
          <p>
            Genre: <span className="font-semibold text-black">Programming</span>
          </p>
          <p>
            Author:{" "}
            <span className="font-semibold text-black">Jane Developer</span>
          </p>
          <p>
            Publisher:{" "}
            <span className="font-semibold text-black">Tech Books Co.</span>
          </p>
          <p className="text-xl text-green-600 font-bold mt-2">$29.99</p>
        </div>

        <div className="mb-4">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={orderQty}
            min={1}
            max={inStock}
            onChange={(e) => setOrderQty(parseInt(e.target.value))}
            className="w-24 mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">
            In stock: {inStock} copies
          </p>
        </div>

        <p className="text-gray-700 mb-6 leading-relaxed">
          <strong>Description:</strong>
          <br />
          Learn how to write clean, maintainable, and effective code...
        </p>

        <div className="flex gap-4 mb-6">
          <Button variant="default">Add to Cart</Button>
          <Button variant="outline">Buy Now</Button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Book Reviews</h2>
          <p className="text-sm text-muted-foreground">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}
