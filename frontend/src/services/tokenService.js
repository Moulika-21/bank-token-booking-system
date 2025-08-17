import axios from 'axios';
import api from "../api";

const BASE_URL = "/api";

export const getMyTokens = (userId) => {
	return api.get(`${BASE_URL}/tokens/user/${userId}`);
};

export const getAllTokens =() => {
	return api.get(`${BASE_URL}/tokens`);
};

export const getFilteredTokens = (branchId, serviceType) => {
	return api.get(`${BASE_URL}/tokens/filter`,{
		params : {branchId,serviceType}
	});
};

export const bookToken = (tokenData) => {
	return api.post(`${BASE_URL}/tokens/book`,tokenData);
};