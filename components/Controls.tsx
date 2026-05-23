import { Button } from "./ui/button";

interface ControlsProps {
	onStart: () => void;
	onReset: () => void;
	onModeToggle: () => void;
	isRunning: boolean;
}

export default function Controls({
	onStart,
	onReset,
	onModeToggle,
	isRunning,
}: ControlsProps) {
	return (
		<div className="flex flex-col items-center gap-4">
			<Button variant="default" size="lg" onClick={onStart}>
				{isRunning ? "停止" : "開始"}
			</Button>
			<Button variant="secondary" size="lg" onClick={onReset}>
				リセット
			</Button>
			<Button
				variant="ghost"
				onClick={onModeToggle}
				className="text-muted-foreground hover:text-foreground"
			>
				モード切り替え
			</Button>
		</div>
	);
}
