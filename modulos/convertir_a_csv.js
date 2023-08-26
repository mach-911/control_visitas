export function handle(inputData) {
	const headers = Object.keys(inputData[0]).toString();
	const main = inputData.map(item => {
		return Object.values(item).toString()
	})
	const csv = [headers, ...main].join("\n");
	startCSVDownload(csv);
}

function startCSVDownload(input) {
	const blob = new Blob([input], {type: 'application/csv'});
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	const date = new Date();
	a.download = date.toISOString().split('T')[0] + '.csv'
	a.href = url;
	a.style.display = 'none';

	document.body.appendChild(a);

	a.click();
	a.remove();
	URL.revokeObjectURL(url);

}