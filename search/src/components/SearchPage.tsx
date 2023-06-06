import { useEffect, useState } from "react";
import ProjectCart from "./ProjectCart";
import SearchBox from "./SearchBox";
import ProjectCartPlaceholder from "./ProjectCartPlaceholder";

interface Props {
  onRedirect: (path: string) => void;
}

interface Project {
  id: number;
  title: string;
  subtitle: string;
  expirationDate: string;
  investedAmount: number;
  goal: number;
}

const SearchPage = ({ onRedirect }: Props) => {
  const [list, setList] = useState<Project[]>([]);
  const [isSearching, setIsSearching] = useState(true);

  const fetchData = async (title?: string) => {
    try {
      setIsSearching(true);
      const res = await fetch("http://localhost:3000/api/project/", {
        method: "POST",
        headers: {
          "x-auth-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNDhjODA1NjctNGNmYi00MGI4LWI1Y2MtMWNhYjU0ZGY5NTlkIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2ODUyODAzNjR9.QhgBQmqZskspk5BRPMZm7x4AlE6aAEqMLAoLZKz34Ns",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(title && { title: title }),
          status: "active",
        }),
      });

      const json = await res.json();
      const data = json.data;
      setList(data);
      setIsSearching(false);
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generatePlaceHolders = () => {
    let placeholders = [];
    for (let index = 0; index < 8; index++) {
      placeholders.push(<ProjectCartPlaceholder key={index} />);
    }
    return placeholders;
  };

  return (
    <>
      <div className="search-input">
        <SearchBox onClick={(title: string) => fetchData(title)} />
      </div>
      <div className="search-result">
        {isSearching && generatePlaceHolders()}
        {!isSearching && list.length == 0 && (
          <div className="not-found">
            <img className="not-found-img" src="./prj_404.png" />
          </div>
        )}
        {!isSearching &&
          list.map((item) => (
            <ProjectCart
              title={item.title}
              subtitle={item.subtitle}
              expiration={item.expirationDate}
              investedAmount={item.investedAmount}
              goal={item.goal}
              id={item.id}
              key={item.id}
              onRedirect={onRedirect}
            />
          ))}
      </div>
    </>
  );
};

export default SearchPage;
