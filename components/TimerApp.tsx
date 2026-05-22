"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Controls from "./Controls";
import TimerDisplay from "./TimerDisplay";

export default function TimerApp() {
	// タイマーの実行状態を管理するstate
	const [isRunning, setIsRunning] = useState(false);

	// タイマーの残り時間を保持する状態変数
	const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 3 });

	// 開始/停止ボタンのハンドラ
	const handleStart = () => {
		setIsRunning(!isRunning);
	};

	// リセットボタンのハンドラ
	const handleReset = () => {
		setIsRunning(false);
		setTimeLeft({ minutes: 25, seconds: 0 });
	};

	useEffect(() => {
		// setIntervalの戻り値（タイマーID）を保持する変数
		let intervalId: NodeJS.Timeout;

		// タイマーが実行中の場合のみ処理を行う
		if (isRunning) {
			// 1秒（1000ミリ秒）ごとに実行される処理を設定しつつ、
			// 戻り値（タイマーID）を intervalId 変数に再セット
			intervalId = setInterval(() => {
				setTimeLeft((prev) => {
					// 秒数が0の場合
					if (prev.seconds === 0) {
						// 分数が0の場合（タイマー終了）
						if (prev.minutes === 0) {
							setIsRunning(false); // タイマーを停止
							return prev; // 現在の状態（0分0秒）を返す
						}
						// 分数がまだ残っている場合は、分を1減らして秒を59にセット
						return { minutes: prev.minutes - 1, seconds: 59 };
					}
					// 秒数が1以上の場合は、秒を1減らす
					return { ...prev, seconds: prev.seconds - 1 };
				});
			}, 1000);
		}

		// クリーンアップ関数（コンポーネントのアンマウント時やisRunningが変わる前に実行される）
		return () => {
			// ブラウザのタイマーが設定されている場合は、それをクリアする
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [isRunning]); // isRunningが変わったときだけこのエフェクトを再実行

	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl font-bold  text-center">
						作業時間
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col items-center gap-6">
					<TimerDisplay minutes={timeLeft.minutes} seconds={timeLeft.seconds} />
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
