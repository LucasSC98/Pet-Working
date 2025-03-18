import "../styles/card.css";

type CardProps = {
  loginLogo: string;
};

const card = ({ loginLogo }: CardProps) => {
  return (
    <div className="conteiner">
      <div className="card-login">{loginLogo}</div>
    </div>
  );
};

export default card;
