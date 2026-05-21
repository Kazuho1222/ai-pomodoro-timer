"use client";

import { useState } from "react";
import Controls from "./Controls";
import TimerDisplay from "./TimerDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function TimerApp() {
	// タイマーの実行状態を管理するstate
	const [isRunning, setIsRunning] = useState(false);

	// 開始/停止ボタンのハンドラ
	const handleStart = () => {
		setIsRunning(!isRunning);
	};

	// リセットボタンのハンドラ
	const handleReset = () => {
		setIsRunning(false);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center">
						作業時間
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col items-center gap-6">
					<TimerDisplay minutes={25} seconds={0} />
					<Controls
						onStart={handleStart}
						onReset={handleReset}
						isRunning={isRunning}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
