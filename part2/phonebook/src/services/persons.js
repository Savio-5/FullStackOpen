import axios from "axios";
const baseUrl = "https://savio-5-ominous-waddle-9gxpvg469vcx6jg-3001.preview.app.github.dev/api/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};
const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

const personService = { 
  getAll, 
  create,
  remove,
  update
};

export default personService
