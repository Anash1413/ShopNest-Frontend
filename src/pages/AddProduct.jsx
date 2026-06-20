import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Camera,
  Check,
  ImagePlus,
  Loader2,
  Save,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

const initialProduct = {
  name: "",
  price: "",
  description: "",
  category: "",
  brand: "",
  stock: "",
  rating: "4.5",
  numReviews: "0",
};

const categories = ["Audio", "Electronics", "Wearables", "Accessories", "Home"];

const fieldShell =
  "w-full bg-[#212121] border border-white/10 focus:border-ochi-green hover:border-white/20 text-white rounded-full outline-none py-3.5 px-6 font-mono text-xs placeholder-white/20 transition-all duration-300";

const selectShell =
  "w-full bg-[#212121] border border-white/10 focus:border-ochi-green hover:border-white/20 text-white rounded-full outline-none py-3.5 px-6 font-mono text-xs transition-all duration-300 appearance-none cursor-pointer";

const labelShell = "text-xs font-mono font-bold uppercase tracking-wider text-white/40 block mb-2";

function AddProduct() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef("");

  const isEditing = searchParams.get("editing") === "true";
  const productId = searchParams.get("id");

  const [form, setForm] = useState(initialProduct);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const title = isEditing ? "Edit Specs" : "Add Release";
  const submitLabel = isEditing ? "Save Specs" : "Create Release";

  const completion = useMemo(() => {
    const requiredFields = ["name", "price", "description", "category", "brand", "stock"];
    const completedFields = requiredFields.filter((field) => String(form[field]).trim()).length;
    const imageReady = isEditing ? Boolean(existingImageUrl || imageFile) : Boolean(imageFile);
    return Math.round(((completedFields + (imageReady ? 1 : 0)) / (requiredFields.length + 1)) * 100);
  }, [existingImageUrl, form, imageFile, isEditing]);

  useEffect(() => {
    if (!isEditing || !productId) {
      return;
    }

    const loadProduct = async () => {
      setLoadingProduct(true);
      try {
        const res = await fetch(`/api/product/detail/${productId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load product");
        }

        const product = data.product;
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
          objectUrlRef.current = "";
        }
        setForm({
          name: product.name || "",
          price: product.price ?? "",
          description: product.description || "",
          category: product.category || "",
          brand: product.brand || "",
          stock: product.stock ?? "",
          rating: product.rating ?? "4.5",
          numReviews: product.numReviews ?? "0",
        });
        setExistingImageUrl(product.image_url || "");
        setImagePreview(product.image_url || "");
        setImageFile(null);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoadingProduct(false);
      }
    };

    loadProduct();
  }, [isEditing, productId]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      event.target.value = "";
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    objectUrlRef.current = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(objectUrlRef.current);
  };

  const clearSelectedImage = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = "";
    }
    setImageFile(null);
    setImagePreview(existingImageUrl || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Product name is required";
    if (!form.brand.trim()) return "Brand name is required";
    if (!form.category) return "Category is required";
    if (!form.description.trim() || form.description.trim().length < 10) {
      return "Description must be at least 10 characters";
    }
    if (!form.price || Number(form.price) <= 0) return "Price must be greater than 0";
    if (form.stock === "" || Number(form.stock) < 0) return "Stock cannot be negative";
    if (!isEditing && !imageFile) return "Please choose a product image";
    return "";
  };

  const buildProductFormData = () => {
    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("price", String(Number(form.price)));
    payload.append("description", form.description.trim());
    payload.append("category", form.category);
    payload.append("brand", form.brand.trim());
    payload.append("stock", String(Number(form.stock)));
    payload.append("rating", String(Number(form.rating || 0)));
    payload.append("numReviews", String(Number(form.numReviews || 0)));

    if (imageFile) {
      payload.append("image_url", imageFile);
    }

    if (isEditing) {
      payload.append("id", productId);
    }

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationMessage = validateForm();
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login again before saving");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/product/", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: buildProductFormData(),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to save product");
      }

      toast.success(isEditing ? "Product updated" : "Product created");
      navigate("/products");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!isEditing || !productId) return;

    const result = await Swal.fire({
      title: "Delete this product?",
      text: "This product will be permanently removed from the catalog.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete Product",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: "#212121",
      color: "#F1F1F1",
      customClass: {
        popup: "border border-white/10 rounded-2xl shadow-2xl bg-[#212121] p-8 font-sans text-center",
        title: "text-lg font-black text-white tracking-tight uppercase mb-2",
        htmlContainer: "text-white/60 text-xs font-mono uppercase tracking-wider leading-relaxed mb-6",
        confirmButton: "px-5 py-2 rounded-full bg-rose-650 hover:bg-rose-500 text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer transform active:scale-95 duration-200",
        cancelButton: "px-5 py-2 rounded-full border border-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer transform active:scale-95 duration-200 mr-3"
      }
    });

    if (!result.isConfirmed) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login again before deleting");
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch("/api/product/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: productId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete product");
      }

      toast.success("Product deleted");
      navigate("/products");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loadingProduct) {
    return (
      <main className="min-h-screen bg-ochi-charcoal px-4 py-16 text-white flex items-center justify-center border-t border-white/10">
        <div className="text-center font-mono">
          <Loader2 className="h-10 w-10 animate-spin text-ochi-green mb-4 mx-auto" />
          <p className="text-white/50 text-xs uppercase tracking-widest">Loading specs...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ochi-charcoal text-white font-sans overflow-x-hidden border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-16 w-full space-y-8">
        
        {/* Navigation / Header */}
        <div className="flex flex-col gap-4 text-left">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-ochi-green transition-colors font-mono uppercase tracking-wider cursor-pointer group mb-4"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            <span>Products Catalog</span>
          </Link>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end border-b border-white/10 pb-8">
            <div>
              <span className="font-mono text-xs text-ochi-green uppercase tracking-widest block mb-2">
                Admin Catalog
              </span>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-none">
                {title}
              </h1>
              <p className="font-mono text-xs text-white/45 uppercase tracking-wider max-w-xl leading-relaxed mt-2">
                Build a complete catalog record with clean product data, image upload, and inventory details.
              </p>
            </div>

            <div className="w-full max-w-xs text-left">
              <div className="mb-2 flex items-center justify-between font-mono text-[10px] text-white/40 uppercase tracking-widest">
                <span>Verification State</span>
                <span>{completion}%</span>
              </div>
              <div className="h-1 bg-[#1C1C1C] rounded-full overflow-hidden">
                <div
                  className="h-full bg-ochi-green transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} enctype="multipart/form-data" className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-10 text-left">
          
          {/* Left panel - Image selection and checklist */}
          <section className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#1C1C1C] p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-white/40">Product Image</span>
                {imageFile && (
                  <button
                    type="button"
                    onClick={clearSelectedImage}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all cursor-pointer"
                    aria-label="Clear selected image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/20 bg-[#212121] transition hover:border-ochi-green cursor-pointer"
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Product preview" className="h-full w-full object-cover" />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white text-ochi-charcoal px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider">
                        <Camera className="h-3.5 w-3.5" />
                        Replace Specs
                      </span>
                    </span>
                  </>
                ) : (
                  <span className="flex flex-col items-center gap-3 text-center p-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-ochi-green">
                      <ImagePlus className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-mono text-xs font-bold text-white uppercase tracking-wider">Upload image specs</span>
                      <span className="mt-1 block font-mono text-[9px] text-white/30 uppercase tracking-widest">JPG, PNG, or WEBP</span>
                    </span>
                  </span>
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-white/40">
                <UploadCloud className="h-4 w-4 text-ochi-green" />
                <span className="truncate">{imageFile ? imageFile.name : isEditing ? "Current image active" : "Image required"}</span>
              </div>
            </div>

            {/* Checklist */}
            <div className="rounded-2xl border border-white/10 bg-[#1C1C1C] p-6">
              <span className="font-mono text-xs uppercase tracking-widest text-white/40 block mb-4 border-b border-white/5 pb-2">Fields checklist</span>
              <div className="space-y-3 font-mono text-xs uppercase tracking-wider text-white/60">
                {[
                  ["Name", form.name],
                  ["Pricing", form.price],
                  ["Category", form.category],
                  ["Inventory", form.stock !== ""],
                  ["Image", isEditing ? existingImageUrl || imageFile : imageFile],
                ].map(([label, done]) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full ${done ? "bg-ochi-green text-ochi-charcoal" : "border border-white/15 bg-white/5 text-white/20"}`}>
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Right panel - Form inputs */}
          <section className="space-y-8">
            <div className="grid gap-6 rounded-2xl border border-white/10 bg-[#1C1C1C] p-6 md:p-8 sm:grid-cols-2">
              <label className="space-y-2 sm:col-span-2">
                <span className={labelShell}>Product Name</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder="Wireless studio headphones"
                  className={fieldShell}
                />
              </label>

              <label className="space-y-2">
                <span className={labelShell}>Price ($)</span>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={updateField}
                  placeholder="149.00"
                  className={fieldShell}
                />
              </label>

              <label className="space-y-2">
                <span className={labelShell}>Stock Count</span>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={updateField}
                  placeholder="25"
                  className={fieldShell}
                />
              </label>

              <label className="space-y-2">
                <span className={labelShell}>Brand name</span>
                <input
                  name="brand"
                  value={form.brand}
                  onChange={updateField}
                  placeholder="ShopNest"
                  className={fieldShell}
                />
              </label>

              <div className="space-y-2 relative">
                <span className={labelShell}>Category</span>
                <select name="category" value={form.category} onChange={updateField} className={selectShell}>
                  <option value="" className="bg-[#1C1C1C]">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category} className="bg-[#1C1C1C]">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <label className="space-y-2">
                <span className={labelShell}>Rating</span>
                <input
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={updateField}
                  className={fieldShell}
                />
              </label>

              <label className="space-y-2">
                <span className={labelShell}>Reviews Count</span>
                <input
                  name="numReviews"
                  type="number"
                  min="0"
                  value={form.numReviews}
                  onChange={updateField}
                  className={fieldShell}
                />
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className={labelShell}>Description Specs</span>
                <textarea
                  name="description"
                  rows="6"
                  value={form.description}
                  onChange={updateField}
                  placeholder="Add materials, specs, fit, care notes, and anything shoppers should know."
                  className="w-full bg-[#212121] border border-white/10 focus:border-ochi-green hover:border-white/20 text-white rounded-2xl outline-none py-4 px-6 font-mono text-xs placeholder-white/20 transition-all duration-300 resize-none leading-relaxed"
                />
              </label>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              {isEditing ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving || deleting}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-500/20 text-rose-450 hover:bg-rose-600 hover:text-white px-6 py-3.5 font-mono text-xs uppercase tracking-wider font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  <span>Delete Spec Release</span>
                </button>
              ) : (
                <span className="hidden sm:block" />
              )}

              <div className="flex flex-col gap-3 sm:flex-row font-mono text-xs uppercase tracking-wider font-bold">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 hover:border-white/30 text-white/70 px-6 py-3.5 transition cursor-pointer"
                >
                  <span>Cancel</span>
                </Link>
                <button
                  type="submit"
                  disabled={saving || deleting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-ochi-green text-ochi-charcoal hover:bg-white hover:text-ochi-charcoal px-8 py-3.5 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin text-ochi-charcoal" />
                  ) : (
                    <Save className="h-4 w-4 text-ochi-charcoal" />
                  )}
                  <span>{saving ? "Saving" : submitLabel}</span>
                </button>
              </div>
            </div>
          </section>
        </form>

      </div>
    </main>
  );
}

export default AddProduct;
