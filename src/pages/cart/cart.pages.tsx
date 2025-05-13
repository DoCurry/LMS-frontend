import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MinusIcon, PlusIcon, Trash2Icon, BookIcon, ShoppingBasketIcon } from 'lucide-react';
import { cartAPI, orderAPI } from '@/api/api';
import { CartDto, CartItemDto, CartSummaryDto } from '@/models/cart.model';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartSummary, setCartSummary] = useState<CartSummaryDto | null>(null);
  const [updatingQuantity, setUpdatingQuantity] = useState<string | null>(null);
  const [showClearCartDialog, setShowClearCartDialog] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [pendingQuantities, setPendingQuantities] = useState<Record<string, number>>({});

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get();
      setCart(response.data.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const fetchCartSummary = async () => {
    try {
      const response = await cartAPI.getSummary();
      setCartSummary(response.data.data);
    } catch (error) {
      console.error('Error fetching cart summary:', error);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchCartSummary();
  }, []);

  useEffect(() => {
    if (cart) {
      fetchCartSummary();
    }
  }, [cart?.totalAmount]);

  const debouncedUpdates = useDebouncedCallback(async (updates: Map<string, number>) => {
    try {
      setUpdatingQuantity('all');      // Process all updates sequentially
      for (const [itemId, quantity] of updates) {
        await cartAPI.updateItem(itemId, { quantity });
      }
      await fetchCart();
      await fetchCartSummary(); // Refresh cart summary after quantity updates
      setPendingQuantities({});
    } catch (error) {
      console.error('Error updating quantities:', error);
      toast.error('Failed to update quantities');
      // Reset pending quantities on error
      setPendingQuantities({});
    } finally {
      setUpdatingQuantity(null);
    }
  }, 500);

  const handleQuantityChange = (itemId: string, currentQty: number, change: number) => {
    const effectiveQty = pendingQuantities[itemId] ?? currentQty;
    const newQty = Math.max(1, effectiveQty + change);
    if (newQty === effectiveQty) return;

    // Update pending quantity immediately for UI feedback
    const newPendingQuantities = {
      ...pendingQuantities,
      [itemId]: newQty
    };
    setPendingQuantities(newPendingQuantities);
    
    // Convert pending quantities to a Map
    const updates = new Map(Object.entries(newPendingQuantities));
    debouncedUpdates(updates);
  };

  const handleRemoveItem = async (itemId: string) => {    try {
      await cartAPI.removeItem(itemId);
      await fetchCart();
      await fetchCartSummary(); // Refresh cart summary after removing item
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {    try {
      await cartAPI.clear();
      await fetchCart();
      await fetchCartSummary(); // Refresh cart summary after clearing cart
      setShowClearCartDialog(false);
      toast.success('Cart cleared successfully');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const handleCheckout = async () => {
    try {
      setProcessingOrder(true);
      await orderAPI.createFromCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    } finally {
      setProcessingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4">
          <ShoppingBasketIcon className="h-8 w-8 text-blue-600 animate-bounce" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 pb-16">
      {/* Header */}
      <header className="mb-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="mt-2 text-gray-600">Review and manage your items</p>
        </div>
      </header>

      {/* Cart Content */}
      <div className="max-w-6xl mx-auto">
        {cart?.items.length ? (
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="space-y-4">
                {cart.items.map((item: CartItemDto) => (
                  <Card key={item.id} className="p-4 bg-white/50 backdrop-blur-sm hover:shadow-md transition-all">
                    <div className="flex gap-4">
                      {/* Book Image */}
                      <div className="w-24 h-32 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                        <img
                          src={item.book.imageUrl || '/placeholder-book.svg'}
                          alt={item.book.title}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <div>
                            <h3 
                              className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                              onClick={() => navigate(`/books/${item.book.slug}`)}
                            >
                              {item.book.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              by {item.book.authors.map(a => a.name).join(', ')}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2Icon className="h-5 w-5" />
                          </Button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="mt-auto flex items-end justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 relative"
                                onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                disabled={(pendingQuantities[item.id] ?? item.quantity) <= 1}
                              >
                                <MinusIcon className="h-4 w-4" />
                              </Button>
                              <div className="w-12 text-center">
                                <span className={`font-medium ${pendingQuantities[item.id] ? 'text-blue-600' : ''}`}>
                                  {pendingQuantities[item.id] ?? item.quantity}
                                </span>
                              </div>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 relative"
                                onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                              >
                                <PlusIcon className="h-4 w-4" />
                              </Button>
                            </div>
                            {updatingQuantity === item.id && (
                              <span className="text-sm text-blue-600 animate-pulse">Updating...</span>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-medium text-gray-900">${item.subtotal.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">${item.unitPrice.toFixed(2)} each</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Clear Cart Button */}
              <div className="mt-4">
                <Button
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setShowClearCartDialog(true)}
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <Card className="p-6 bg-white/50 backdrop-blur-sm sticky top-20">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${cart.totalAmount.toFixed(2)}</span>
                  </div>

                  {cartSummary?.discountAmount ? (
                    <div className="flex justify-between text-green-600">
                      <span>Cart Discount</span>
                      <span>-${cartSummary.discountAmount.toFixed(2)}</span>
                    </div>
                  ) : (
                    cartSummary && cartSummary.itemCount < 5 && (
                      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        Add {5 - cartSummary.itemCount} more {5 - cartSummary.itemCount === 1 ? 'book' : 'books'} to get a 5% discount!
                      </div>
                    )
                  )}

                  <Separator />

                  <div className="flex justify-between text-base font-medium">
                    <span className="text-gray-900">Total</span>
                    <span className="text-blue-600">
                      ${(cartSummary?.finalAmount ?? cart.totalAmount).toFixed(2)}
                    </span>
                  </div>

                  {cartSummary?.discountAmount ? (
                    <p className="text-xs text-green-600 text-center">
                      You saved ${cartSummary.discountAmount.toFixed(2)}!
                    </p>
                  ) : null}
                </div>

                <Button
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleCheckout}
                  disabled={processingOrder}
                >
                  {processingOrder ? 'Processing...' : 'Proceed to Checkout'}
                </Button>

                <p className="mt-4 text-sm text-gray-500 text-center">
                  By clicking Proceed to Checkout, you agree to our terms and conditions.
                </p>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm">
            <BookIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Browse our collection and add some books!</p>
            <Button 
              onClick={() => navigate('/books')} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Browse Books
            </Button>
          </div>
        )}
      </div>

      {/* Clear Cart Confirmation Dialog */}
      <AlertDialog open={showClearCartDialog} onOpenChange={setShowClearCartDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Shopping Cart</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all items from your cart. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearCart}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Clear Cart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
