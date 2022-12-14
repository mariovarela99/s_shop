import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  LocalStorageGet,
  LocalStorageSet,
  PRODUCT_KEY_NAME,
} from "../../../utils/localStorage";
import { toast } from "react-toastify";

export interface itemProductState {
  id: string;
  qtd: number;
  product: string;
  desc: string;
  price: number;
}

export interface ProductState {
  items: itemProductState[];
}

const ProductsLocal: ProductState = JSON.parse(
  LocalStorageGet(PRODUCT_KEY_NAME) || "{}"
);

const initialState: ProductState = {
  items: ProductsLocal?.items || ([] as itemProductState[]),
};

export const productSlice = createSlice({
  name: "products",
  initialState,

  reducers: {
    add: (state, action: PayloadAction<itemProductState>) => {
      const filtered = state.items.filter(
        (item: itemProductState) => item.product === action.payload.product
      );
      if (filtered.length > 0) return state;
      state.items.push(action.payload);
      LocalStorageSet(PRODUCT_KEY_NAME, JSON.stringify(state));
      toast.success("Produto Criado com Sucesso");
    },
    remove: (state, action: PayloadAction<{ id: string }>) => {
      const filtered = state.items.filter(
        (item: itemProductState) => item.id !== action.payload.id
      );
      state.items = filtered;
      LocalStorageSet(PRODUCT_KEY_NAME, JSON.stringify(state));
      toast.success("Produto deletado com Sucesso");
    },
    edit: (
      state,
      action: PayloadAction<{ id: string; newProduct: itemProductState }>
    ) => {
      const filtered = state.items.filter(
        (item: itemProductState) => item.id !== action.payload.id
      );
      if (filtered.length === 0) {
        toast.error("Erro ao eliminar produto");
        return state;
      }
      const index = state.items.findIndex(
        (item: itemProductState) => item.id === action.payload.id
      );
      state.items[index] = action.payload.newProduct;
      LocalStorageSet(PRODUCT_KEY_NAME, JSON.stringify(state));
      toast.success("Produto Editado com Sucesso");
    },
  },
});

export const { add, remove, edit } = productSlice.actions;

export default productSlice.reducer;
