import React, { lazy } from 'react'



const HomeSlider = lazy(()=>import('./HomeSlider'));
const HomePageProductListing = lazy(()=>import('./HomePageProductListing'));

export default function Home() {
    return (
        <>
            <HomeSlider/>
            <HomePageProductListing/>
        </>
    )
}
