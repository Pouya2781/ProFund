import { useState } from "react";
import Button from "./Button";

interface Props {
  title: string;
  description: string;
  id: number;
  limit: number;
  boughtCount: number;
  price: number;
  onBuy: (text: string) => void;
}

const TokenCart = ({
  title,
  id,
  description,
  limit,
  price,
  boughtCount,
  onBuy,
}: Props) => {
  const [remaining, setRemaining] = useState(limit - boughtCount);

  const handleClick = async () => {
    const res = await fetch("http://localhost:3000/api/user/invest", {
      method: "POST",
      headers: {
        "x-auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNDhjODA1NjctNGNmYi00MGI4LWI1Y2MtMWNhYjU0ZGY5NTlkIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2ODUyODAzNjR9.QhgBQmqZskspk5BRPMZm7x4AlE6aAEqMLAoLZKz34Ns",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        count: 1,
      }),
    });

    if (!res.ok) {
        return onBuy("Something went wrong!");
    }

    const json = await res.json();
    const data = json.data;
    console.log(data);
    onBuy("You bought the token successfully!");
    setRemaining(r => r - 1);
  };

  return (
    <div className="tkn">
      <div className="tkn-title"><strong>{title}</strong></div>
      <div className="tkn-description"><strong>Description:</strong><br/>{description}</div>
      <div className="tkn-stock">
      <strong>Remaining: </strong>{remaining}/{limit}
      </div>
      <div className="tkn-price"><strong>Price: </strong>{price} <em>Rial</em></div>
      <hr className="tkn-price-divider" />
      <Button color="primary" className="tkn-btn" onClick={handleClick}>
        Buy
      </Button>
    </div>
  );
};

export default TokenCart;
