import Button from "./Button";
import { useEffect, useState } from "react";

interface Props {
  title: string;
  subtitle: string;
  id: number;
  expiration: string;
  investedAmount: number;
  goal: number;
  onRedirect: (path: string) => void;
}

const ProjectCart = ({ title, subtitle, id, expiration, investedAmount, goal, onRedirect }: Props) => {
  const calcExp = (timeStamp: number) => {
    let remaining = timeStamp - Date.now();

    return remaining;
  };

  const [time, setTime] = useState<number>(calcExp(new Date(expiration).getTime()));
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
    <div className="prj shadow-lg box">
      <div className="prj-img-wrapper">
        <img className={"prj-img " + (image == "" && "placeholder-wave")} src={image == "" ? "./test.png" : image} />
      </div>
      <div className="progress prj-progress" role="progressbar" aria-label="Success example" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-bar bg-primary" style={progressBarStyle}></div>
      </div>
      <div className="prj-exp-time">{formatTime(time)}</div>
      <div className="prj-title"><b>{title}</b></div>
      <div className="prj-subtitle">{subtitle}</div>
      <Button
        color="secondary"
        className="prj-btn"
        onClick={() => onRedirect(`/project/${id}`)}
      >
        See More
      </Button>
    </div>
  );
};

export default ProjectCart;
