import axios from "axios";


export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const {mobile} = body;

	try {
		const response = await axios.post(
			"https://api.pateh.com/ath/auth/login-or-register",
			{mobile}
		);
	
		return response.data;
	} catch (error) {
		throw createError({
			statusCode: 500,
			statusMessage: "خطا در ارسال شماره موبایل",
		});
	}
});
