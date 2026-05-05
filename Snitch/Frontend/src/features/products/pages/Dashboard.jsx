import React, { useEffect } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const { handleGetSellerProducts } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);
  const navigate = useNavigate();

  useEffect(() => {
    handleGetSellerProducts();
  }, [handleGetSellerProducts]);

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div
      className="min-h-screen pb-20"
      style={{ backgroundColor: "#FAF8F5", fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Navigation / Header ────────────────────────────────────────────── */}
      <nav className="px-6 sm:px-10 lg:px-14 xl:px-20 py-8 flex items-center justify-between">
        <div className="flex flex-col">
          <span
            className="text-[10px] tracking-[0.25em] uppercase font-semibold mb-1"
            style={{ color: "#C9A96E" }}
          >
            Seller Portal
          </span>
          <h1
            className="text-[#1a1a1a] leading-none"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.5rem, 2vw, 2rem)",
            }}
          >
            Snitch.
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/")}
            className="text-[11px] tracking-[0.15em] uppercase text-[#888] hover:text-[#1a1a1a] transition-colors font-medium"
          >
            Storefront
          </button>
          <button
            onClick={() => navigate("/seller/create-product")}
            className="px-6 py-2.5 bg-[#1a1a1a] hover:bg-[#2e2e2e] text-white text-[10px] tracking-[0.2em] uppercase font-semibold transition-colors duration-200"
          >
            Add Product
          </button>
        </div>
      </nav>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <main className="px-6 sm:px-10 lg:px-14 xl:px-20 mt-8">
        <div className="mb-12 border-b border-[#e0ddd8] pb-6 flex items-end justify-between">
          <div>
            <h2
              className="text-[#1a1a1a]"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.5rem, 4vw, 4rem)",
                lineHeight: "1",
              }}
            >
              Your Collection
            </h2>
            <p className="text-sm text-[#888] mt-4 font-light">
              Manage your aesthetic and curated listings.
            </p>
          </div>
          <div className="text-[11px] tracking-[0.1em] text-[#888] uppercase mb-1">
            {sellerProducts?.length || 0} {sellerProducts?.length === 1 ? "Item" : "Items"}
          </div>
        </div>

        {/* ── Products Grid ────────────────────────────────────────────────── */}
        {!sellerProducts || sellerProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p
              className="text-[#888] italic mb-3"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "2rem",
              }}
            >
              The vault is empty.
            </p>
            <p className="text-sm text-[#666] max-w-sm font-light leading-relaxed">
              You haven't listed any pieces yet. Begin curating your collection
              by adding your first item.
            </p>
            <button
              onClick={() => navigate("/seller/create-product")}
              className="mt-8 px-8 py-3 border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#FAF8F5] text-[10px] tracking-[0.2em] uppercase font-semibold transition-colors duration-300"
            >
              Add First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {sellerProducts.map((product) => (
              <div
                key={product._id}
                className="group flex flex-col cursor-pointer"
                onClick={() => {
                  // Navigate to product detail or edit page in the future
                  // navigate(`/product/${product._id}`);
                }}
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f3f0ea] mb-4">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest text-[#aaa]">
                      No Image
                    </div>
                  )}
                  {/* Subtle hover dark overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Hover action label */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="bg-white/90 backdrop-blur-sm text-[#1a1a1a] text-[9px] tracking-[0.2em] uppercase font-semibold px-4 py-2">
                      View Details
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-1.5 px-1">
                  <div className="flex justify-between items-start gap-4">
                    <h3
                      className="text-[17px] text-[#1a1a1a] truncate"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {product.title}
                    </h3>
                    <span className="text-[13px] font-medium text-[#1a1a1a] shrink-0 mt-0.5">
                      {formatCurrency(product.price?.amount, product.price?.currency)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#888] line-clamp-1 leading-relaxed font-light">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
