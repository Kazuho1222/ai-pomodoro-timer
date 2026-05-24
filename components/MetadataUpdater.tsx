import React, { useEffect } from "react";

interface MetadataUpdaterProps {
	minutes: number;
	seconds: number;
	mode: "work" | "break";
}

export default function MetadataUpdater({
	minutes,
	seconds,
	mode,
}: MetadataUpdaterProps) {
	useEffect(() => {
		const timeString = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
		const modeString = mode === "work" ? "作業" : "休憩";
		// タイトルを更新
		document.title = `(${timeString}) ${modeString} - AI Pomodoro Timer`;
	}, [minutes, seconds, mode]);
	return null;
}
