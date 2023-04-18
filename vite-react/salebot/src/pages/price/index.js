import React from 'react';
import prices from '../../assets/images/price.jpeg';

const Price = () => {
    return (
        <div className="mt-4 mb-10 w-[65%] sm:min-h-[72vh] min-h-[78vh] sm:w-full md:w-full lg:-w-full max-w-6xl mx-auto  sm:mt-6 sm:px-4">
            <img className=" shadow  w-full" src={prices} alt="price" />
        </div>
    );
};

export default Price;
