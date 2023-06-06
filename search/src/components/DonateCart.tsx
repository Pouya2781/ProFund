import Button from "./Button";

interface Props {
  id: number;
  onDonate: (text: string) => void;
}

const DonateCart = ({ id, onDonate }: Props) => {
  const handleClick = async () => {
    console.log((document.getElementById("donate") as HTMLInputElement).value);
    const res = await fetch("http://localhost:3000/api/user/donate", {
      method: "POST",
      headers: {
        "x-auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNDhjODA1NjctNGNmYi00MGI4LWI1Y2MtMWNhYjU0ZGY5NTlkIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2ODUyODAzNjR9.QhgBQmqZskspk5BRPMZm7x4AlE6aAEqMLAoLZKz34Ns",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        amount: Number((document.getElementById("donate") as HTMLInputElement).value),
      }),
    });

    if (!res.ok) {
        return onDonate("Something went wrong!");
    }

    const json = await res.json();
    const data = json.data;
    console.log(data);
    onDonate("You donated to this project successfully!");
  };

  return (
    <div className="dnt">
      <div className="dnt-title"><strong>Donate</strong></div>
      <div className="dnt-description">
        Thank you for your generous donations to this project! Your support
        means the world to us and makes a significant difference in developing
        this project. We are grateful for your kindness and commitment to our
        cause.
      </div>
      <div className="dnt-price-field"><strong>Donation amount:</strong></div>
      <input id="donate" className="dnt-amount" type="text" defaultValue="10000"/>
      <div className="dnt-note">
        List of donations will be available in you work history!
      </div>
      <Button color="primary" className="tkn-btn" onClick={handleClick}>
        Donate
      </Button>
    </div>
  );
};

export default DonateCart;
