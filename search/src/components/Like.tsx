import Button from "./Button";
import { useState, useEffect } from "react";

interface Props {
  id: number;
}

interface Project {
  projectId: number;
}

const Like = ({ id }: Props) => {
  const [dislike, setDislike] = useState(0);
  const [dislikeColor, setDislikeColor] = useState<
    "primary" | "secondary" | "danger" | "success"
  >("secondary");
  const [like, setLike] = useState(0);
  const [likeColor, setLikeColor] = useState<
    "primary" | "secondary" | "danger" | "success"
  >("secondary");

  useEffect(() => {
    const getLikes = async () => {
      const res = await fetch("http://localhost:3000/api/project/like", {
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

      const res2 = await fetch(
        "http://localhost:3000/api/user/liked-projects",
        {
          method: "GET",
          headers: {
            "x-auth-token":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNDhjODA1NjctNGNmYi00MGI4LWI1Y2MtMWNhYjU0ZGY5NTlkIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2ODUyODAzNjR9.QhgBQmqZskspk5BRPMZm7x4AlE6aAEqMLAoLZKz34Ns",
          },
        }
      );

      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        setLike(data.length);
      }

      if (res2.ok) {
        const json2 = await res2.json();
        const data2: Project[] = json2.data;
        if (data2.map((item) => item.projectId).includes(id))
            setLikeColor("success");
      }
    };

    const getDislikes = async () => {
      const res = await fetch("http://localhost:3000/api/project/dislike", {
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

      const res2 = await fetch(
        "http://localhost:3000/api/user/disliked-projects",
        {
          method: "GET",
          headers: {
            "x-auth-token":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNDhjODA1NjctNGNmYi00MGI4LWI1Y2MtMWNhYjU0ZGY5NTlkIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2ODUyODAzNjR9.QhgBQmqZskspk5BRPMZm7x4AlE6aAEqMLAoLZKz34Ns",
          },
        }
      );

      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        setDislike(data.length);
      }

      if (res2.ok) {
        const json2 = await res2.json();
        const data2: Project[] = json2.data;
        if (data2.map((item) => item.projectId).includes(id))
            setDislikeColor("danger");
      }
    };

    getLikes();
    getDislikes();
  }, []);

  const handleClickLike = async () => {
    const res = await fetch("http://localhost:3000/api/user/like", {
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

    if (res.ok) {
      setLike(l => likeColor == "success" ? l - 1 : l + 1);
      setDislike(d => dislikeColor == "danger" ? d - 1 : d);
      setDislikeColor("secondary");
      setLikeColor(l => l == "success" ? "secondary" : "success");
    }
  };

  const handleClickDislike = async () => {
    const res = await fetch("http://localhost:3000/api/user/dislike", {
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

    if (res.ok) {
        setLike(l => likeColor == "success" ? l - 1 : l);
        setDislike(d => dislikeColor == "danger" ? d - 1 : d + 1);
        setLikeColor("secondary");
        setDislikeColor(d => d == "danger" ? "secondary" : "danger");
    }
  };

  return (
    <>
      <Button
        className="prj-like-btn"
        color={likeColor}
        onClick={handleClickLike}
      >
        <img className="prj-like-btn-icon-like" src="./like.png" />
        {like}
      </Button>
      <Button
        className="prj-like-btn"
        color={dislikeColor}
        onClick={handleClickDislike}
      >
        <img className="prj-like-btn-icon-dislike" src="./like.png" />
        {dislike}
      </Button>
    </>
  );
};

export default Like;
