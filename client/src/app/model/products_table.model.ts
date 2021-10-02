export default interface ProductsTableModel{
    product_id?:number
    product_name:string
    category_id_ref:number
    price_in_usd:number
    price_type:string
    picture_url:string
    category_id?:number
    category_name?:string
}