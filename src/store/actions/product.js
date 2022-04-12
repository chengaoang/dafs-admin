import {listApi} from "../../services/products";
export const loadProduct = payload => async dispatch=>{
    // console.log("loadProduct Action: ");console.log(payload)
    const res = await listApi();
    // 当异步操作完成之后通过dispatch出发reducer改变数据
    dispatch({
        type: 'PRODUCT_LOADED',
        payload: res
    })
}
