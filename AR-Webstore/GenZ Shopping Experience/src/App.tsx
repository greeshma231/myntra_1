import { useState } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { TrendingSection } from "./components/TrendingSection";
import { CommunitySection } from "./components/CommunitySection";
import { GenAISection } from "./components/GenAISection";
import { Footer } from "./components/Footer";
import { AISearchModal } from "./components/AISearchModal";
import { CartSidebar } from "./components/CartSidebar";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { ARTryOnModal } from "./components/ARTryOnModal";
import { SplashScreen } from "./components/SplashScreen";
import { toast } from "sonner@2.0.3";
interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  description?: string;
  sizes?: string[];
  colors?: string[];
  aiMatch?: number;
}

interface CartItem extends Product {
  quantity: number;
  size?: string;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAROpen, setIsAROpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (product: Product, size?: string) => {
    const existingItem = cartItems.find(item => item.id === product.id && item.size === size);
    
    if (existingItem) {
      setCartItems(prev => prev.map(item => 
        item.id === product.id && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const newItem: CartItem = {
        ...product,
        quantity: 1,
        size,
        sizes: product.sizes || ['S', 'M', 'L', 'XL'],
        colors: product.colors || ['Black', 'White', 'Navy'],
        description: product.description || "A perfect addition to your wardrobe with premium quality and modern style."
      };
      setCartItems(prev => [...prev, newItem]);
    }
    
    toast.success("Added to cart!", {
      description: `${product.name} has been added to your cart.`
    });
    
    // Close product modal if open
    if (selectedProduct) {
      setSelectedProduct(null);
    }
  };

  const handleProductClick = (product: Product) => {
    // Add missing properties for the modal
    const enrichedProduct: Product = {
      ...product,
      sizes: product.sizes || ['S', 'M', 'L', 'XL'],
      colors: product.colors || ['Black', 'White', 'Navy'],
      description: product.description || "A perfect addition to your wardrobe with premium quality and modern style."
    };
    setSelectedProduct(enrichedProduct);
  };

  const handleWishlist = (product: Product) => {
    toast.success("Added to wishlist!", {
      description: `${product.name} has been saved to your wishlist.`
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev => prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };

  const handleAISearch = (query: string) => {
    toast.success("AI Search Activated!", {
      description: `Searching for: "${query}"`
    });
    setIsAISearchOpen(false);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Show splash screen on first load
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* AURAFIT Brand Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white text-center py-2">
        <p className="text-sm font-medium">
          🎉 Welcome to AURAFIT - Where Your Style Meets AI ✨
        </p>
      </div>
      
      <Header 
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        onAISearchClick={() => setIsAISearchOpen(true)}
        onARClick={() => setIsAROpen(true)}
      />
      
      <main>
        <HeroSection 
          onAISearchClick={() => setIsAISearchOpen(true)}
          onARClick={() => setIsAROpen(true)}
        />
        <TrendingSection 
          onAddToCart={handleAddToCart}
          onProductClick={handleProductClick}
          onWishlist={handleWishlist}
        />
        <CommunitySection />
        <GenAISection />
      </main>
      
      <Footer />

      {/* Modals */}
      <AISearchModal
        isOpen={isAISearchOpen}
        onClose={() => setIsAISearchOpen(false)}
        onSearch={handleAISearch}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <ProductDetailModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
        onWishlist={handleWishlist}
      />

      <ARTryOnModal
        isOpen={isAROpen}
        onClose={() => setIsAROpen(false)}
        onAddToCart={handleAddToCart}
        onProductClick={handleProductClick}
      />
    </div>
  );
}