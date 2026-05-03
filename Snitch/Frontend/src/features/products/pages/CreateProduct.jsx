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
      setErrorMsg(err?.response?.data?.message || err.message || "Something went wrong.");
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
    // Only clear if leaving the drop zone itself (not a child)
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
    "w-full bg-[#1c1b1b] text-[#e5e2e1] placeholder-[#4f4632] rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffc107]/30 focus:bg-[#201f1f] transition-all duration-200";

  const labelCls =
    "block mb-2 text-xs font-semibold tracking-widest uppercase text-[#d4c5ab]";

  const SubmitInner = () =>
    isSubmitting ? (
      <span className="flex items-center justify-center gap-2">
        <svg className="animate-spin h-4 w-4 text-[#261a00]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Publishing…
      </span>
    ) : (
      "Publish Listing"
    );

  const isFull = images.length >= MAX_IMAGES;
  const pct = Math.round((images.length / MAX_IMAGES) * 100);

  // ─── UI ─────────────────────────────────────────────────────────────────────

  return (
    // overflow-x-hidden on root kills horizontal scroll
    <div className="min-h-screen w-full overflow-x-hidden bg-[#131313] text-[#e5e2e1] font-[Inter,sans-serif]">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 flex items-center gap-4 px-5 lg:px-10 py-4 bg-[#131313]/90 backdrop-blur-md border-b border-[#4f4632]/20">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1c1b1b] hover:bg-[#2a2a2a] transition-colors cursor-pointer shrink-0"
          aria-label="Go back"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#d4c5ab]">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <h1
            className="text-lg font-semibold tracking-tight text-[#e5e2e1] truncate"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            New Listing
          </h1>
          <p className="hidden lg:block text-xs text-[#9c8f78] mt-0.5">
            Fill in the details and add photos to publish your product.
          </p>
        </div>

        {/* Desktop CTA in header */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-[#ffe4af] to-[#ffc107] hover:from-[#ffc107] hover:to-[#fabd00] disabled:opacity-60 text-[#261a00] font-bold text-sm rounded-full px-6 py-2.5 transition-all duration-300 shadow-[0_4px_20px_rgba(255,193,7,0.15)] hover:shadow-[0_8px_30px_rgba(255,193,7,0.25)] cursor-pointer shrink-0"
        >
          <SubmitInner />
        </button>
      </header>

      {/* ── Form ─────────────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl mx-auto px-5 lg:px-10 pt-8 pb-32 lg:pb-16"
      >
        {/* Error */}
        {errorMsg && (
          <div className="mb-6 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* Two-column on lg+ */}
        <div className="flex flex-col lg:flex-row lg:gap-10 xl:gap-14">

          {/* ── LEFT — text fields ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-8 lg:flex-1 min-w-0">

            {/* Title */}
            <section>
              <label htmlFor="title" className={labelCls}>Title</label>
              <input
                id="title" name="title" type="text"
                value={formData.title} onChange={handleChange}
                placeholder="Product title" required
                className={inputCls}
              />
            </section>

            {/* Description */}
            <section>
              <label htmlFor="description" className={labelCls}>Description</label>
              <textarea
                id="description" name="description"
                value={formData.description} onChange={handleChange}
                placeholder="Tell buyers what makes this piece special..."
                rows={6} required
                className={`${inputCls} resize-none leading-relaxed`}
              />
            </section>

            {/* Price */}
            <section>
              <label className={labelCls}>Price</label>
              <div className="flex gap-3">
                {/* Currency */}
                <div className="relative shrink-0">
                  <select
                    id="priceCurrency" name="priceCurrency"
                    value={formData.priceCurrency} onChange={handleChange}
                    className="appearance-none bg-[#1c1b1b] text-[#e5e2e1] rounded-2xl pl-4 pr-9 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffc107]/30 focus:bg-[#201f1f] transition-all duration-200 cursor-pointer"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c} className="bg-[#1c1b1b]">{c}</option>
                    ))}
                  </select>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                    strokeLinecap="round" strokeLinejoin="round"
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9c8f78]">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                {/* Amount */}
                <input
                  id="priceAmount" name="priceAmount" type="number"
                  min="0" step="0.01" value={formData.priceAmount}
                  onChange={handleChange} placeholder="0.00" required
                  className={`flex-1 min-w-0 ${inputCls}`}
                />
              </div>
            </section>

            {/* Pro-tip (desktop) */}
            <aside className="hidden lg:block rounded-2xl bg-[#1c1b1b] px-5 py-4 border border-[#4f4632]/20">
              <p className="text-xs text-[#9c8f78] leading-relaxed">
                <span className="text-[#d4c5ab] font-semibold">Pro tip:</span> Listings with 5+
                photos and a detailed description sell{" "}
                <span className="text-[#ffc107]">3× faster</span> on Snitch.
              </p>
            </aside>
          </div>

          {/* ── RIGHT — image upload ────────────────────────────────────────── */}
          <div className="mt-8 lg:mt-0 flex flex-col gap-4 lg:w-[380px] xl:w-[420px] shrink-0">

            {/* Section header */}
            <div className="flex items-center justify-between">
              <span className={labelCls}>Images</span>
              <span className="text-xs text-[#9c8f78] font-medium tabular-nums">
                {images.length} / {MAX_IMAGES}
              </span>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef} type="file" accept="image/*"
              multiple onChange={handleFileInput}
              className="hidden" id="imageUpload"
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
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                aria-label="Upload images"
                className={[
                  "relative flex flex-col items-center justify-center gap-3",
                  "rounded-2xl border-2 border-dashed px-6 py-10 cursor-pointer",
                  "transition-all duration-200 select-none",
                  isDragging
                    ? "border-[#ffc107] bg-[#ffc107]/8 scale-[1.01]"
                    : "border-[#4f4632]/50 bg-[#1c1b1b] hover:border-[#ffc107]/40 hover:bg-[#201f1f]",
                ].join(" ")}
              >
                {/* Upload icon */}
                <div className={[
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-200",
                  isDragging ? "bg-[#ffc107]/15" : "bg-[#201f1f]",
                ].join(" ")}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
                    strokeLinecap="round" strokeLinejoin="round"
                    className={`w-7 h-7 transition-colors duration-200 ${isDragging ? "text-[#ffc107]" : "text-[#9c8f78]"}`}>
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>

                <div className="text-center">
                  <p className={`text-sm font-semibold transition-colors duration-200 ${isDragging ? "text-[#ffc107]" : "text-[#e5e2e1]"}`}>
                    {isDragging ? "Drop to upload" : "Drop images here"}
                  </p>
                  <p className="text-xs text-[#9c8f78] mt-1">
                    or <span className="text-[#ffc107] font-medium">tap to browse</span>
                  </p>
                </div>

                <p className="text-[11px] text-[#4f4632] mt-1">
                  Up to {MAX_IMAGES} images · JPG, PNG, WEBP
                </p>

                {/* Drag active overlay shimmer */}
                {isDragging && (
                  <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 animate-pulse bg-[#ffc107]/5" />
                  </div>
                )}
              </div>
            )}

            {/* ── Thumbnail grid ──────────────────────────────────────────────── */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden bg-[#1c1b1b] group"
                  >
                    <img
                      src={img.preview}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-[#0e0e0e]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                        className="w-7 h-7 rounded-full bg-red-500/90 flex items-center justify-center cursor-pointer hover:bg-red-500 transition-colors"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                          strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-white">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {/* Cover badge */}
                    {index === 0 && (
                      <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-[#ffc107] text-[#261a00] rounded px-1.5 py-0.5 leading-none">
                        COVER
                      </span>
                    )}
                    {/* Number badge (non-cover) */}
                    {index > 0 && (
                      <span className="absolute bottom-1.5 left-1.5 text-[9px] font-semibold bg-[#0e0e0e]/70 text-[#d4c5ab] rounded px-1.5 py-0.5 leading-none">
                        {index + 1}
                      </span>
                    )}
                  </div>
                ))}

                {/* "Add more" tile — only when images exist but not full */}
                {!isFull && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl bg-[#1c1b1b] border border-dashed border-[#4f4632]/40 hover:border-[#ffc107]/40 hover:bg-[#201f1f] flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer group"
                    aria-label="Add more images"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
                      strokeLinecap="round" strokeLinejoin="round"
                      className="w-5 h-5 text-[#9c8f78] group-hover:text-[#ffc107] transition-colors">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Progress bar */}
            <div>
              <div className="h-1 w-full rounded-full bg-[#1c1b1b] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#ffe4af] to-[#ffc107] transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-[#9c8f78] leading-relaxed">
                {isFull
                  ? "Maximum images reached."
                  : "First image will be the cover. Hover a thumbnail to remove it."}
              </p>
            </div>
          </div>
        </div>

        {/* ── Mobile bottom CTA ─────────────────────────────────────────────── */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 px-5 pb-6 pt-3 bg-gradient-to-t from-[#131313] via-[#131313]/95 to-transparent">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#ffe4af] to-[#ffc107] hover:from-[#ffc107] hover:to-[#fabd00] disabled:opacity-60 text-[#261a00] font-bold text-base rounded-full py-4 transition-all duration-300 shadow-[0_8px_32px_rgba(255,193,7,0.20)] hover:shadow-[0_12px_40px_rgba(255,193,7,0.30)] cursor-pointer"
          >
            <SubmitInner />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
