import autos from '../functions/getProductsList/autos-mock.json';

const ProductService =  {
    async getProductsList() {
        return autos
    },

    async getProductById(id : string) {
        try {
            const auto = autos.find((auto) => auto.id === id);
            return await auto;
        }catch (e){
            console.log(e);
        }
    }
}

export default ProductService;