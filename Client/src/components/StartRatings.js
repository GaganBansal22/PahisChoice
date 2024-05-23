import React from 'react';
import { FaStar } from "react-icons/fa";
import { FaRegStarHalfStroke } from 'react-icons/fa6';

const StarRating = ({ rating ,fillColor,emptyColor}) => {
    const fullStars = Math.floor(rating);
    const partialStar = rating - fullStars;
    const stars = [];
    for (let i = 0; i < fullStars; i++)
        stars.push(<FaStar key={crypto.randomUUID()} className={fillColor} />);
    if (partialStar > 0) {
        if(partialStar<0.5)
            stars.push(<FaStar key={crypto.randomUUID()} className={emptyColor} />)
        else 
            stars.push(<FaRegStarHalfStroke key={crypto.randomUUID()} className={fillColor} />)
    }
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++)
        stars.push(<FaStar key={crypto.randomUUID()} className={emptyColor} />)
    return (
        <>
            {stars}
        </>
    );
};

export default StarRating;
