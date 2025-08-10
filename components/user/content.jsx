import { useState } from "react";
import ProductGrid from "../product-grid";

export default function Content(){
    return(
        <div className="bg-gray-50/70 px-[10px] py-[20px]">
            <div className="pt-[1rem] px-[10px] md:w-[60%] md:mx-auto lg:w-[40%] lg:mx-auto  space-y-[20px]">
                <h1 className="text-[26px]  font-optima-medium lg:text-[32px] text-center">NEW ADDITIONS</h1>
                <ProductGrid />
            </div>
        </div>
    )
}