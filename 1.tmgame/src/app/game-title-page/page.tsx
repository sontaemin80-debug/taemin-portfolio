"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

export default function GameTitlePage() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const floatingRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const container = floatingRef.current;
		if (!container) return;
		const el = container;
		let running = true;
		function addBlock() {
		if (!running) return;
		const block = document.createElement("div");
		const colors = ["I", "O", "T", "S", "Z", "J", "L"];
		const color = colors[Math.floor(Math.random() * colors.length)];
		block.className = `floating-block ${color}`;
		block.style.left = Math.random() * 100 + "%";
		block.style.animationDelay = Math.random() * 2 + "s";
		block.style.animationDuration = (Math.random() * 3 + 4) + "s";
		el.appendChild(block);
		setTimeout(() => {
			if (block.parentNode) block.parentNode.removeChild(block);
		}, 8000);
		}

		const getUser = async () => {
			const { data } = await supabase.auth.getUser();
			setUser(data.user);
			setLoading(false);
		};
		getUser();
		const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
			setUser(session?.user ?? null);
		});

		const interval = setInterval(addBlock, 1000);
		return () => {
			listener?.subscription.unsubscribe();
			running = false;
			clearInterval(interval)
		};
	}, [router]);

	const handleLogout = async () => {
		await supabase.auth.signOut();
		setUser(null);
		router.replace("/");
	};


	const displayName = user?.user_metadata?.full_name || user?.user_metadata?.display_name;
	return (
	<div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 overflow-hidden">
		<div ref={floatingRef} className="floating-blocks absolute top-0 left-0 w-full h-full pointer-events-none z-0" />
		<main className="main-container text-center text-white z-10 relative flex flex-col items-center justify-center w-full">
			<h1 className="text-4xl font-bold mb-4 drop-shadow-lg animate-pulse">미니게임 목록</h1>
			<p className="mb-8">
				{user && (displayName || user?.email) ? (
					<span>{displayName ? `${displayName} (${user?.email})님, 환영합니다!` : `${user?.email}님, 환영합니다!`}</span>
				) : (
					<span>게스트님 환영합니다!</span>
				)}
			</p>
			{user && (
				<button
					onClick={handleLogout}
					className="text-red-500 underline bg-transparent border-none cursor-pointer mb-8"
				>
					로그아웃
				</button>
			)}
			<div className="w-full max-w-md mx-auto text-center">
				<ul className="space-y-2">
					<li className="flex justify-center">
						<button
							onClick={() => router.push("/games/tetrix")}
							className="inline-block bg-indigo-500 text-white font-medium px-4 py-2 rounded-full shadow hover:bg-indigo-600 transition"
						>
							TMGame (퍼즐)
						</button>
					</li>
				</ul>
			</div>
		</main>
		<style jsx global>{`
			.floating-blocks { z-index: 1; }
			.floating-block {
			position: absolute;
			width: 30px;
			height: 30px;
			border-radius: 5px;
			animation: float 6s infinite linear;
			opacity: 0.3;
			}
			.floating-block.I { background: #00f0f0; }
			.floating-block.O { background: #f0f000; }
			.floating-block.T { background: #a000f0; }
			.floating-block.S { background: #00f000; }
			.floating-block.Z { background: #f00000; }
			.floating-block.J { background: #0000f0; }
			.floating-block.L { background: #f0a000; }
			@keyframes float {
			0% {
				transform: translateY(100vh) rotate(0deg);
				opacity: 0;
			}
			10% { opacity: 0.3; }
			90% { opacity: 0.3; }
			100% {
				transform: translateY(-100px) rotate(360deg);
				opacity: 0;
			}
			}
		`}</style>
		</div>
	);
}
