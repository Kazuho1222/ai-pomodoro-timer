"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReward } from "react-rewards";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { generateRefreshSuggestion } from "@/utils/gemini";
import { playNotificationSound } from "@/utils/sound";
import Controls from "./Controls";
import MetadataUpdater from "./MetadataUpdater";
import RefreshSuggestion from "./RefreshSuggestion";
import TimerDisplay from "./TimerDisplay";

// タイマーのモードを表す型
type Mode = "work" | "break";

export default function TimerApp() {
	const { reward: confetti } = useReward("confettiReward", "confetti", {
		elementCount: 100,
		spread: 70,
		decay: 0.93,
		lifetime: 150,
	});

	// タイマーの実行状態を管理するstate
	const [isRunning, setIsRunning] = useState(false);

	// 作業時間・休憩時間を管理する状態変数
	const [workDuration, setWorkDuration] = useState(25);
	const [breakDuration, setBreakDuration] = useState(5);

	// タイマーの残り時間を保持する状態変数
	const [timeLeft, setTimeLeft] = useState({
		minutes: workDuration,
		seconds: 0,
	});

	// モードの状態を管理する変数
	const [mode, setMode] = useState<Mode>("work");

	// 自動開始の設定
	const [autoStart, setAutoStart] = useState(false);

	// リフレッシュ提案
	const [refreshSuggestion, setRefreshSuggestion] = useState<string | null>(
		null,
	);
	// 提案取得フラグ
	const [hasFetchedSuggestion, setHasFetchedSuggestion] = useState(false);
	// 取得中かどうかを管理するRef（useStateより即時性が高く、二重実行を防ぐのに適している）
	const isFetchingRef = useRef<boolean>(false);

	// モードを切り替える関数
	const toggleMode = () => {
		// 現在のモードを反対のモードに切り替える
		const newMode = mode === "work" ? "break" : "work";
		setMode(newMode);

		// モードに応じてタイマーの時間をリセット
		// 作業モードなら25分、休憩モードなら5分
		setTimeLeft({
			minutes: newMode === "work" ? workDuration : breakDuration,
			seconds: 0,
		});

		// 提案取得フラグをリセット
		setHasFetchedSuggestion(false);
		isFetchingRef.current = false;
	};

	// リフレッシュ提案をタイマー実行中の休憩モード時のみ取得
	useEffect(() => {
		// すでに提案がある、取得済み、または現在取得中の場合は実行しない
		if (
			isRunning &&
			mode === "break" &&
			!hasFetchedSuggestion &&
			!isFetchingRef.current
		) {
			isFetchingRef.current = true;
			generateRefreshSuggestion()
				.then((suggestion) => {
					setRefreshSuggestion(suggestion);
					setHasFetchedSuggestion(true);
				})
				.catch((error) => {
					console.error(error);
					isFetchingRef.current = false; // エラー時は再試行可能にするために解除
				});
		}
	}, [isRunning, mode, hasFetchedSuggestion]);

	// 開始/停止ボタンのハンドラ
	const handleStart = () => {
		setIsRunning(!isRunning);
	};

	// リセットボタンのハンドラ
	const handleReset = () => {
		setIsRunning(false);
		setTimeLeft({
			minutes: mode === "work" ? workDuration : breakDuration,
			seconds: 0,
		});
	};

	// 提案を閉じるハンドラ（メモ化して再レンダリングによるタイマーリセットを防ぐ）
	const handleCloseSuggestion = useCallback(() => {
		setRefreshSuggestion(null);
	}, []);

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
							if (mode === "work") {
								void confetti(); // 紙吹雪を表示
							}
							void playNotificationSound();

							// 少し遅延させてからモード切り替えと自動開始を実行
							setTimeout(() => {
								toggleMode(); // モードを自動切り替え
								if (autoStart) {
									setIsRunning(true); // 自動開始がONの場合は次のセッションを開始
								}
							}, 100);
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
	}, [isRunning, mode, autoStart]); // 依存配列に mode と autoStart を追加

	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
			<span
				id="confettiReward"
				className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
			/>
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl font-bold  text-center">
						{mode === "work" ? "作業時間" : "休憩時間"}
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col items-center gap-6">
					<TimerDisplay
						minutes={timeLeft.minutes}
						seconds={timeLeft.seconds}
						mode={mode}
					/>
					<Controls
						onStart={handleStart}
						onReset={handleReset}
						onModeToggle={toggleMode}
						isRunning={isRunning}
					/>
				</CardContent>
				<CardFooter className="flex flex-col gap-4 w-full max-w-[200px] mx-auto">
					{/* 作業時間の設定 */}
					<div className="flex items-center gap-2">
						<label className="text-sm font-medium min-w-18">
							作業時間
							<input type="hidden" />
						</label>
						<select
							value={workDuration}
							onChange={(e) => {
								const newDuration = parseInt(e.target.value, 10);
								setWorkDuration(newDuration);
								if (mode === "work" && !isRunning) {
									setTimeLeft({ minutes: newDuration, seconds: 0 });
								}
							}}
							className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
						>
							{[5, 10, 15, 25, 30, 45, 60].map((minutes) => (
								<option key={minutes} value={minutes}>
									{minutes}分
								</option>
							))}
						</select>
					</div>

					{/* 休憩時間の設定 */}
					<div className="flex items-center gap-2">
						<label className="text-sm font-medium min-w-18">
							休憩時間
							<input type="hidden" />
						</label>
						<select
							value={breakDuration}
							onChange={(e) => {
								const newDuration = parseInt(e.target.value, 10);
								setBreakDuration(newDuration);
								if (mode === "break" && !isRunning) {
									setTimeLeft({ minutes: newDuration, seconds: 0 });
								}
							}}
							className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
						>
							{[5, 10, 15].map((minutes) => (
								<option key={minutes} value={minutes}>
									{minutes}分
								</option>
							))}
						</select>
					</div>

					{/* 自動開始の設定 */}
					<div className="flex items-center gap-2 w-full justify-between">
						<label className="text-sm font-medium min-w-18">
							自動開始
							<input type="hidden" />
						</label>
						<Switch
							checked={autoStart}
							onCheckedChange={() => setAutoStart(!autoStart)}
							className="cursor-pointer"
						/>
					</div>
				</CardFooter>
			</Card>
			<MetadataUpdater
				minutes={timeLeft.minutes}
				seconds={timeLeft.seconds}
				mode={mode}
			/>
			<RefreshSuggestion
				suggestion={refreshSuggestion}
				onClose={handleCloseSuggestion}
			/>
		</div>
	);
}
