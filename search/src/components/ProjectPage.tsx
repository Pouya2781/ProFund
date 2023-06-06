import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ProjectCartDetailed from "./ProjectCartDetailed";
import ProjectCartDetailedPlaceholder from "./ProjectCartDetailedPlaceholder";
import TokenCart from "./TokenCart";
import DonateCart from "./donateCart";
import Alert from "./Alert";
import TokenCartPlaceholder from "./TokenCartPlaceholder";

interface Props {
  onRedirect: (path: string) => void;
}

interface Token {
  id: number;
  description: string;
  boughtCount: number;
  limit: number;
  price: number;
}

interface Project {
  id: number;
  title: string;
  subtitle: string;
  expirationDate: string;
  investedAmount: number;
  goal: number;
}

const ProjectPage = ({ onRedirect }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const [title, setTitle] = useState("title");
  const [subtitle, setSubtitle] = useState("subtitle");
  const [category, setCategory] = useState("Default");
  const [expirationDate, setExpirationDate] = useState("0");
  const [investedAmount, setInvestedAmount] = useState(0);
  const [investorCount, setInvestorCount] = useState(0);
  const [goal, setGoal] = useState(0);
  const [id, setId] = useState(-1);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [text, setText] = useState("");

  const idParam = useParams().id;

  const handleBuy = (message: string) => {
    setShowAlert(true);
    setText(message);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const handleDonate = (message: string) => {
    setShowAlert(true);
    setText(message);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  useEffect(() => {
    setId(Number(idParam));
    setIsLoading(true);

    const getProjectInfo = async () => {
      const res = await fetch("http://localhost:3000/api/project/info", {
        method: "POST",
        headers: {
          "x-auth-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNDhjODA1NjctNGNmYi00MGI4LWI1Y2MtMWNhYjU0ZGY5NTlkIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2ODUyODAzNjR9.QhgBQmqZskspk5BRPMZm7x4AlE6aAEqMLAoLZKz34Ns",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });

      if (!res.ok) return;

      const json = await res.json();
      const data = json.data;
      setTitle(data.title);
      setSubtitle(data.subtitle);
      setInvestedAmount(data.investedAmount);
      setInvestorCount(data.investorCount);
      setCategory(data.category);
      setGoal(data.goal);
      setExpirationDate(data.expirationDate);
      setIsLoading(false);
    };

    const getProjectTokens = async () => {
      setIsLoadingToken(true);

      const res = await fetch("http://localhost:3000/api/project/tokens", {
        method: "POST",
        headers: {
          "x-auth-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNDhjODA1NjctNGNmYi00MGI4LWI1Y2MtMWNhYjU0ZGY5NTlkIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2ODUyODAzNjR9.QhgBQmqZskspk5BRPMZm7x4AlE6aAEqMLAoLZKz34Ns",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });

      if (!res.ok) return;

      const json = await res.json();
      const data = json.data;
      // console.log(data);
      setTokens(data);
      setIsLoadingToken(false);
    };

    getProjectInfo();
    getProjectTokens();
  }, [id]);

  return (
    <>
      <div className="project-top">
        {isLoading && <ProjectCartDetailedPlaceholder />}
        {!isLoading && (
          <ProjectCartDetailed
            title={title}
            subtitle={subtitle}
            expiration={expirationDate}
            investedAmount={investedAmount}
            investorCount={investorCount}
            goal={goal}
            category={category}
            id={id}
            key={id}
          />
        )}
      </div>
      <div className="project-middle">
        <div className="project-middle-middle">
          <div className="prj-support-title">
            <strong>How to support:</strong>
          </div>
          <div className="project-invest">
            <div className="project-donate">
              <DonateCart id={id} onDonate={handleDonate} />
            </div>
            <div className="project-token">
              {isLoadingToken && (
                <>
                  <TokenCartPlaceholder />
                  <TokenCartPlaceholder />
                  <TokenCartPlaceholder />
                </>
              )}
              {!isLoadingToken && tokens.length == 0 ? (
                <div className="tkn-not-found">
                  <strong>{"This project doesn't have any tokens :("}</strong>
                </div>
              ) : null}
              {!isLoadingToken &&
                tokens.map((item, index) => (
                  <TokenCart
                    title={`Token ${index + 1}`}
                    description={item.description}
                    boughtCount={item.boughtCount}
                    limit={item.limit}
                    price={item.price}
                    id={item.id}
                    key={item.id}
                    onBuy={handleBuy}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
      {showAlert && <Alert text={text} />}
    </>
  );
};

export default ProjectPage;
