import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import { useNavigate } from "react-router";

const Home = () => {
	const products = useSelector((state) => state.product.products);
	const { handleGetAllProducts } = useProduct();
	const navigate = useNavigate();

	useEffect(() => {
		handleGetAllProducts();
	}, []);

	return (
		<div
			className='min-h-screen w-full bg-[#FAF8F5] text-[#1a1a1a]'
			style={{ fontFamily: "'Inter', sans-serif" }}
		>
			{/* ── Navbar ────────────────────────────────────────────────────────── */}
			<header className='sticky top-0 z-50 flex items-center justify-between px-6 sm:px-10 lg:px-14 xl:px-20 py-5 bg-[#FAF8F5]/80 backdrop-blur-md border-b border-[#e0ddd8]'>
				<div className='flex items-center gap-2'>
					<h1
						className='text-xl md:text-2xl font-bold tracking-widest uppercase cursor-pointer'
						style={{ fontFamily: "'Playfair Display', serif" }}
						onClick={() => navigate("/")}
					>
						Snitch
					</h1>
				</div>
				<nav className='hidden md:flex items-center gap-8 text-[11px] tracking-[0.15em] uppercase font-semibold text-[#555]'>
					<span className='hover:text-[#1a1a1a] transition-colors cursor-pointer'>
						Shop
					</span>
					<span className='hover:text-[#1a1a1a] transition-colors cursor-pointer'>
						Collections
					</span>
					<span className='hover:text-[#1a1a1a] transition-colors cursor-pointer'>
						Editorial
					</span>
				</nav>
				<div className='flex items-center gap-5'>
					<button
						onClick={() => navigate("/login")}
						className='text-[11px] tracking-[0.15em] uppercase font-semibold hover:text-[#C9A96E] transition-colors cursor-pointer'
					>
						Account
					</button>
				</div>
			</header>

			{/* ── Hero Section ──────────────────────────────────────────────────── */}
			<section className='relative w-full h-[60vh] md:h-[75vh] flex items-center justify-center overflow-hidden'>
				<img
					src='https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=90&w=2070&auto=format&fit=crop'
					alt='Hero Fashion'
					className='absolute inset-0 w-full h-full object-cover object-top opacity-90'
				/>
				<div className='absolute inset-0 bg-black/30' />
				<div className='relative z-10 flex flex-col items-center text-center px-4 mt-12'>
					<p className='text-white/90 text-[10px] md:text-xs tracking-[0.3em] uppercase mb-4 font-medium drop-shadow-md'>
						The New Aesthetic
					</p>
					<h2
						className='text-white text-4xl md:text-6xl lg:text-7xl leading-tight mb-8 drop-shadow-lg'
						style={{ fontFamily: "'Playfair Display', serif" }}
					>
						Curated <br /> <em>Elegance.</em>
					</h2>
					<button
						className='px-8 py-3.5 bg-white text-[#1a1a1a] text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 cursor-pointer shadow-xl'
						onClick={() => {
							document
								.getElementById("collection")
								?.scrollIntoView({ behavior: "smooth" });
						}}
					>
						Explore Collection
					</button>
				</div>
			</section>

			{/* ── Product Grid Section ──────────────────────────────────────────── */}
			<section
				id='collection'
				className='w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20 py-24'
			>
				<div className='flex flex-col items-center text-center mb-16'>
					<span
						className='text-[10px] tracking-[0.25em] uppercase font-semibold mb-3'
						style={{ color: "#C9A96E" }}
					>
						Latest Arrivals
					</span>
					<h3
						className='text-3xl md:text-4xl text-[#1a1a1a]'
						style={{ fontFamily: "'Playfair Display', serif" }}
					>
						The Collection
					</h3>
				</div>

				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16'>
					{products && products.length > 0 ? (
						products.map((product) => (
							<ProductCard key={product._id} product={product} />
						))
					) : (
						<div className='col-span-full py-20 text-center text-[#888] text-sm tracking-widest uppercase'>
							No pieces available at the moment.
						</div>
					)}
				</div>
			</section>

			{/* ── Footer ────────────────────────────────────────────────────────── */}
			<footer className='w-full bg-[#1a1a1a] text-white py-16 px-6 sm:px-10 lg:px-14 xl:px-20 text-center'>
				<h2
					className='text-2xl mb-6 tracking-widest uppercase'
					style={{ fontFamily: "'Playfair Display', serif" }}
				>
					Snitch
				</h2>
				<p className='text-[10px] tracking-[0.2em] text-[#888] uppercase'>
					© {new Date().getFullYear()} Snitch Fashion. All Rights Reserved.
				</p>
			</footer>
		</div>
	);
};

const ProductCard = ({ product }) => {
	const coverImg =
		product.images?.[0]?.url ||
		"https://via.placeholder.com/400x500?text=No+Image";
	const hoverImg = product.images?.[1]?.url || coverImg;

	return (
		<div className='group cursor-pointer flex flex-col'>
			<div className='relative w-full aspect-[3/4] overflow-hidden bg-[#e0ddd8] mb-5'>
				{/* Primary Image */}
				<img
					src={coverImg}
					alt={product.title}
					className='absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0'
				/>
				{/* Hover Image */}
				<img
					src={hoverImg}
					alt={`${product.title} alternate`}
					className='absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-105'
				/>
				{/* Quick Add Overlay */}
				<div className='absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out'>
					<button className='w-full py-3.5 bg-white/95 backdrop-blur text-[#1a1a1a] text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-[#1a1a1a] hover:text-white transition-colors shadow-lg'>
						Quick Add
					</button>
				</div>
			</div>

			<div className='flex flex-col gap-1.5 px-1'>
				<h4 className='text-[13px] font-semibold text-[#1a1a1a] truncate tracking-wide'>
					{product.title}
				</h4>
				<p className='text-[12px] text-[#555] tracking-wider font-medium'>
					{product.price?.currency === "INR"
						? "₹"
						: product.price?.currency === "USD"
						? "$"
						: product.price?.currency}{" "}
					{product.price?.amount?.toLocaleString()}
				</p>
			</div>
		</div>
	);
};

export default Home;
