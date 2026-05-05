import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";

const MAX_IMAGES = 7;
const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const addFiles = (files, existing) => {
  const remaining = MAX_IMAGES - existing.length;
  return files
    .filter((f) => f.type.startsWith("image/"))
    .slice(0, remaining)
    .map((file) => ({ file, preview: URL.createObjectURL(file) }));
};

// ─── Component ────────────────────────────────────────────────────────────────

const CreateProduct = () => {
  const navigate = useNavigate();
  const { handleCreateProduct } = useProduct();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ─── Form handlers ──────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const mergeImages = useCallback((files) => {
    setImages((prev) => {
      const toAdd = addFiles(files, prev);
      return [...prev, ...toAdd];
    });
  }, []);

  const handleFileInput = (e) => {
    mergeImages(Array.from(e.target.files));
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (images.length === 0) {
      setErrorMsg("Please add at least one product image.");
      return;
    }
    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("priceAmount", formData.priceAmount);
      data.append("priceCurrency", formData.priceCurrency);
      images.forEach(({ file }) => data.append("images", file));
      await handleCreateProduct(data);
      navigate("/");
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message || err.message || "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Drag handlers ──────────────────────────────────────────────────────────

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length < MAX_IMAGES) setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (images.length >= MAX_IMAGES) return;
    const files = Array.from(e.dataTransfer.files);
    mergeImages(files);
  };

  // ─── Shared styles ──────────────────────────────────────────────────────────

  const inputCls =
    "w-full bg-transparent border-0 border-b border-[#ddd] pb-2 text-[13px] text-[#1a1a1a] placeholder-[#ccc] outline-none transition-colors duration-150 focus:border-b-[#1a1a1a]";

  const labelCls =
    "block mb-1 text-[9px] tracking-[0.2em] uppercase font-semibold text-[#999]";

  const SubmitInner = () =>
    isSubmitting ? (
      <span className="flex items-center justify-center gap-2">
        <svg
          className="animate-spin h-3.5 w-3.5 text-white"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
        Publishing...
      </span>
    ) : (
      "Publish Listing"
    );

  const isFull = images.length >= MAX_IMAGES;
  const pct = Math.round((images.length / MAX_IMAGES) * 100);

  // ─── UI ─────────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{ backgroundColor: "#FAF8F5", fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 sm:px-10 lg:px-14 xl:px-20 py-6 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#e0ddd8]">
        <div className="flex items-center gap-5 min-w-0">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center border border-[#e0ddd8] rounded-full hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all cursor-pointer shrink-0 text-[#1a1a1a]"
            aria-label="Go back"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="flex flex-col">
            <span
              className="text-[10px] tracking-[0.25em] uppercase font-semibold mb-0.5"
              style={{ color: "#C9A96E" }}
            >
              Create Product
            </span>
            <h1
              className="text-[#1a1a1a] truncate"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.2rem, 1.5vw, 1.6rem)",
              }}
            >
              New Listing
            </h1>
          </div>
        </div>

        {/* Desktop CTA in header */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="hidden lg:flex items-center justify-center px-6 py-2.5 bg-[#1a1a1a] hover:bg-[#2e2e2e] disabled:bg-[#888] disabled:cursor-not-allowed text-white text-[10px] tracking-[0.2em] uppercase font-semibold transition-colors duration-200 cursor-pointer shrink-0"
        >
          <SubmitInner />
        </button>
      </header>

      {/* ── Form ─────────────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20 pt-10 pb-32 lg:pb-24"
      >
        {/* Error */}
        {errorMsg && (
          <div className="mb-8 text-xs text-red-700 bg-red-50 border border-red-200 rounded px-4 py-3">
            {errorMsg}
          </div>
        )}

        {/* Two-column on lg+ */}
        <div className="flex flex-col lg:flex-row lg:gap-16 xl:gap-20">
          {/* ── LEFT — text fields ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-8 lg:flex-1 min-w-0">
            {/* Title */}
            <section>
              <label htmlFor="title" className={labelCls}>
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="E.g., Linen Summer Shirt"
                required
                className={inputCls}
              />
            </section>

            {/* Description */}
            <section>
              <label htmlFor="description" className={labelCls}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell buyers what makes this piece special..."
                rows={6}
                required
                className={`${inputCls} resize-none leading-relaxed min-h-[140px]`}
              />
            </section>

            {/* Price */}
            <section>
              <label className={labelCls}>Price</label>
              <div className="flex items-end gap-4 border-b border-[#ddd] focus-within:border-[#1a1a1a] transition-colors pb-1">
                {/* Currency */}
                <div className="relative shrink-0">
                  <select
                    id="priceCurrency"
                    name="priceCurrency"
                    value={formData.priceCurrency}
                    onChange={handleChange}
                    className="appearance-none bg-transparent text-[13px] text-[#1a1a1a] font-medium pr-6 py-1 focus:outline-none cursor-pointer"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#888]"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                {/* Amount */}
                <input
                  id="priceAmount"
                  name="priceAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.priceAmount}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  className="flex-1 min-w-0 bg-transparent text-[13px] text-[#1a1a1a] placeholder-[#ccc] outline-none"
                />
              </div>
            </section>

            {/* Pro-tip (desktop) */}
            <aside className="hidden lg:block border border-[#e0ddd8] bg-white/50 px-5 py-4 mt-auto">
              <p className="text-[11px] text-[#888] leading-relaxed">
                <span className="text-[#1a1a1a] font-semibold tracking-wide">
                  PRO TIP:
                </span>{" "}
                Listings with 5+ high-quality photos and a detailed description
                sell <span className="text-[#1a1a1a] italic">3× faster</span>.
              </p>
            </aside>
          </div>

          {/* ── RIGHT — image upload ────────────────────────────────────────── */}
          <div className="mt-10 lg:mt-0 flex flex-col gap-6 lg:w-[360px] xl:w-[400px] shrink-0">
            {/* Section header */}
            <div className="flex items-center justify-between">
              <span className={labelCls} style={{ marginBottom: 0 }}>
                Imagery
              </span>
              <span className="text-[10px] tracking-widest text-[#888] font-medium">
                {images.length} / {MAX_IMAGES}
              </span>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInput}
              className="hidden"
              id="imageUpload"
            />

            {/* ── Drop zone ──────────────────────────────────────────────────── */}
            {!isFull && (
              <div
                onDragOver={onDragOver}
                onDragEnter={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && fileInputRef.current?.click()
                }
                aria-label="Upload images"
                className={[
                  "relative flex flex-col items-center justify-center gap-3",
                  "border border-dashed px-6 py-12 cursor-pointer",
                  "transition-all duration-200 select-none bg-white/40",
                  isDragging
                    ? "border-[#1a1a1a] bg-[#f0ede6]"
                    : "border-[#ccc] hover:border-[#888] hover:bg-white/70",
                ].join(" ")}
              >
                {/* Upload icon */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`w-8 h-8 transition-colors duration-200 ${
                    isDragging ? "text-[#1a1a1a]" : "text-[#aaa]"
                  }`}
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>

                <div className="text-center mt-2">
                  <p
                    className={`text-[13px] transition-colors duration-200 ${
                      isDragging ? "text-[#1a1a1a]" : "text-[#555]"
                    }`}
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {isDragging ? "Drop pieces here" : "Drag & drop photos"}
                  </p>
                  <p className="text-[10px] text-[#888] mt-1.5 uppercase tracking-widest">
                    or click to browse
                  </p>
                </div>
              </div>
            )}

            {/* ── Thumbnail grid ──────────────────────────────────────────────── */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-[3/4] bg-[#f3f0ea] group overflow-hidden"
                  >
                    <img
                      src={img.preview}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="w-7 h-7 flex items-center justify-center cursor-pointer text-white hover:text-red-400 transition-colors"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4"
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {/* Cover badge */}
                    {index === 0 && (
                      <span className="absolute top-1.5 left-1.5 text-[8px] tracking-widest bg-white/90 text-[#1a1a1a] font-semibold px-1.5 py-0.5">
                        COVER
                      </span>
                    )}
                  </div>
                ))}

                {/* "Add more" tile — only when images exist but not full */}
                {!isFull && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-[3/4] border border-dashed border-[#ccc] hover:border-[#888] hover:bg-white/40 flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer group"
                    aria-label="Add more images"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 text-[#aaa] group-hover:text-[#1a1a1a] transition-colors"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Progress bar */}
            <div className="mt-2">
              <div className="h-[2px] w-full bg-[#e0ddd8]">
                <div
                  className="h-full bg-[#1a1a1a] transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-3 text-[10px] tracking-wide text-[#888] uppercase">
                {isFull
                  ? "Maximum images reached."
                  : "First image serves as the cover. Hover to remove."}
              </p>
            </div>
          </div>
        </div>

        {/* ── Mobile bottom CTA ─────────────────────────────────────────────── */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/95 to-transparent">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#1a1a1a] hover:bg-[#2e2e2e] disabled:bg-[#888] disabled:cursor-not-allowed text-white text-[10px] tracking-[0.2em] uppercase font-semibold transition-colors duration-200 shadow-xl cursor-pointer"
          >
            <SubmitInner />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
