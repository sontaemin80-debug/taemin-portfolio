"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

export default function GameTitlePage() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const getUser = async () => {
			const { data } = await supabase.auth.getUser();
			setUser(data.user);
			setLoading(false);
			if (!data.user) {
				router.replace("/login");
			}
		};
		getUser();
		const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
			setUser(session?.user ?? null);
			if (!session?.user) {
				router.replace("/login");
			}
		});
		return () => {
			listener?.subscription.unsubscribe();
		};
	}, [router]);

	const handleLogout = async () => {
		await supabase.auth.signOut();
		setUser(null);
		router.replace("/");
	};

	if (loading) return null;

		const displayName = user?.user_metadata?.full_name || user?.user_metadata?.display_name;
			return (
				<main className="flex min-h-screen flex-col items-center justify-center">
					<h1 className="text-4xl font-bold mb-4">게임 타이틀 페이지</h1>
					<p className="mb-8">
						환영합니다. {displayName ? `${displayName} (${user?.email})` : user?.email}!
					</p>
					<button
						onClick={handleLogout}
						className="text-red-500 underline bg-transparent border-none cursor-pointer mb-8"
					>
						로그아웃
					</button>
					<div className="w-full max-w-md">
						<h2 className="text-2xl font-semibold mb-4">미니게임 리스트</h2>
						<ul className="space-y-2">
							<li>
								<button
									onClick={() => router.push("/games/tetrix")}
									className="w-full text-left p-4 bg-gray-100 rounded hover:bg-blue-100 transition"
								>
									테트리스 게임
								</button>
							</li>
						</ul>
					</div>
				</main>
			);
}