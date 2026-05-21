import { Button } from "./ui/button";

export default function Controls() {
	return (
		<div className="flex gap-4">
			<Button variant="default" size="lg">
				開始
			</Button>
			<Button variant="secondary" size="lg">
				リセット
			</Button>
		</div>
	);
}
