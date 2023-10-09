"use server";

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDb } from "../mongoose";
import { scrapeAmazonProduct } from "../scrapper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";

export async function scrapeAndStoreProduct(productUrl : string) {

    if(!productUrl) return;

    try {
        connectToDb();
        const scrappedProduct = await scrapeAmazonProduct(productUrl);

        if(!scrappedProduct) return;

        let product = scrappedProduct;

        const existingProduct = await Product.findOne({url:scrappedProduct.url})

        if(existingProduct) {
            const updatedPriceHistory:any = [
                ...product.priceHistory,
                {price:scrappedProduct.currentPrice}
            ]

            product = {
                ...scrappedProduct,
                priceHistory:updatedPriceHistory,
                lowestPrice:getLowestPrice(updatedPriceHistory),
                highestPrice:getHighestPrice(updatedPriceHistory),
                averagePrice:getAveragePrice(updatedPriceHistory)
            }
        }

        const newProduct = await Product.findOneAndUpdate({
            url:scrappedProduct.url,},
            product,
            {upsert:true,new:true}
        );

        revalidatePath(`/products/${newProduct._id}`);
        
    } catch(error:any) {
        throw new Error(`Failed to create/update product ${error.message}`);
    }
}

export async function getProductById(productId:string) {

    try {
        connectToDb();

        const product = await Product.findOne({_id:productId});
        if(!product) return null;

        return product;

    } catch(error:any) {
        throw new Error(`Failed to fetch product ${error.message}`);
    }
}

export async function getAllProducts() {

    try{
        connectToDb();

        const products = await Product.find();

        return products;

    } catch(error:any) {
        throw new Error(`Failed to fetch products ${error.message}`);
    }
}

export async function getSimilarProducts(productId:String) {
    try {

        connectToDb();

        const currentProduct = await Product.findById(productId);

        if(!currentProduct) return null;

        const similarProducts = await Product.find({
            _id: {$ne:productId}
        }).limit(3);

        return similarProducts;

    } catch(error) {
        console.log(error);
    }
}