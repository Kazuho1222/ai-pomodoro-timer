"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function TimerApp() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center">
						作業時間
					</CardTitle>
				</CardHeader>
				<CardContent>25:00</CardContent>
			</Card>
		</div>
	);
}
