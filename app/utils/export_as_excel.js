const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF=8';

const EXCEL_EXTENSION = '.xlsx';

export function downloadAsExcel(data) {
	const worksheet = XLSX.utils.json_to_sheet(data);

	const max_width = data.reduce((w, r) => Math.max(w, r.nombre.length), 10);
	worksheet["!cols"] = [ { wch: 11 }, { wch: max_width }, { wch: 10 }, {wch: 16}];

	const header_font = {
			name: "Calibri",
			sz: 12,
			bold: true,
			color: { rgb: "F9F9F9" },
	}
	const header_fill = {
		patternType: "solid",
		fgColor: { rgb: "028720" },
		bgColor: { rgb: "0000FF" }
	}

	const headers_border = {
		bottom: { style: "medium", color: "050403" },
		left: { style: "medium", color: "050403" },
		right: { style: "medium", color: "050403" },
		top: { style: "medium", color: "050403" },
	}

	worksheet["A1"].s = {
		font: header_font,
		fill: header_fill,
		border: headers_border
	};
	worksheet["B1"].s = {
		font: header_font,
		fill: header_fill,
		border: headers_border
	};
	worksheet["C1"].s = {
		font: header_font,
		fill: header_fill,
		border: headers_border
	};
	worksheet["D1"].s = {
		font: header_font,
		fill: header_fill,
		border: headers_border
	};

	worksheet["E1"].s = {
		font: header_font,
		fill: header_fill,
		border: headers_border
	};

	const workbook = {
		Sheets: {
			'visitas': worksheet
		},
		SheetNames: ['visitas']
	};

	const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'})
	saveAsExcel(excelBuffer, new Date().toISOString().split('T')[0]);
}


function saveAsExcel(buffer, filename) {
	const data = new Blob([buffer], {type: EXCEL_TYPE})
	saveAs(data, filename);
}