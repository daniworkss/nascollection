// store context
import {create} from 'zustand';

const useStoreDetails = create((set) => ({
 storeData: {},
 products: [],

 setStoreData: (storeData) => set({ storeData }),
 setProducts: (products) => set({ products }),

}))

export default useStoreDetails;