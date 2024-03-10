import React from "react";

interface Card{
    id : number;
    name: string;
    email : string;
}

const CardComponent: React.FC<{card : Card}> = ({card}) => {
    return (
        <div>
              <p className="text-gray-600">{card.id}</p>
              <h2 className="text-xl font-semibold">{card.name}</h2>
              <p className="text-gray-600">{card.email}</p>
        </div>
    );

};

export default CardComponent; 


