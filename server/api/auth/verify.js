import axios from "axios";

export default defineEventHandler(async (event) => {
	console.log("Received body:");
	const body = await readBody(event);
	const {mobile, otp} = body;

	try {
		const response = await axios.post(
			"https://api.pateh.com/ath/auth/validate-otp",
			{mobile, otp}
		);
		console.log(response);
		return response.data;
	} catch (error) {
		throw createError({statusCode: 500, statusMessage: "خطا در تأیید کد OTP"});
	}
});
