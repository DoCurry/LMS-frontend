import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Initial cart data
const initialCartItems = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 1729.67,
    coverImage: "/book-covers/great-gatsby.jpeg",
    format: "Paperback",
    isNewRelease: true,
    quantity: 2,
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 1931.84,
    coverImage: "/book-covers/mocking-bird.jpeg",
    format: "Hardcover",
    isOnSale: true,
    originalPrice: 2529.66,
    quantity: 1,
  },
];

export function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [showCheckout, setShowCheckout] = useState(false);

  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const bulkDiscount = itemCount >= 5 ? subtotal * 0.05 : 0;
  const total = subtotal - bulkDiscount;

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Your Shopping Cart</h1>
        <Badge variant="outline" className="ml-2 px-3 py-1 text-sm">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </Badge>
      </div>

      {cartItems.length === 0 ? (
        <EmptyCartView />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              itemCount={itemCount}
              subtotal={subtotal}
              bulkDiscount={bulkDiscount}
              total={total}
              onCheckout={handleCheckout}
            />

            <Button
              variant="outline"
              className="w-full mt-6"
              onClick={() => console.log("Continue shopping")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>
      )}

      {/* Checkout Form */}
      {showCheckout && (
        <CheckoutForm
          cartItems={cartItems}
          onSubmitSuccess={() => {
            setCartItems([]);
            setShowCheckout(false);
          }}
        />
      )}
    </div>
  );
}

function EmptyCartView() {
  return (
    <div className="text-center py-16 space-y-4">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800">Your cart is empty</h2>
      <p className="text-gray-500 max-w-md mx-auto">
        Looks like you haven't added any books to your cart yet. Start exploring
        our collection!
      </p>
      <Button className="mt-6 px-8 py-4 rounded-lg">Browse Books</Button>
    </div>
  );
}

function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <Card className="hover:shadow-md transition-shadow border-gray-100">
      <CardContent className="p-6 flex gap-6">
        <div className="w-28 h-36 flex-shrink-0 relative rounded-lg overflow-hidden shadow-sm border border-gray-200">
          <img
            src={item.coverImage}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          {item.isOnSale && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              SALE
            </div>
          )}
        </div>

        <div className="flex-grow flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-600">by {item.author}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="secondary" className="px-2 py-1 text-xs">
                  {item.format}
                </Badge>
                {item.isNewRelease && (
                  <Badge className="bg-green-100 text-green-800 px-2 py-1 text-xs">
                    New Release
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
              onClick={() => onRemove(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-auto flex items-end justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-full border-gray-300 hover:bg-gray-50"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  onUpdateQuantity(item.id, parseInt(e.target.value))
                }
                className="w-16 h-9 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="1"
              />
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-full border-gray-300 hover:bg-gray-50"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-right space-y-1">
              {item.isOnSale && item.originalPrice && (
                <p className="text-sm text-gray-400 line-through">
                  Rs. {(item.originalPrice * item.quantity).toFixed(2)}
                </p>
              )}
              <p className="font-semibold text-gray-900 text-lg">
                Rs. {(item.price * item.quantity).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                Rs. {item.price.toFixed(2)} each
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OrderSummary({ itemCount, subtotal, bulkDiscount, total, onCheckout }) {
  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Order Summary</CardTitle>
        <CardDescription className="text-gray-600">
          Review your items and checkout
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-700">Subtotal ({itemCount} items)</span>
          <span className="font-medium">Rs. {subtotal.toFixed(2)}</span>
        </div>

        {bulkDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Bulk Discount (5%)</span>
            <span>-Rs. {bulkDiscount.toFixed(2)}</span>
          </div>
        )}

        <Separator className="my-2" />

        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-gray-900">
            Rs. {total.toFixed(2)}
          </span>
        </div>
      </CardContent>

      <CardContent className="pt-0">
        <Button
          className="w-full h-12 rounded-lg text-base font-medium"
          onClick={onCheckout}
        >
          Proceed to Checkout
        </Button>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Secure checkout. Pick up at our store location.
        </p>
      </CardContent>
    </Card>
  );
}

function CheckoutForm({ cartItems, onSubmitSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (formData) => {
    const payload = {
      customer: formData,
      items: cartItems,
    };

    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Checkout Successful!");
        onSubmitSuccess();
      })
      .catch(() => alert("Checkout failed."));
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Checkout Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="Full Name" {...register("name", { required: true })} />
          {errors.name && (
            <p className="text-sm text-red-500">Name is required</p>
          )}

          <Input placeholder="Email" {...register("email", { required: true })} />
          {errors.email && (
            <p className="text-sm text-red-500">Email is required</p>
          )}

          <Input
            placeholder="Shipping Address"
            {...register("address", { required: true })}
          />
          {errors.address && (
            <p className="text-sm text-red-500">Address is required</p>
          )}

          <Button type="submit" className="w-full">
            Confirm & Pay
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
