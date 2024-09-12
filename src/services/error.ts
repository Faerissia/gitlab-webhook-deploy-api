
export const ErrorModel = (data:string) => {
	return {
		error: true, 
		message: data
	};
};