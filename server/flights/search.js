import axios from 'axios';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const response = await axios.get('https://api.pateh.com/gateway/api/bridge/flight/search-foreign', { params: query });
  return response.data;
});
