import Axios from 'axios';

const api = Axios.create({
    baseURL: "http://localhost:5000/api"
});

const getCategories = () => {
    return api.get("/Categoria")
};

export default { getCategories };