import { useEffect, useState } from "react";
import Like from "./Like";

interface Props {
  title: string;
  subtitle: string;
  id: number;
  expiration: string;
  investedAmount: number;
  investorCount: number;
  goal: number;
  category: string;
}

const ProjectCartDetailed = ({
  title,
  subtitle,
  expiration,
  id,
  investedAmount,
  investorCount,
  goal,
  category,
}: Props) => {
  const calcExp = (timeStamp: number) => {
    let remaining = timeStamp - Date.now();

    return remaining;
  };

  const [time, setTime] = useState<number>(
    calcExp(new Date(expiration).getTime())
  );
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t - 1000);
    }, 1000);

    const getProjectImage = async () => {
      const res = await fetch("http://localhost:3000/api/project/main-pic", {
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
        const blob = await res.blob();
        var imageUrl = URL.createObjectURL(blob);
        setImage(imageUrl);
      }
    };

    getProjectImage();

    return () => {
      clearInterval(interval);
    };
  }, []);

  const formatTime = (time: number) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    if (days > 1)
      return `${days} Days | ${padZero(hours)}:${padZero(minutes)}:${padZero(
        seconds
      )}`;
    return `${days} Day | ${padZero(hours)}:${padZero(minutes)}:${padZero(
      seconds
    )}`;
  };

  const padZero = (value: number): string => {
    return value.toString().padStart(2, "0");
  };

  const progressBarStyle = {
    width: `${(investedAmount / goal) * 100}%`,
  };

  return (
    <div className="prj-detailed shadow-lg box">
      <div className="prj-img-wrapper-detailed">
        <img
          className={"prj-img-detailed " + (image == "" && "placeholder-wave")}
          src={image == "" ? "./test.png" : image}
        />
      </div>
      <div className="prj-detail">
        <div className="prj-exp-time-detailed"><b>{formatTime(time)}</b></div>
        <div className="prj-title-detailed"><strong>{title}</strong></div>
        <hr className="prj-title-divider-detailed1" />
        <hr className="prj-title-divider-detailed2" />
        <div className="prj-subtitle-detailed"><strong>Description:</strong><br/>{subtitle}</div>
        <div className="prj-invest-detailed">
          <div className="prj-invest-amount-detailed">
          <strong>Progress: </strong>{investedAmount}/{goal} <em>Rial</em>
          </div>
          <div className="prj-invest-count-detailed">
          <strong>Investors: </strong>{investorCount}
          </div>
        </div>
        <div className="prj-category-detailed"><strong>Category: </strong>{category}</div>
        <div
          className="progress prj-progress-detailed"
          role="progressbar"
          aria-label="Success example"
          aria-valuenow={25}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="progress-bar bg-primary"
            style={progressBarStyle}
          ></div>
        </div>
        <div className="prj-like-detailed">
          <Like id={id} />
        </div>
      </div>
    </div>
  );
};

export default ProjectCartDetailed;
