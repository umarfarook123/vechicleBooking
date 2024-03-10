
const sendResponse = (res, status, data, message, count) => {
	data = Boolean(data) ? data : undefined;
	message = Boolean(message) ? message : undefined;
	
	if (status == true) {
		res.json({
			status: status,
			message: message ? message : 'Success',
			data: data,
			count: count
		});
		res.end();
	} else if (status == false) {
		res.json({
			status: status,
			message: message ? message : 'Data not found',
			data: data,
			count: count
		});
		res.end();
	} else {
		res.json({
			status: false,
			message: message ? message : 'Something went wrong',
			error: data
		});
		res.end();
	}
}

module.exports = sendResponse;